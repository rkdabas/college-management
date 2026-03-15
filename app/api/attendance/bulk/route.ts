import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const records = Array.isArray(body) ? body : body.records

    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { error: 'Array of {studentId, subjectId, date, status} is required' },
        { status: 400 }
      )
    }

    let count = 0
    for (const r of records) {
      try {
        await prisma.attendance.upsert({
          where: {
            studentId_subjectId_date: {
              studentId: r.studentId,
              subjectId: r.subjectId,
              date: r.date
            }
          },
          update: { status: r.status },
          create: {
            studentId: r.studentId,
            subjectId: r.subjectId,
            date: r.date,
            status: r.status
          }
        })
        count++
      } catch {
        // Skip individual failures
      }
    }

    return NextResponse.json({
      count,
      message: `Processed ${count} attendance records`
    }, { status: 201 })
  } catch (error) {
    console.error('Error bulk creating attendance:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}