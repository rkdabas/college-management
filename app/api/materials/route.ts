import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subjectId = searchParams.get('subjectId')
    const teacherId = searchParams.get('teacherId')
    const semester = searchParams.get('semester')
    const batch = searchParams.get('batch')

    const where: Record<string, unknown> = {}
    if (subjectId) where.subjectId = subjectId
    if (teacherId) where.teacherId = teacherId
    if (semester || batch) {
      where.subject = {}
      if (semester) (where.subject as Record<string, unknown>).semester = parseInt(semester)
      if (batch) (where.subject as Record<string, unknown>).batch = parseInt(batch)
    }

    const materials = await prisma.material.findMany({
      where,
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
            semester: true,
            batch: true
          }
        },
        teacher: {
          select: {
            id: true,
            name: true,
            employeeId: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(materials)
  } catch (error) {
    console.error('Error fetching materials:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, subjectId, teacherId, type, fileSize } = body

    if (!title || !subjectId || !teacherId) {
      return NextResponse.json(
        { error: 'title, subjectId, and teacherId are required' },
        { status: 400 }
      )
    }

    const material = await prisma.material.create({
      data: {
        title,
        description: description ?? undefined,
        subjectId,
        teacherId,
        type: type ?? 'document',
        fileSize: fileSize ?? undefined
      },
      include: {
        subject: { select: { id: true, name: true, code: true } },
        teacher: { select: { id: true, name: true } }
      }
    })

    return NextResponse.json(material, { status: 201 })
  } catch (error) {
    console.error('Error creating material:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'id is required in body' },
        { status: 400 }
      )
    }

    await prisma.material.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting material:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
