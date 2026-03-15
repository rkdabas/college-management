import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get('teacherId')

    if (!teacherId) {
      return NextResponse.json(
        { error: 'teacherId is required' },
        { status: 400 }
      )
    }

    // Total classes (from TeacherSubject count)
    const teacherSubjects = await prisma.teacherSubject.findMany({
      where: { teacherId },
      include: { subject: true }
    })
    const totalClasses = teacherSubjects.length
    const subjectIds = teacherSubjects.map((ts) => ts.subjectId)

    // Total students count (students in the subjects they teach, matching semester/batch)
    const subjects = await prisma.subject.findMany({
      where: { id: { in: subjectIds } },
      select: { semester: true, batch: true, branchId: true }
    })

    const uniqueCombos = new Map<string, { semester: number; batch: number; branchId: string }>()
    for (const s of subjects) {
      uniqueCombos.set(`${s.semester}-${s.batch}-${s.branchId}`, { semester: s.semester, batch: s.batch, branchId: s.branchId })
    }

    // Unique students across all subjects the teacher teaches
    const studentIds = new Set<string>()
    for (const { semester, batch, branchId } of Array.from(uniqueCombos.values())) {
      const students = await prisma.user.findMany({
        where: { role: 'STUDENT', semester, batch, branchId },
        select: { id: true }
      })
      students.forEach((s) => studentIds.add(s.id))
    }
    const totalStudents = studentIds.size

    // Pending grading count (AssignmentSubmission where status='submitted' and assignment is by this teacher)
    const pendingGradingCount = await prisma.assignmentSubmission.count({
      where: {
        status: 'submitted',
        assignment: { teacherId }
      }
    })

    // Today's classes from timetable
    const today = DAYS[new Date().getDay()]
    const todayClasses = await prisma.timetableEntry.findMany({
      where: {
        subjectId: { in: subjectIds },
        dayOfWeek: today
      },
      include: {
        subject: { select: { id: true, name: true, code: true } }
      },
      orderBy: { startTime: 'asc' }
    })

    // Recent activities summary (extracurriculars they manage)
    const recentActivities = await prisma.extracurricularActivity.findMany({
      where: { teacherId },
      include: {
        student: { select: { id: true, name: true, rollNo: true } }
      },
      orderBy: { date: 'desc' },
      take: 5
    })

    return NextResponse.json({
      totalClasses,
      totalStudents,
      pendingGradingCount,
      todayClasses: todayClasses.map((c) => ({
        subject: c.subject,
        startTime: c.startTime,
        endTime: c.endTime,
        room: c.room
      })),
      recentActivities: recentActivities.map((a) => ({
        id: a.id,
        activityName: a.activityName,
        activityType: a.activityType,
        date: a.date,
        achievement: a.achievement,
        status: a.status,
        student: a.student
      }))
    })
  } catch (error) {
    console.error('Error fetching teacher dashboard:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
