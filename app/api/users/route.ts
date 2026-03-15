import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')

    const whereClause: Record<string, string> = {}
    if (role) {
      whereClause.role = role
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        rollNo: true,
        employeeId: true,
        semester: true,
        batch: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, role, password, rollNo, employeeId, semester, batch } = body

    if (!email || !name || !role || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const userData: Record<string, unknown> = {
      email,
      name,
      role,
      password: hashedPassword
    }

    if (role === 'STUDENT') {
      userData.rollNo = rollNo
      userData.semester = semester ? parseInt(semester) : null
      userData.batch = batch ? parseInt(batch) : null
    } else if (role === 'TEACHER') {
      userData.employeeId = employeeId
    }

    const user = await prisma.user.create({
      data: userData as any,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        rollNo: true,
        employeeId: true,
        semester: true,
        batch: true,
        createdAt: true
      }
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}