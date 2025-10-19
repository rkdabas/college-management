// Updated Academic hierarchy without Course level - Direct Degree to Branch mapping

export interface Degree {
  id: string;
  name: string;
  code: string;
  type: "undergraduate" | "postgraduate" | "diploma";
  duration: number; // in years
  totalSemesters: number;
  description: string;
}

export interface Branch {
  id: string;
  degreeId: string; // Direct link to degree (no course)
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

export interface Subject {
  id: string;
  code: string;
  name: string;
  degreeId: string;
  branchId: string;
  semester: number;
  batch: number; // Year for which this subject is offered
  credits: number;
  type: "theory" | "practical" | "project";
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

// Branches directly under degrees (no course level)
export const branches: Branch[] = [
  // B.Tech Branches
  {
    id: "br_1",
    degreeId: "deg_1",
    name: "Computer Science & Engineering",
    code: "CSE",
    capacity: 120,
    description: "Computer science and software engineering",
  },
  {
    id: "br_2",
    degreeId: "deg_1",
    name: "Electronics & Communication Engineering",
    code: "ECE",
    capacity: 90,
    description: "Electronics and communication systems",
  },
  {
    id: "br_3",
    degreeId: "deg_1",
    name: "Mechanical Engineering",
    code: "ME",
    capacity: 90,
    description: "Mechanical systems and manufacturing",
  },
  {
    id: "br_4",
    degreeId: "deg_1",
    name: "Civil Engineering",
    code: "CE",
    capacity: 60,
    description: "Construction and infrastructure",
  },
  {
    id: "br_5",
    degreeId: "deg_1",
    name: "Electrical Engineering",
    code: "EE",
    capacity: 60,
    description: "Electrical systems and power",
  },
  {
    id: "br_6",
    degreeId: "deg_1",
    name: "Information Technology",
    code: "IT",
    capacity: 90,
    description: "Information technology and systems",
  },
  // M.Tech Branches
  {
    id: "br_7",
    degreeId: "deg_2",
    name: "Computer Science & Engineering",
    code: "CSE",
    capacity: 30,
    description: "Advanced computer science",
  },
  {
    id: "br_8",
    degreeId: "deg_2",
    name: "VLSI Design",
    code: "VLSI",
    capacity: 20,
    description: "Very Large Scale Integration design",
  },
  // BCA Branch
  {
    id: "br_9",
    degreeId: "deg_3",
    name: "Computer Applications",
    code: "CA",
    capacity: 60,
    description: "Computer applications and programming",
  },
  // MCA Branch
  {
    id: "br_10",
    degreeId: "deg_4",
    name: "Computer Applications",
    code: "CA",
    capacity: 40,
    description: "Advanced computer applications",
  },
  // MBA Branches
  {
    id: "br_11",
    degreeId: "deg_5",
    name: "Marketing",
    code: "MKT",
    capacity: 40,
    description: "Marketing and sales management",
  },
  {
    id: "br_12",
    degreeId: "deg_5",
    name: "Finance",
    code: "FIN",
    capacity: 40,
    description: "Financial management and analysis",
  },
  {
    id: "br_13",
    degreeId: "deg_5",
    name: "Human Resources",
    code: "HR",
    capacity: 30,
    description: "Human resource management",
  },
  // B.Sc Branches
  {
    id: "br_14",
    degreeId: "deg_6",
    name: "Physics",
    code: "PHY",
    capacity: 40,
    description: "Physics and applied physics",
  },
  {
    id: "br_15",
    degreeId: "deg_6",
    name: "Chemistry",
    code: "CHE",
    capacity: 40,
    description: "Chemistry and applied chemistry",
  },
  {
    id: "br_16",
    degreeId: "deg_6",
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

// Subjects with batch year
export const subjects: Subject[] = [
  // B.Tech CSE - Batch 2021 - Semester 6
  {
    id: "sub_1",
    code: "CS601",
    name: "Artificial Intelligence",
    degreeId: "deg_1",
    branchId: "br_1",
    semester: 6,
    batch: 2021,
    credits: 4,
    type: "theory",
  },
  {
    id: "sub_2",
    code: "CS602",
    name: "Machine Learning",
    degreeId: "deg_1",
    branchId: "br_1",
    semester: 6,
    batch: 2021,
    credits: 4,
    type: "theory",
  },
  {
    id: "sub_3",
    code: "CS603",
    name: "Cloud Computing",
    degreeId: "deg_1",
    branchId: "br_1",
    semester: 6,
    batch: 2021,
    credits: 3,
    type: "theory",
  },
  // B.Tech CSE - Batch 2022 - Semester 4
  {
    id: "sub_4",
    code: "CS401",
    name: "Database Management Systems",
    degreeId: "deg_1",
    branchId: "br_1",
    semester: 4,
    batch: 2022,
    credits: 4,
    type: "theory",
  },
  {
    id: "sub_5",
    code: "CS402",
    name: "Operating Systems",
    degreeId: "deg_1",
    branchId: "br_1",
    semester: 4,
    batch: 2022,
    credits: 4,
    type: "theory",
  },
  // B.Tech ME - Batch 2022 - Semester 4
  {
    id: "sub_6",
    code: "ME401",
    name: "Thermodynamics",
    degreeId: "deg_1",
    branchId: "br_3",
    semester: 4,
    batch: 2022,
    credits: 4,
    type: "theory",
  },
  {
    id: "sub_7",
    code: "ME402",
    name: "Fluid Mechanics",
    degreeId: "deg_1",
    branchId: "br_3",
    semester: 4,
    batch: 2022,
    credits: 4,
    type: "theory",
  },
];

// Helper functions
export function getDegreeById(id: string): Degree | undefined {
  return degrees.find((d) => d.id === id);
}

export function getBranchesByDegreeId(degreeId: string): Branch[] {
  return branches.filter((b) => b.degreeId === degreeId);
}

export function getBranchById(id: string): Branch | undefined {
  return branches.find((b) => b.id === id);
}

export function getSubjects(filters: {
  degreeId?: string;
  branchId?: string;
  semester?: number;
  batch?: number;
} = {}): Subject[] {
  return subjects.filter((subject) => {
    if (filters.degreeId && subject.degreeId !== filters.degreeId) return false;
    if (filters.branchId && subject.branchId !== filters.branchId) return false;
    if (filters.semester && subject.semester !== filters.semester) return false;
    if (filters.batch && subject.batch !== filters.batch) return false;
    return true;
  });
}

// Generate roll number based on hierarchy
export function generateRollNumber(
  batch: number,
  branchCode: string,
  serialNumber: number
): string {
  const year = batch.toString().slice(-2);
  const serial = serialNumber.toString().padStart(3, "0");
  return `${year}${branchCode}${serial}`;
}

// Get branch details with enrollment data
export function getBranchDetails(degreeId: string, branchId: string, batch: number) {
  const degree = getDegreeById(degreeId);
  const branch = getBranchById(branchId);
  
  if (!degree || !branch) return null;
  
  const branchSubjects = getSubjects({ degreeId, branchId, batch });
  
  // Import demoStudents to calculate student count
  // Note: In real app, this would be a database query
  const { demoStudents } = require('./demo-data-v2');
  const studentCount = demoStudents.filter(
    (s: any) => s.branchId === branchId && s.batch === batch
  ).length;
  
  return {
    degree,
    branch,
    batch,
    subjects: branchSubjects,
    totalSubjects: branchSubjects.length,
    studentCount,
  };
}

