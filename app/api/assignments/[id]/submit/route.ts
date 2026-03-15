import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: assignmentId } = params
    const body = await request.json()
    const { studentId } = body

    if (!studentId) {
      return NextResponse.json(
        { error: 'studentId is required' },
        { status: 400 }
      )
    }

    const existing = await prisma.assignmentSubmission.findUnique({
      where: {
        assignmentId_studentId: { assignmentId, studentId }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Already submitted' },
        { status: 400 }
      )
    }

    const submission = await prisma.assignmentSubmission.create({
      data: {
        assignmentId,
        studentId
      },
      include: {
        assignment: { select: { id: true, title: true } },
        student: { select: { id: true, name: true, rollNo: true } }
      }
    })

    return NextResponse.json(submission, { status: 201 })
  } catch (error) {
    console.error('Error creating submission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
