import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const semester = searchParams.get('semester')
    const batch = searchParams.get('batch')
    const branchId = searchParams.get('branchId')
    const degreeId = searchParams.get('degreeId')

    const where: Record<string, unknown> = { role: 'STUDENT' }
    if (semester) where.semester = parseInt(semester)
    if (batch) where.batch = parseInt(batch)
    if (branchId) where.branchId = branchId
    if (degreeId) where.degreeId = degreeId

    const students = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        rollNo: true,
        semester: true,
        batch: true,
        branchName: true,
        branchCode: true,
        degreeName: true
      },
      orderBy: [{ semester: 'asc' }, { batch: 'asc' }, { rollNo: 'asc' }]
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
