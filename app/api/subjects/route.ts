import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const degreeId = searchParams.get('degreeId')
    const branchId = searchParams.get('branchId')
    const semester = searchParams.get('semester')
    const batch = searchParams.get('batch')
    const teacherId = searchParams.get('teacherId')

    if (teacherId) {
      const teacherSubjects = await prisma.teacherSubject.findMany({
        where: { teacherId },
        include: {
          subject: true
        }
      })
      return NextResponse.json(teacherSubjects.map((ts) => ts.subject))
    }

    const where: Record<string, unknown> = {}
    if (degreeId) where.degreeId = degreeId
    if (branchId) where.branchId = branchId
    if (semester) where.semester = parseInt(semester)
    if (batch) where.batch = parseInt(batch)

    const subjects = await prisma.subject.findMany({
      where,
      orderBy: [{ semester: 'asc' }, { code: 'asc' }]
    })

    return NextResponse.json(subjects)
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
