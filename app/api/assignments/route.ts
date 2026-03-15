import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subjectId = searchParams.get('subjectId')
    const teacherId = searchParams.get('teacherId')
    const studentId = searchParams.get('studentId')

    if (studentId) {
      const student = await prisma.user.findUnique({
        where: { id: studentId },
        select: { semester: true, batch: true, branchId: true }
      })
      if (!student || student.semester == null || student.batch == null || !student.branchId) {
        return NextResponse.json(
          { error: 'Student not found or missing semester/batch/branch' },
          { status: 400 }
        )
      }
      const subjects = await prisma.subject.findMany({
        where: {
          semester: student.semester,
          batch: student.batch,
          branchId: student.branchId
        },
        select: { id: true }
      })
      const subjectIds = subjects.map((s) => s.id)

      const assignments = await prisma.assignment.findMany({
        where: { subjectId: { in: subjectIds } },
        include: {
          subject: { select: { id: true, name: true, code: true } },
          teacher: { select: { id: true, name: true } },
          _count: { select: { submissions: true } },
          submissions: { where: { studentId }, select: { id: true } }
        },
        orderBy: { dueDate: 'desc' }
      })
      return NextResponse.json(assignments.map(({ _count, submissions, ...a }) => ({
        ...a,
        submissionCount: _count.submissions,
        submitted: Array.isArray(submissions) && submissions.length > 0
      })))
    }

    const where: Record<string, unknown> = {}
    if (subjectId) where.subjectId = subjectId
    if (teacherId) where.teacherId = teacherId

    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        subject: { select: { id: true, name: true, code: true } },
        teacher: { select: { id: true, name: true } },
        _count: { select: { submissions: true } }
      },
      orderBy: { dueDate: 'desc' }
    })

    return NextResponse.json(assignments.map(({ _count, ...a }) => ({
      ...a,
      submissionCount: _count.submissions
    })))
  } catch (error) {
    console.error('Error fetching assignments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, subjectId, teacherId, dueDate, totalMarks } = body

    if (!title || !subjectId || !teacherId || !dueDate) {
      return NextResponse.json(
        { error: 'title, description, subjectId, teacherId, and dueDate are required' },
        { status: 400 }
      )
    }

    const assignment = await prisma.assignment.create({
      data: {
        title: title || '',
        description: description || '',
        subjectId,
        teacherId,
        dueDate,
        totalMarks: totalMarks ?? 100
      },
      include: {
        subject: { select: { id: true, name: true, code: true } },
        teacher: { select: { id: true, name: true } }
      }
    })

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    console.error('Error creating assignment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
