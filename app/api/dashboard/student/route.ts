import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')

    if (!studentId) {
      return NextResponse.json(
        { error: 'studentId is required' },
        { status: 400 }
      )
    }

    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: { semester: true, batch: true, branchId: true, degreeId: true }
    })

    if (!student || student.semester == null || student.batch == null || !student.branchId) {
      return NextResponse.json(
        { error: 'Student not found or missing semester/batch/branch' },
        { status: 400 }
      )
    }

    // Attendance stats
    const attendances = await prisma.attendance.findMany({
      where: { studentId },
      include: { subject: { select: { id: true, name: true, code: true } } }
    })

    const bySubject = new Map<string, { subject: { id: string; name: string; code: string }; present: number; total: number }>()
    for (const a of attendances) {
      const key = a.subjectId
      if (!bySubject.has(key)) {
        bySubject.set(key, { subject: a.subject, present: 0, total: 0 })
      }
      const entry = bySubject.get(key)!
      entry.total += 1
      if (a.status === 'present') entry.present += 1
    }

    const totalPresent = Array.from(bySubject.values()).reduce((s, p) => s + p.present, 0)
    const totalCount = Array.from(bySubject.values()).reduce((s, p) => s + p.total, 0)
    const overallAttendancePercentage = totalCount > 0 ? Math.round((totalPresent / totalCount) * 100) : 0

    const attendancePerSubject = Array.from(bySubject.values()).map(({ subject, present, total }) => ({
      subjectName: subject.name,
      subjectCode: subject.code,
      presentCount: present,
      totalCount: total,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0
    }))

    // Today's classes from timetable
    const today = DAYS[new Date().getDay()]
    const todayClasses = await prisma.timetableEntry.findMany({
      where: {
        dayOfWeek: today,
        semester: student.semester,
        batch: student.batch,
        branchId: student.branchId
      },
      include: {
        subject: { select: { id: true, name: true, code: true } }
      },
      orderBy: { startTime: 'asc' }
    })

    // Pending assignments count (assignments not yet submitted)
    const subjects = await prisma.subject.findMany({
      where: {
        semester: student.semester,
        batch: student.batch,
        branchId: student.branchId
      },
      select: { id: true }
    })
    const subjectIds = subjects.map((s) => s.id)

    const allAssignments = await prisma.assignment.findMany({
      where: { subjectId: { in: subjectIds }, status: 'active' },
      select: { id: true }
    })

    const submissions = await prisma.assignmentSubmission.findMany({
      where: {
        studentId,
        assignmentId: { in: allAssignments.map((a) => a.id) }
      },
      select: { assignmentId: true }
    })
    const submittedIds = new Set(submissions.map((s) => s.assignmentId))
    const pendingAssignmentsCount = allAssignments.filter((a) => !submittedIds.has(a.id)).length

    // Recent grades
    const recentGrades = await prisma.grade.findMany({
      where: { studentId },
      include: {
        subject: { select: { id: true, name: true, code: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    // Upcoming events
    const todayStr = new Date().toISOString().split('T')[0]
    const upcomingEvents = await prisma.event.findMany({
      where: {
        status: { in: ['upcoming', 'ongoing'] },
        startDate: { gte: todayStr }
      },
      include: {
        _count: { select: { registrations: true } }
      },
      orderBy: { startDate: 'asc' },
      take: 5
    })

    return NextResponse.json({
      attendanceStats: {
        overallPercentage: overallAttendancePercentage,
        totalPresent,
        totalCount,
        perSubject: attendancePerSubject
      },
      todayClasses: todayClasses.map((c) => ({
        subject: c.subject,
        startTime: c.startTime,
        endTime: c.endTime,
        room: c.room
      })),
      pendingAssignmentsCount,
      recentGrades: recentGrades.map((g) => ({
        subject: g.subject,
        type: g.type,
        grade: g.grade,
        marks: g.marks,
        totalMarks: g.totalMarks
      })),
      upcomingEvents: upcomingEvents.map((e) => ({
        id: e.id,
        title: e.title,
        type: e.type,
        startDate: e.startDate,
        endDate: e.endDate,
        venue: e.venue,
        registrationCount: e._count.registrations
      }))
    })
  } catch (error) {
    console.error('Error fetching student dashboard:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
