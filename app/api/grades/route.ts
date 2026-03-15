import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const semester = searchParams.get('semester')
    const subjectId = searchParams.get('subjectId')
    const type = searchParams.get('type')

    const where: Record<string, unknown> = {}
    if (studentId) where.studentId = studentId
    if (semester) where.semester = parseInt(semester)
    if (subjectId) where.subjectId = subjectId
    if (type) where.type = type

    const grades = await prisma.grade.findMany({
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
        },
        student: {
          select: {
            id: true,
            name: true,
            rollNo: true
          }
        }
      },
      orderBy: [{ semester: 'desc' }, { createdAt: 'desc' }]
    })

    return NextResponse.json(grades)
  } catch (error) {
    console.error('Error fetching grades:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, subjectId, semester, type, grade, marks, totalMarks, points } = body

    if (!studentId || !subjectId || semester == null || !type) {
      return NextResponse.json(
        { error: 'studentId, subjectId, semester, and type are required' },
        { status: 400 }
      )
    }

    const gradeRecord = await prisma.grade.create({
      data: {
        studentId,
        subjectId,
        semester: parseInt(semester),
        type,
        grade: grade ?? undefined,
        marks: marks != null ? parseFloat(marks) : undefined,
        totalMarks: totalMarks != null ? parseFloat(totalMarks) : 100,
        points: points != null ? parseFloat(points) : undefined
      },
      include: {
        subject: { select: { id: true, name: true, code: true } },
        student: { select: { id: true, name: true, rollNo: true } }
      }
    })

    return NextResponse.json(gradeRecord, { status: 201 })
  } catch (error) {
    console.error('Error creating grade:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
