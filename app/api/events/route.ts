import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const studentId = searchParams.get('studentId')

    const where: Record<string, unknown> = {}
    if (status) where.status = status

    const events = await prisma.event.findMany({
      where,
      include: {
        _count: { select: { registrations: true } },
        ...(studentId ? { registrations: { where: { studentId }, select: { id: true } } } : {})
      },
      orderBy: { startDate: 'asc' }
    })

    return NextResponse.json(events.map(({ _count, registrations, ...e }) => ({
      ...e,
      registrationCount: _count.registrations,
      ...(studentId && Array.isArray(registrations) ? { registered: registrations.length > 0 } : {})
    })))
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, type, startDate, endDate, venue, organizer, createdById } = body

    if (!title || !type || !startDate || !endDate || !venue || !createdById) {
      return NextResponse.json(
        { error: 'title, type, startDate, endDate, venue, and createdById are required' },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        title,
        description: description ?? '',
        type,
        startDate,
        endDate,
        venue,
        organizer: organizer ?? undefined,
        createdById
      },
      include: {
        createdBy: { select: { id: true, name: true } }
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
