import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const record = await prisma.submittedRecord.findUnique({
      where: { id: params.id },
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
      }
    })

    if (!record) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 })
    }

    // Check permissions
    if (
      session.user.role !== 'ADMIN' && 
      record.submitterId !== session.user.id
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(record)
  } catch (error) {
    console.error('Error fetching record:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only admins can update record status' }, { status: 403 })
    }

    const body = await request.json()
    const { status, adminRemarks } = body

    if (!status || !['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const record = await prisma.submittedRecord.update({
      where: { id: params.id },
      data: {
        status,
        adminRemarks,
        reviewerId: session.user.id
      },
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
      }
    })

    return NextResponse.json(record)
  } catch (error) {
    console.error('Error updating record:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const record = await prisma.submittedRecord.findUnique({
      where: { id: params.id }
    })

    if (!record) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 })
    }

    // Only admins or the submitter can delete
    if (
      session.user.role !== 'ADMIN' && 
      record.submitterId !== session.user.id
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.submittedRecord.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Record deleted successfully' })
  } catch (error) {
    console.error('Error deleting record:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}