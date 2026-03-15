import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')

    const where: Record<string, unknown> = {}
    if (studentId) where.studentId = studentId

    const issues = await prisma.bookIssue.findMany({
      where,
      include: {
        book: true,
        student: {
          select: {
            id: true,
            name: true,
            rollNo: true
          }
        }
      },
      orderBy: { issueDate: 'desc' }
    })

    return NextResponse.json(issues)
  } catch (error) {
    console.error('Error fetching book issues:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookId, studentId, issueDate, dueDate } = body

    if (!bookId || !studentId || !issueDate || !dueDate) {
      return NextResponse.json(
        { error: 'bookId, studentId, issueDate, and dueDate are required' },
        { status: 400 }
      )
    }

    const book = await prisma.libraryBook.findUnique({
      where: { id: bookId }
    })

    if (!book || book.available <= 0) {
      return NextResponse.json(
        { error: 'Book not available' },
        { status: 400 }
      )
    }

    const [issue] = await prisma.$transaction([
      prisma.bookIssue.create({
        data: {
          bookId,
          studentId,
          issueDate,
          dueDate
        },
        include: {
          book: true,
          student: { select: { id: true, name: true, rollNo: true } }
        }
      }),
      prisma.libraryBook.update({
        where: { id: bookId },
        data: { available: { decrement: 1 } }
      })
    ])

    return NextResponse.json(issue, { status: 201 })
  } catch (error) {
    console.error('Error issuing book:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, action } = body

    if (!id || !action) {
      return NextResponse.json(
        { error: 'id and action (return | renew) are required' },
        { status: 400 }
      )
    }

    const issue = await prisma.bookIssue.findUnique({
      where: { id },
      include: { book: true }
    })

    if (!issue) {
      return NextResponse.json(
        { error: 'Book issue not found' },
        { status: 404 }
      )
    }

    if (action === 'return') {
      const today = new Date().toISOString().split('T')[0]
      const [updated] = await prisma.$transaction([
        prisma.bookIssue.update({
          where: { id },
          data: {
            returnDate: today,
            status: 'returned'
          },
          include: {
            book: true,
            student: { select: { id: true, name: true, rollNo: true } }
          }
        }),
        prisma.libraryBook.update({
          where: { id: issue.bookId },
          data: { available: { increment: 1 } }
        })
      ])
      return NextResponse.json(updated)
    }

    if (action === 'renew') {
      const currentDue = new Date(issue.dueDate)
      const newDue = new Date(currentDue)
      newDue.setDate(newDue.getDate() + 14)

      const updated = await prisma.bookIssue.update({
        where: { id },
        data: {
          dueDate: newDue.toISOString().split('T')[0]
        },
        include: {
          book: true,
          student: { select: { id: true, name: true, rollNo: true } }
        }
      })
      return NextResponse.json(updated)
    }

    return NextResponse.json(
      { error: 'action must be return or renew' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating book issue:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
