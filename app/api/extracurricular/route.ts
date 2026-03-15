import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const teacherId = searchParams.get('teacherId')

    const where: Record<string, unknown> = {}
    if (studentId) where.studentId = studentId
    if (teacherId) where.teacherId = teacherId

    const activities = await prisma.extracurricularActivity.findMany({
      where,
      include: {
        student: { select: { id: true, name: true, rollNo: true } },
        teacher: { select: { id: true, name: true } }
      },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json(activities)
  } catch (error) {
    console.error('Error fetching extracurricular activities:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, teacherId, activityType, activityName, description, date, achievement, points } = body

    if (!studentId || !activityType || !activityName || !date) {
      return NextResponse.json(
        { error: 'studentId, activityType, activityName, and date are required' },
        { status: 400 }
      )
    }

    const activity = await prisma.extracurricularActivity.create({
      data: {
        studentId,
        teacherId: teacherId ?? undefined,
        activityType,
        activityName,
        description: description ?? undefined,
        date,
        achievement: achievement ?? undefined,
        points: points ?? 0
      },
      include: {
        student: { select: { id: true, name: true, rollNo: true } },
        teacher: { select: { id: true, name: true } }
      }
    })

    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    console.error('Error creating extracurricular activity:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      )
    }

    const activity = await prisma.extracurricularActivity.update({
      where: { id },
      data: { status: status ?? undefined },
      include: {
        student: { select: { id: true, name: true, rollNo: true } },
        teacher: { select: { id: true, name: true } }
      }
    })

    return NextResponse.json(activity)
  } catch (error) {
    console.error('Error updating extracurricular activity:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
