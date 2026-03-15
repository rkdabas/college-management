import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')

    if (!studentId) {
      return NextResponse.json(
        { error: 'studentId is required' },
        { status: 400 }
      )
    }

    const attendances = await prisma.attendance.findMany({
      where: { studentId },
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

    // Group by subjectId
    const bySubject = new Map<
      string,
      { subject: { id: string; name: string; code: string }; present: number; total: number }
    >()

    for (const a of attendances) {
      const key = a.subjectId
      if (!bySubject.has(key)) {
        bySubject.set(key, {
          subject: a.subject,
          present: 0,
          total: 0
        })
      }
      const entry = bySubject.get(key)!
      entry.total += 1
      if (a.status === 'present') entry.present += 1
    }

    const perSubject = Array.from(bySubject.values()).map(({ subject, present, total }) => ({
      subjectName: subject.name,
      subjectCode: subject.code,
      subjectId: subject.id,
      presentCount: present,
      totalCount: total,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0
    }))

    const totalPresent = perSubject.reduce((s, p) => s + p.presentCount, 0)
    const totalCount = perSubject.reduce((s, p) => s + p.totalCount, 0)
    const overallPercentage = totalCount > 0 ? Math.round((totalPresent / totalCount) * 100) : 0

    return NextResponse.json({
      overallPercentage,
      totalPresent,
      totalCount,
      perSubject
    })
  } catch (error) {
    console.error('Error fetching attendance stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
