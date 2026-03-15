# College ERP Portal

A comprehensive Enterprise Resource Planning (ERP) system for educational institutions built with Next.js, TypeScript, and SQLite.

## Features

- **Multi-role Authentication**: Admin, Teacher, and Student roles
- **Records Management**: Submit, review, and approve academic records
- **Real-time Dashboard**: Track pending, approved, and rejected records
- **Secure API**: RESTful API with authentication and authorization
- **Database Integration**: SQLite database with Prisma ORM

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with JWT
- **UI Components**: Custom components with Lucide React icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. Seed the database with initial data:
   ```bash
   npm run db:seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The application uses the following main entities:

- **Users**: Admins, teachers, and students with role-based access
- **SubmittedRecords**: Academic records submitted by teachers for admin review
- **Courses**: Course information with credits and semester details
- **Departments**: Academic departments

## API Endpoints

- `GET/POST /api/records` - Fetch and create records
- `GET/PATCH/DELETE /api/records/[id]` - Individual record operations
- `GET/POST /api/users` - User management (admin only)
- `POST /api/auth/[nextauth]` - Authentication endpoints

## Default Credentials

### Admin
- Email: admin@college.edu
- Password: admin123

### Teacher
- Email: rajesh.kumar@college.edu
- Password: teacher123

### Student
- Email: student1@college.edu
- Password: student123

## Environment Variables

Create a `.env` file with:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="your-jwt-secret-here"
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with initial data

## Architecture

The application follows a modern full-stack architecture:

- **Frontend**: Server-side rendered React components with client-side interactivity
- **API Layer**: RESTful API built with Next.js API routes
- **Database Layer**: SQLite database with Prisma ORM for type-safe queries
- **Authentication**: JWT-based authentication with NextAuth.js

## Scalability

The current setup supports:
- **Users**: 5,000+ users
- **Daily Active Users**: 1,000-2,000
- **Database**: SQLite is suitable for this scale; can be migrated to PostgreSQL for larger deployments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.