// Demo data with updated structure (no course level)

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  phone: string;
  degreeId: string;
  degreeName: string;
  branchId: string;
  branchName: string;
  branchCode: string;
  semester: number;
  batch: number;
  dateOfBirth: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  admissionDate: string;
  status: "active" | "inactive";
  profileImage?: string;
}

export interface Teacher {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  departmentId: string;
  departmentName: string;
  designation: string;
  qualification: string;
  experience: number;
  joiningDate: string;
  salary: number;
  status: "active" | "inactive";
  profileImage?: string;
  // Subjects this teacher teaches (can be assigned by admin)
  subjects: TeacherSubject[];
}

export interface TeacherSubject {
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  degreeId: string;
  degreeName: string;
  branchId: string;
  branchName: string;
  semester: number;
  batch: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: "academic" | "cultural" | "sports" | "workshop" | "seminar" | "other";
  startDate: string;
  endDate: string;
  venue: string;
  organizer: string;
  targetDegrees: string[];
  targetBranches: string[];
  participants: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  rollNo: string;
  studentName: string;
  degreeId: string;
  degreeName: string;
  branchId: string;
  branchName: string;
  semester: number;
  batch: number;
  date: string;
  subjectId: string;
  subjectName: string;
  status: "present" | "absent" | "leave";
}

// Demo students
export const demoStudents: Student[] = [
  {
    id: "1",
    rollNo: "21CSE001",
    name: "Rahul Sharma",
    email: "rahul.sharma@student.college.edu",
    phone: "+91 9876543210",
    degreeId: "deg_1",
    degreeName: "B.Tech",
    branchId: "br_1",
    branchName: "Computer Science & Engineering",
    branchCode: "CSE",
    semester: 6,
    batch: 2021,
    dateOfBirth: "2003-05-15",
    address: "123 Main St, Delhi",
    guardianName: "Mr. Sharma",
    guardianPhone: "+91 9876543211",
    admissionDate: "2021-08-01",
    status: "active",
  },
  {
    id: "2",
    rollNo: "21CSE002",
    name: "Priya Verma",
    email: "priya.verma@student.college.edu",
    phone: "+91 9876543212",
    degreeId: "deg_1",
    degreeName: "B.Tech",
    branchId: "br_1",
    branchName: "Computer Science & Engineering",
    branchCode: "CSE",
    semester: 6,
    batch: 2021,
    dateOfBirth: "2003-08-22",
    address: "456 Park Ave, Mumbai",
    guardianName: "Mr. Verma",
    guardianPhone: "+91 9876543213",
    admissionDate: "2021-08-01",
    status: "active",
  },
  {
    id: "3",
    rollNo: "22ME001",
    name: "Amit Kumar",
    email: "amit.kumar@student.college.edu",
    phone: "+91 9876543214",
    degreeId: "deg_1",
    degreeName: "B.Tech",
    branchId: "br_3",
    branchName: "Mechanical Engineering",
    branchCode: "ME",
    semester: 4,
    batch: 2022,
    dateOfBirth: "2004-03-10",
    address: "789 Lake Road, Bangalore",
    guardianName: "Mrs. Kumar",
    guardianPhone: "+91 9876543215",
    admissionDate: "2022-08-01",
    status: "active",
  },
  {
    id: "4",
    rollNo: "21ECE001",
    name: "Sneha Patel",
    email: "sneha.patel@student.college.edu",
    phone: "+91 9876543216",
    degreeId: "deg_1",
    degreeName: "B.Tech",
    branchId: "br_2",
    branchName: "Electronics & Communication Engineering",
    branchCode: "ECE",
    semester: 6,
    batch: 2021,
    dateOfBirth: "2003-11-30",
    address: "321 Hill View, Pune",
    guardianName: "Mr. Patel",
    guardianPhone: "+91 9876543217",
    admissionDate: "2021-08-01",
    status: "active",
  },
  {
    id: "5",
    rollNo: "22CSE001",
    name: "Arjun Singh",
    email: "arjun.singh@student.college.edu",
    phone: "+91 9876543218",
    degreeId: "deg_1",
    degreeName: "B.Tech",
    branchId: "br_1",
    branchName: "Computer Science & Engineering",
    branchCode: "CSE",
    semester: 4,
    batch: 2022,
    dateOfBirth: "2004-01-25",
    address: "555 Garden St, Hyderabad",
    guardianName: "Mrs. Singh",
    guardianPhone: "+91 9876543219",
    admissionDate: "2022-08-01",
    status: "active",
  },
  {
    id: "6",
    rollNo: "23IT001",
    name: "Neha Gupta",
    email: "neha.gupta@student.college.edu",
    phone: "+91 9876543220",
    degreeId: "deg_1",
    degreeName: "B.Tech",
    branchId: "br_6",
    branchName: "Information Technology",
    branchCode: "IT",
    semester: 2,
    batch: 2023,
    dateOfBirth: "2005-07-12",
    address: "888 Tech Park, Chennai",
    guardianName: "Mr. Gupta",
    guardianPhone: "+91 9876543221",
    admissionDate: "2023-08-01",
    status: "active",
  },
  {
    id: "7",
    rollNo: "22MBA001",
    name: "Vikram Reddy",
    email: "vikram.reddy@student.college.edu",
    phone: "+91 9876543222",
    degreeId: "deg_5",
    degreeName: "MBA",
    branchId: "br_11",
    branchName: "Marketing",
    branchCode: "MKT",
    semester: 3,
    batch: 2022,
    dateOfBirth: "2000-04-18",
    address: "999 Business District, Kolkata",
    guardianName: "Mr. Reddy",
    guardianPhone: "+91 9876543223",
    admissionDate: "2022-08-01",
    status: "active",
  },
  {
    id: "8",
    rollNo: "21BCA001",
    name: "Anjali Sharma",
    email: "anjali.sharma@student.college.edu",
    phone: "+91 9876543224",
    degreeId: "deg_3",
    degreeName: "BCA",
    branchId: "br_9",
    branchName: "Computer Applications",
    branchCode: "CA",
    semester: 5,
    batch: 2021,
    dateOfBirth: "2003-09-25",
    address: "777 College Road, Jaipur",
    guardianName: "Mrs. Sharma",
    guardianPhone: "+91 9876543225",
    admissionDate: "2021-08-01",
    status: "active",
  },
];

// Demo teachers with subject mappings
export const demoTeachers: Teacher[] = [
  {
    id: "1",
    employeeId: "EMP001",
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@college.edu",
    phone: "+91 9876540001",
    departmentId: "dept_1",
    departmentName: "Computer Science & Engineering",
    designation: "Professor",
    qualification: "Ph.D. in Computer Science",
    experience: 15,
    joiningDate: "2010-07-01",
    salary: 120000,
    status: "active",
    subjects: [
      {
        subjectId: "sub_1",
        subjectCode: "CS601",
        subjectName: "Artificial Intelligence",
        degreeId: "deg_1",
        degreeName: "B.Tech",
        branchId: "br_1",
        branchName: "Computer Science & Engineering",
        semester: 6,
        batch: 2021,
      },
      {
        subjectId: "sub_4",
        subjectCode: "CS401",
        subjectName: "Database Management Systems",
        degreeId: "deg_1",
        degreeName: "B.Tech",
        branchId: "br_1",
        branchName: "Computer Science & Engineering",
        semester: 4,
        batch: 2022,
      },
    ],
  },
  {
    id: "2",
    employeeId: "EMP002",
    name: "Dr. Sunita Sharma",
    email: "sunita.sharma@college.edu",
    phone: "+91 9876540002",
    departmentId: "dept_1",
    departmentName: "Computer Science & Engineering",
    designation: "Associate Professor",
    qualification: "Ph.D. in Software Engineering",
    experience: 10,
    joiningDate: "2013-08-15",
    salary: 100000,
    status: "active",
    subjects: [
      {
        subjectId: "sub_2",
        subjectCode: "CS602",
        subjectName: "Machine Learning",
        degreeId: "deg_1",
        degreeName: "B.Tech",
        branchId: "br_1",
        branchName: "Computer Science & Engineering",
        semester: 6,
        batch: 2021,
      },
      {
        subjectId: "sub_5",
        subjectCode: "CS402",
        subjectName: "Operating Systems",
        degreeId: "deg_1",
        degreeName: "B.Tech",
        branchId: "br_1",
        branchName: "Computer Science & Engineering",
        semester: 4,
        batch: 2022,
      },
    ],
  },
  {
    id: "3",
    employeeId: "EMP003",
    name: "Prof. Amit Gupta",
    email: "amit.gupta@college.edu",
    phone: "+91 9876540003",
    departmentId: "dept_3",
    departmentName: "Mechanical Engineering",
    designation: "Assistant Professor",
    qualification: "M.Tech in Mechanical Engineering",
    experience: 8,
    joiningDate: "2015-06-01",
    salary: 80000,
    status: "active",
    subjects: [
      {
        subjectId: "sub_6",
        subjectCode: "ME401",
        subjectName: "Thermodynamics",
        degreeId: "deg_1",
        degreeName: "B.Tech",
        branchId: "br_3",
        branchName: "Mechanical Engineering",
        semester: 4,
        batch: 2022,
      },
      {
        subjectId: "sub_7",
        subjectCode: "ME402",
        subjectName: "Fluid Mechanics",
        degreeId: "deg_1",
        degreeName: "B.Tech",
        branchId: "br_3",
        branchName: "Mechanical Engineering",
        semester: 4,
        batch: 2022,
      },
    ],
  },
  {
    id: "4",
    employeeId: "EMP004",
    name: "Dr. Priya Malhotra",
    email: "priya.malhotra@college.edu",
    phone: "+91 9876540004",
    departmentId: "dept_1",
    departmentName: "Computer Science & Engineering",
    designation: "Assistant Professor",
    qualification: "Ph.D. in Data Science",
    experience: 6,
    joiningDate: "2018-07-15",
    salary: 85000,
    status: "active",
    subjects: [],
  },
  {
    id: "5",
    employeeId: "EMP005",
    name: "Prof. Vikram Singh",
    email: "vikram.singh@college.edu",
    phone: "+91 9876540005",
    departmentId: "dept_2",
    departmentName: "Electrical Engineering",
    designation: "Associate Professor",
    qualification: "M.Tech in Electrical Engineering",
    experience: 12,
    joiningDate: "2012-08-01",
    salary: 95000,
    status: "active",
    subjects: [],
  },
  {
    id: "6",
    employeeId: "EMP006",
    name: "Dr. Anjali Mehta",
    email: "anjali.mehta@college.edu",
    phone: "+91 9876540006",
    departmentId: "dept_2",
    departmentName: "Electrical Engineering",
    designation: "Professor",
    qualification: "Ph.D. in Power Systems",
    experience: 18,
    joiningDate: "2008-07-01",
    salary: 125000,
    status: "active",
    subjects: [],
  },
  {
    id: "7",
    employeeId: "EMP007",
    name: "Prof. Rahul Desai",
    email: "rahul.desai@college.edu",
    phone: "+91 9876540007",
    departmentId: "dept_3",
    departmentName: "Mechanical Engineering",
    designation: "Associate Professor",
    qualification: "Ph.D. in Manufacturing",
    experience: 11,
    joiningDate: "2014-01-15",
    salary: 98000,
    status: "active",
    subjects: [],
  },
  {
    id: "8",
    employeeId: "EMP008",
    name: "Dr. Kavita Joshi",
    email: "kavita.joshi@college.edu",
    phone: "+91 9876540008",
    departmentId: "dept_4",
    departmentName: "Civil Engineering",
    designation: "Professor",
    qualification: "Ph.D. in Structural Engineering",
    experience: 16,
    joiningDate: "2009-07-01",
    salary: 122000,
    status: "active",
    subjects: [],
  },
  {
    id: "9",
    employeeId: "EMP009",
    name: "Prof. Sanjay Reddy",
    email: "sanjay.reddy@college.edu",
    phone: "+91 9876540009",
    departmentId: "dept_5",
    departmentName: "Electronics & Communication Engineering",
    designation: "Assistant Professor",
    qualification: "M.Tech in VLSI Design",
    experience: 7,
    joiningDate: "2017-08-01",
    salary: 82000,
    status: "active",
    subjects: [],
  },
  {
    id: "10",
    employeeId: "EMP010",
    name: "Dr. Neha Kapoor",
    email: "neha.kapoor@college.edu",
    phone: "+91 9876540010",
    departmentId: "dept_6",
    departmentName: "Business Administration",
    designation: "Associate Professor",
    qualification: "Ph.D. in Marketing Management",
    experience: 9,
    joiningDate: "2016-07-15",
    salary: 92000,
    status: "active",
    subjects: [],
  },
];

// Demo events with month/year
export const demoEvents: Event[] = [
  {
    id: "1",
    title: "Annual Tech Fest 2025",
    description: "Three-day technical festival featuring coding competitions, robotics, and innovation showcases",
    type: "cultural",
    startDate: "2025-11-15",
    endDate: "2025-11-17",
    venue: "Main Campus Auditorium",
    organizer: "Student Council",
    targetDegrees: ["deg_1", "deg_3"],
    targetBranches: ["br_1", "br_6", "br_9"],
    participants: 500,
    status: "upcoming",
  },
  {
    id: "2",
    title: "AI & Machine Learning Workshop",
    description: "Hands-on workshop on latest trends in AI and ML by industry experts",
    type: "workshop",
    startDate: "2025-10-20",
    endDate: "2025-10-20",
    venue: "Computer Science Lab",
    organizer: "CS Department",
    targetDegrees: ["deg_1", "deg_2", "deg_3", "deg_4"],
    targetBranches: ["br_1", "br_6", "br_7", "br_9", "br_10"],
    participants: 80,
    status: "ongoing",
  },
  {
    id: "3",
    title: "Inter-College Sports Meet",
    description: "Annual sports competition with various indoor and outdoor games",
    type: "sports",
    startDate: "2025-12-01",
    endDate: "2025-12-05",
    venue: "Sports Complex",
    organizer: "Sports Department",
    targetDegrees: ["deg_1", "deg_3", "deg_5", "deg_6"],
    targetBranches: [],
    participants: 300,
    status: "upcoming",
  },
  {
    id: "4",
    title: "Summer Internship Fair 2024",
    description: "Companies visiting for internship opportunities",
    type: "academic",
    startDate: "2024-06-10",
    endDate: "2024-06-12",
    venue: "Main Auditorium",
    organizer: "Training & Placement",
    targetDegrees: ["deg_1"],
    targetBranches: [],
    participants: 450,
    status: "completed",
  },
  {
    id: "5",
    title: "Cultural Fest 2024",
    description: "Annual cultural festival with music, dance, and drama",
    type: "cultural",
    startDate: "2024-03-15",
    endDate: "2024-03-17",
    venue: "Open Air Theatre",
    organizer: "Cultural Committee",
    targetDegrees: [],
    targetBranches: [],
    participants: 800,
    status: "completed",
  },
];

// Get degree-wise student count
export function getDegreeWiseStudentCount() {
  const counts: Record<string, { degreeName: string; count: number }> = {};
  
  demoStudents.forEach((student) => {
    if (!counts[student.degreeId]) {
      counts[student.degreeId] = {
        degreeName: student.degreeName,
        count: 0,
      };
    }
    counts[student.degreeId].count++;
  });
  
  return Object.entries(counts).map(([degreeId, data]) => ({
    degreeId,
    name: data.degreeName,
    students: data.count,
  }));
}

// Get branch-wise student count
export function getBranchWiseStudentCount() {
  const counts: Record<string, { branchName: string; degreeName: string; count: number }> = {};
  
  demoStudents.forEach((student) => {
    const key = `${student.degreeId}_${student.branchId}`;
    if (!counts[key]) {
      counts[key] = {
        branchName: student.branchName,
        degreeName: student.degreeName,
        count: 0,
      };
    }
    counts[key].count++;
  });
  
  return Object.entries(counts).map(([key, data]) => ({
    name: `${data.degreeName} - ${data.branchName}`,
    students: data.count,
  }));
}

