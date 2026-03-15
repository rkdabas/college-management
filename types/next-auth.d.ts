import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      studentId?: string | null
      teacherId?: string | null
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: string
    studentId?: string | null
    teacherId?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    studentId?: string | null
    teacherId?: string | null
  }
}