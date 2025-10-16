// Academic hierarchy and structure

export interface Degree {
  id: string;
  name: string;
  code: string;
  type: "undergraduate" | "postgraduate" | "diploma";
  duration: number; // in years
  totalSemesters: number;
  description: string;
}

export interface Course {
  id: string;
  degreeId: string;
  name: string;
  code: string;
  description: string;
}

export interface Branch {
  id: string;
  courseId: string;
  name: string;
  code: string;
  capacity: number;
  description: string;
}

export interface Batch {
  id: string;
  year: number;
  admissionDate: string;
  graduationYear: number;
  isActive: boolean;
}

export interface Semester {
  id: string;
  number: number;
  name: string;
  startDate: string;
  endDate: string;
}

// Degrees offered by the college
export const degrees: Degree[] = [
  {
    id: "deg_1",
    name: "Bachelor of Technology",
    code: "B.Tech",
    type: "undergraduate",
    duration: 4,
    totalSemesters: 8,
    description: "Four-year undergraduate engineering program",
  },
  {
    id: "deg_2",
    name: "Master of Technology",
    code: "M.Tech",
    type: "postgraduate",
    duration: 2,
    totalSemesters: 4,
    description: "Two-year postgraduate engineering program",
  },
  {
    id: "deg_3",
    name: "Bachelor of Computer Applications",
    code: "BCA",
    type: "undergraduate",
    duration: 3,
    totalSemesters: 6,
    description: "Three-year undergraduate computer applications program",
  },
  {
    id: "deg_4",
    name: "Master of Computer Applications",
    code: "MCA",
    type: "postgraduate",
    duration: 2,
    totalSemesters: 4,
    description: "Two-year postgraduate computer applications program",
  },
  {
    id: "deg_5",
    name: "Master of Business Administration",
    code: "MBA",
    type: "postgraduate",
    duration: 2,
    totalSemesters: 4,
    description: "Two-year postgraduate management program",
  },
  {
    id: "deg_6",
    name: "Bachelor of Science",
    code: "B.Sc",
    type: "undergraduate",
    duration: 3,
    totalSemesters: 6,
    description: "Three-year undergraduate science program",
  },
];

// Courses under degrees
export const courses: Course[] = [
  // B.Tech Courses
  {
    id: "crs_1",
    degreeId: "deg_1",
    name: "Engineering",
    code: "ENG",
    description: "Engineering programs under B.Tech",
  },
  // M.Tech Courses
  {
    id: "crs_2",
    degreeId: "deg_2",
    name: "Engineering (PG)",
    code: "ENG-PG",
    description: "Postgraduate engineering programs",
  },
  // BCA Course
  {
    id: "crs_3",
    degreeId: "deg_3",
    name: "Computer Applications",
    code: "CA",
    description: "Computer applications program",
  },
  // MCA Course
  {
    id: "crs_4",
    degreeId: "deg_4",
    name: "Computer Applications (PG)",
    code: "CA-PG",
    description: "Postgraduate computer applications program",
  },
  // MBA Courses
  {
    id: "crs_5",
    degreeId: "deg_5",
    name: "Business Administration",
    code: "BA",
    description: "Business and management program",
  },
  // B.Sc Courses
  {
    id: "crs_6",
    degreeId: "deg_6",
    name: "Science",
    code: "SCI",
    description: "Science programs under B.Sc",
  },
];

// Branches/Specializations under courses
export const branches: Branch[] = [
  // B.Tech Engineering Branches
  {
    id: "br_1",
    courseId: "crs_1",
    name: "Computer Science & Engineering",
    code: "CSE",
    capacity: 120,
    description: "Computer science and software engineering",
  },
  {
    id: "br_2",
    courseId: "crs_1",
    name: "Electronics & Communication Engineering",
    code: "ECE",
    capacity: 90,
    description: "Electronics and communication systems",
  },
  {
    id: "br_3",
    courseId: "crs_1",
    name: "Mechanical Engineering",
    code: "ME",
    capacity: 90,
    description: "Mechanical systems and manufacturing",
  },
  {
    id: "br_4",
    courseId: "crs_1",
    name: "Civil Engineering",
    code: "CE",
    capacity: 60,
    description: "Construction and infrastructure",
  },
  {
    id: "br_5",
    courseId: "crs_1",
    name: "Electrical Engineering",
    code: "EE",
    capacity: 60,
    description: "Electrical systems and power",
  },
  {
    id: "br_6",
    courseId: "crs_1",
    name: "Information Technology",
    code: "IT",
    capacity: 90,
    description: "Information technology and systems",
  },
  // M.Tech Branches
  {
    id: "br_7",
    courseId: "crs_2",
    name: "Computer Science & Engineering",
    code: "CSE",
    capacity: 30,
    description: "Advanced computer science",
  },
  {
    id: "br_8",
    courseId: "crs_2",
    name: "VLSI Design",
    code: "VLSI",
    capacity: 20,
    description: "Very Large Scale Integration design",
  },
  // BCA Branch
  {
    id: "br_9",
    courseId: "crs_3",
    name: "Computer Applications",
    code: "CA",
    capacity: 60,
    description: "Computer applications and programming",
  },
  // MCA Branch
  {
    id: "br_10",
    courseId: "crs_4",
    name: "Computer Applications",
    code: "CA",
    capacity: 40,
    description: "Advanced computer applications",
  },
  // MBA Branches
  {
    id: "br_11",
    courseId: "crs_5",
    name: "Marketing",
    code: "MKT",
    capacity: 40,
    description: "Marketing and sales management",
  },
  {
    id: "br_12",
    courseId: "crs_5",
    name: "Finance",
    code: "FIN",
    capacity: 40,
    description: "Financial management and analysis",
  },
  {
    id: "br_13",
    courseId: "crs_5",
    name: "Human Resources",
    code: "HR",
    capacity: 30,
    description: "Human resource management",
  },
  // B.Sc Branches
  {
    id: "br_14",
    courseId: "crs_6",
    name: "Physics",
    code: "PHY",
    capacity: 40,
    description: "Physics and applied physics",
  },
  {
    id: "br_15",
    courseId: "crs_6",
    name: "Chemistry",
    code: "CHE",
    capacity: 40,
    description: "Chemistry and applied chemistry",
  },
  {
    id: "br_16",
    courseId: "crs_6",
    name: "Mathematics",
    code: "MAT",
    capacity: 40,
    description: "Mathematics and statistics",
  },
];

// Batches
export const batches: Batch[] = [
  {
    id: "bat_1",
    year: 2021,
    admissionDate: "2021-08-01",
    graduationYear: 2025,
    isActive: true,
  },
  {
    id: "bat_2",
    year: 2022,
    admissionDate: "2022-08-01",
    graduationYear: 2026,
    isActive: true,
  },
  {
    id: "bat_3",
    year: 2023,
    admissionDate: "2023-08-01",
    graduationYear: 2027,
    isActive: true,
  },
  {
    id: "bat_4",
    year: 2024,
    admissionDate: "2024-08-01",
    graduationYear: 2028,
    isActive: true,
  },
];

// Helper functions
export function getDegreeById(id: string): Degree | undefined {
  return degrees.find((d) => d.id === id);
}

export function getCoursesByDegreeId(degreeId: string): Course[] {
  return courses.filter((c) => c.degreeId === degreeId);
}

export function getBranchesByCourseId(courseId: string): Branch[] {
  return branches.filter((b) => b.courseId === courseId);
}

export function getBranchById(id: string): Branch | undefined {
  return branches.find((b) => b.id === id);
}

export function getCourseById(id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}

export function getFullAcademicPath(branchId: string) {
  const branch = getBranchById(branchId);
  if (!branch) return null;

  const course = getCourseById(branch.courseId);
  if (!course) return null;

  const degree = getDegreeById(course.degreeId);
  if (!degree) return null;

  return {
    degree,
    course,
    branch,
  };
}

// Generate roll number based on hierarchy
export function generateRollNumber(
  batch: number,
  branchCode: string,
  serialNumber: number
): string {
  const year = batch.toString().slice(-2); // Last 2 digits of year
  const serial = serialNumber.toString().padStart(3, "0");
  return `${year}${branchCode}${serial}`;
}

