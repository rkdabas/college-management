import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const submitterId = searchParams.get('submitterId') || searchParams.get('teacherId')

    let whereClause: any = {}

    // Filter by submitter: session (when available) or query param for client-side auth
    if (submitterId) {
      whereClause.submitterId = submitterId
    } else if (session?.user?.role === 'TEACHER') {
      whereClause.submitterId = session.user.id
    } else if (!session && !submitterId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    // Filter by status
    if (status) {
      whereClause.status = status
    }

    // Filter by type
    if (type) {
      whereClause.type = type
    }

    // Search functionality
    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { subject: { contains: search } },
        { submitter: { name: { contains: search } } }
      ]
    }

    const records = await prisma.submittedRecord.findMany({
      where: whereClause,
      include: {
        submitter: {
          select: {
            id: true,
            name: true,
            employeeId: true
          }
        },
        reviewer: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        submittedAt: 'desc'
      }
    })

    return NextResponse.json(records)
  } catch (error) {
    console.error('Error fetching records:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { title, description, type, subject, semester, batch, submitterId } = body

    if (!title || !description || !type || !subject || !semester || !batch) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const resolvedSubmitterId = submitterId || session?.user?.id
    if (!resolvedSubmitterId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const record = await prisma.submittedRecord.create({
      data: {
        title,
        description,
        type,
        subject,
        semester: parseInt(semester),
        batch: parseInt(batch),
        submitterId: resolvedSubmitterId
      },
      include: {
        submitter: {
          select: {
            id: true,
            name: true,
            employeeId: true
          }
        }
      }
    })

    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    console.error('Error creating record:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}