import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const leaves = await prisma.leaveApplication.findMany({
      where: { userId },
      orderBy: { appliedAt: 'desc' },
      include: {
        reviewer: { select: { id: true, name: true } }
      }
    })

    return NextResponse.json(leaves)
  } catch (error) {
    console.error('Error fetching leave applications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, fromDate, toDate, reason, type } = body

    if (!userId || !fromDate || !toDate || !reason) {
      return NextResponse.json(
        { error: 'userId, fromDate, toDate, and reason are required' },
        { status: 400 }
      )
    }

    const leave = await prisma.leaveApplication.create({
      data: {
        userId,
        fromDate,
        toDate,
        reason,
        type: type ?? 'personal'
      },
      include: {
        user: { select: { id: true, name: true } }
      }
    })

    return NextResponse.json(leave, { status: 201 })
  } catch (error) {
    console.error('Error creating leave application:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, reviewerId, adminRemarks } = body

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      )
    }

    const leave = await prisma.leaveApplication.update({
      where: { id },
      data: {
        status: status ?? undefined,
        reviewerId: reviewerId ?? undefined,
        adminRemarks: adminRemarks ?? undefined
      },
      include: {
        user: { select: { id: true, name: true } },
        reviewer: { select: { id: true, name: true } }
      }
    })

    return NextResponse.json(leave)
  } catch (error) {
    console.error('Error updating leave application:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
