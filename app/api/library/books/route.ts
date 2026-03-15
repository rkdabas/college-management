import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {}
    if (search && search.trim()) {
      where.OR = [
        { title: { contains: search } },
        { author: { contains: search } }
      ]
    }

    const books = await prisma.libraryBook.findMany({
      where,
      orderBy: { title: 'asc' }
    })

    return NextResponse.json(books)
  } catch (error) {
    console.error('Error fetching library books:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
