import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const teachers = await prisma.user.findMany({
      where: { role: 'TEACHER' },
      include: {
        teacherSubjects: {
          include: {
            subject: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    const result = teachers.map(({ teacherSubjects, password: _, ...t }) => ({
      ...t,
      subjects: teacherSubjects.map((ts) => ts.subject)
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching teachers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
