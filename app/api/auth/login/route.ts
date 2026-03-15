import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, role } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Look up user: by email, rollNo (students), or employeeId (teachers)
    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Try rollNo for students
      user = await prisma.user.findUnique({
        where: { rollNo: email }
      })
    }

    if (!user) {
      // Try employeeId for teachers
      user = await prisma.user.findUnique({
        where: { employeeId: email }
      })
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    if (role && user.role.toLowerCase() !== role.toLowerCase()) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
