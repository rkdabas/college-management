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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        rollNo: true,
        semester: true,
        batch: true,
        degreeId: true,
        degreeName: true,
        branchId: true,
        branchName: true,
        branchCode: true,
        dateOfBirth: true,
        address: true,
        guardianName: true,
        guardianPhone: true,
        admissionDate: true,
        employeeId: true,
        departmentId: true,
        departmentName: true,
        designation: true,
        qualification: true,
        experience: true,
        joiningDate: true,
        salary: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const userId = body.userId ?? body.id

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const { userId: _, id: __, password, ...updateData } = body

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        status: true,
        rollNo: true,
        semester: true,
        batch: true,
        degreeName: true,
        branchName: true,
        branchCode: true,
        dateOfBirth: true,
        address: true,
        guardianName: true,
        guardianPhone: true,
        employeeId: true,
        departmentName: true,
        designation: true,
        qualification: true,
        experience: true,
        joiningDate: true
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
