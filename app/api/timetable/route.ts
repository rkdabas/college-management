import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const semester = searchParams.get('semester')
    const batch = searchParams.get('batch')
    const branchId = searchParams.get('branchId')
    const degreeId = searchParams.get('degreeId')
    const teacherId = searchParams.get('teacherId')

    if (teacherId) {
      // Find subjects the teacher teaches
      const teacherSubjects = await prisma.teacherSubject.findMany({
        where: { teacherId },
        select: { subjectId: true }
      })
      const subjectIds = teacherSubjects.map((ts) => ts.subjectId)

      const timetable = await prisma.timetableEntry.findMany({
        where: { subjectId: { in: subjectIds } },
        include: {
          subject: {
            select: {
              id: true,
              name: true,
              code: true,
              semester: true,
              batch: true
            }
          }
        },
        orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }]
      })
      return NextResponse.json(timetable)
    }

    const where: Record<string, unknown> = {}
    if (semester) where.semester = parseInt(semester)
    if (batch) where.batch = parseInt(batch)
    if (branchId) where.branchId = branchId
    if (degreeId) where.degreeId = degreeId

    const timetable = await prisma.timetableEntry.findMany({
      where,
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
            semester: true,
            batch: true
          }
        }
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }]
    })

    return NextResponse.json(timetable)
  } catch (error) {
    console.error('Error fetching timetable:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subjectId, dayOfWeek, startTime, endTime, room, semester, batch, branchId, degreeId } = body

    if (!subjectId || !dayOfWeek || !startTime || !endTime || !room || semester == null || batch == null || !branchId || !degreeId) {
      return NextResponse.json(
        { error: 'subjectId, dayOfWeek, startTime, endTime, room, semester, batch, branchId, degreeId are required' },
        { status: 400 }
      )
    }

    const entry = await prisma.timetableEntry.create({
      data: {
        subjectId,
        dayOfWeek,
        startTime,
        endTime,
        room,
        semester: parseInt(semester),
        batch: parseInt(batch),
        branchId,
        degreeId
      },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error('Error creating timetable entry:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
