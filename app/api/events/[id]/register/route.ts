import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: eventId } = params
    const body = await request.json()
    const { studentId } = body

    if (!studentId) {
      return NextResponse.json(
        { error: 'studentId is required' },
        { status: 400 }
      )
    }

    const existing = await prisma.eventRegistration.findUnique({
      where: {
        eventId_studentId: { eventId, studentId }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Already registered' },
        { status: 400 }
      )
    }

    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        studentId
      },
      include: {
        event: { select: { id: true, title: true } },
        student: { select: { id: true, name: true, rollNo: true } }
      }
    })

    return NextResponse.json(registration, { status: 201 })
  } catch (error) {
    console.error('Error registering for event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: eventId } = params
    const body = await request.json()
    const { studentId } = body

    if (!studentId) {
      return NextResponse.json(
        { error: 'studentId is required in body' },
        { status: 400 }
      )
    }

    await prisma.eventRegistration.delete({
      where: {
        eventId_studentId: { eventId, studentId }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error unregistering from event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
