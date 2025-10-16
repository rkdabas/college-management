# College ERP Portal

A comprehensive Enterprise Resource Planning (ERP) system for educational institutions built with Next.js 14, TypeScript, and Tailwind CSS.

## Academic Structure

This ERP follows a proper hierarchical academic structure:

```
COLLEGE
  └── DEGREE (B.Tech, M.Tech, MBA, BCA, etc.)
      └── COURSE/PROGRAM (Engineering, Business Administration, etc.)
          └── BRANCH/SPECIALIZATION (CSE, ME, ECE, Marketing, etc.)
              └── SEMESTER (1-8 depending on degree)
                  └── BATCH (Admission year: 2021, 2022, 2023, etc.)
```

Students are identified by: **Degree → Course → Branch → Semester → Batch**

Example: B.Tech → Engineering → Computer Science (CSE) → Semester 6 → Batch 2021

**Roll Number Format:** `21CSE001` (Batch + Branch Code + Serial Number)

For detailed information, see [ACADEMIC_STRUCTURE.md](./ACADEMIC_STRUCTURE.md)

## Features

### Admin Portal
- **Academic Structure Management**: Manage degrees, courses, branches, and batches
- **Dashboard**: Real-time analytics, statistics, and visualizations
- **Student Management**: Complete student information system with proper academic hierarchy
- **Faculty Management**: Teacher profiles, courses, schedules, and performance metrics
- **Course Management**: Course creation, enrollment tracking, and credit management
- **Event Management**: Create and manage college events with registration tracking
- **Attendance System**: Track and monitor student attendance with analytics
- **Library Management System**: Comprehensive library operations including:
  - Book inventory with 6 major categories and sub-categories
  - Issue/Return tracking with automated fine calculation
  - Overdue management with reminder system
  - Member management (Students & Faculty)
  - Digital resources (E-books, Journals, Research Papers, Videos)
  - Real-time statistics and analytics
  - Advanced search and filtering capabilities
- **Announcements**: College-wide announcement system with priority levels
- **Reports & Analytics**: Generate comprehensive reports in PDF and Excel formats
- **System Settings**: Configure system preferences and notifications

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with shadcn/ui patterns
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd erp
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Login Credentials

**Admin:**
- Username: `admin`
- Password: `admin123`

## Project Structure

```
erp/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard and pages
│   │   ├── dashboard/     # Main dashboard
│   │   ├── academic-structure/ # Academic structure management
│   │   ├── students/      # Student management
│   │   ├── faculty/       # Faculty management
│   │   ├── events/        # Event management
│   │   ├── courses/       # Course management
│   │   ├── attendance/    # Attendance tracking
│   │   ├── library/       # Library system
│   │   ├── announcements/ # Announcement system
│   │   ├── reports/       # Reports and analytics
│   │   └── settings/      # System settings
│   ├── login/             # Authentication
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # UI components (Button, Card, Input, etc.)
│   └── admin/            # Admin-specific components
│       ├── sidebar.tsx   # Navigation sidebar
│       └── header.tsx    # Dashboard header
├── lib/                   # Utility functions and data
│   ├── utils.ts          # Helper functions
│   ├── store.ts          # Zustand state management
│   └── demo-data.ts      # Demo data for the application
├── public/               # Static assets
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── next.config.mjs       # Next.js configuration
```

## Features in Detail

### Dashboard
- Student, faculty, and course statistics
- Department-wise student distribution chart
- Today's attendance overview with pie chart
- Recent activities timeline
- Upcoming events calendar

### Student Management
- Student list with search and filter
- Add new student with comprehensive form
- Student profile with academic information
- Attendance and performance tracking
- Guardian information management

### Faculty Management
- Faculty directory with search functionality
- Faculty profile with professional details
- Teaching courses and timetable
- Department-wise faculty distribution
- Experience and qualification tracking

### Event Management
- Create and manage events
- Event type categorization (Academic, Cultural, Sports, Workshop, Seminar)
- Registration tracking and statistics
- Event schedule and venue management
- Participant management

### Library Management System
- **6 View Modes:**
  - Book Inventory: Complete catalog with ISBN, location, and availability
  - Issued Books: Track all currently issued books
  - Overdue Books: Automated fine calculation (₹10/day)
  - Members: Student and faculty library accounts
  - Digital Resources: Access to online journals, e-books, and videos
  - Statistics: Analytics and trends dashboard
  
- **Advanced Features:**
  - Multi-parameter search and filtering
  - Category-wise organization (Technology, Science, Business, Literature, Reference, Competitive Exams)
  - Real-time availability tracking
  - Automated overdue notifications
  - Member usage analytics
  - Popular books tracking
  - Monthly activity trends

See [LIBRARY_SYSTEM_DOCS.md](./LIBRARY_SYSTEM_DOCS.md) for complete documentation and [LIBRARY_QUICK_START.md](./LIBRARY_QUICK_START.md) for quick reference.

### And many more features...

## Customization

### Adding New Pages

1. Create a new folder in `app/admin/`
2. Add a `page.tsx` file with your component
3. Update the sidebar navigation in `components/admin/sidebar.tsx`

### Modifying Demo Data

Edit the `lib/demo-data.ts` file to change or add demo data for testing.

### Changing Theme Colors

Modify the color variables in `app/globals.css` to customize the theme.

## Future Enhancements

- Backend API integration
- Database setup (PostgreSQL/MongoDB)
- Real-time notifications
- Advanced analytics and reporting
- Mobile application
- Parent portal
- Student and teacher portals
- Online examination system
- Video conferencing integration
- Assignment submission system

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support, email support@college.edu or create an issue in the repository.

