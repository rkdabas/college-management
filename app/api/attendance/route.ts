import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const subjectId = searchParams.get('subjectId')
    const semester = searchParams.get('semester')
    const batch = searchParams.get('batch')
    const date = searchParams.get('date')

    const where: Record<string, unknown> = {}

    if (studentId) where.studentId = studentId
    if (subjectId) where.subjectId = subjectId
    if (date) where.date = date
    const subjectWhere: Record<string, unknown> = {}
    if (semester) subjectWhere.semester = parseInt(semester)
    if (batch) subjectWhere.batch = parseInt(batch)
    if (Object.keys(subjectWhere).length > 0) where.subject = subjectWhere

    const attendances = await prisma.attendance.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            rollNo: true,
            semester: true,
            batch: true
          }
        },
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
      orderBy: { date: 'desc' }
    })

    return NextResponse.json(attendances)
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, subjectId, date, status } = body

    if (!studentId || !subjectId || !date || !status) {
      return NextResponse.json(
        { error: 'studentId, subjectId, date, and status are required' },
        { status: 400 }
      )
    }

    const attendance = await prisma.attendance.create({
      data: {
        studentId,
        subjectId,
        date,
        status
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            rollNo: true
          }
        },
        subject: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    })

    return NextResponse.json(attendance, { status: 201 })
  } catch (error) {
    console.error('Error creating attendance:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
