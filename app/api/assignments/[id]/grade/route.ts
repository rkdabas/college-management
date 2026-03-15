import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: assignmentId } = params
    const body = await request.json()
    const { studentId, grade, marks, feedback } = body

    if (!studentId) {
      return NextResponse.json(
        { error: 'studentId is required' },
        { status: 400 }
      )
    }

    const submission = await prisma.assignmentSubmission.findUnique({
      where: {
        assignmentId_studentId: { assignmentId, studentId }
      }
    })

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    const updated = await prisma.assignmentSubmission.update({
      where: {
        assignmentId_studentId: { assignmentId, studentId }
      },
      data: {
        grade: grade ?? undefined,
        marks: marks != null ? parseFloat(marks) : undefined,
        feedback: feedback ?? undefined,
        status: 'graded'
      },
      include: {
        student: { select: { id: true, name: true, rollNo: true } }
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error grading submission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
