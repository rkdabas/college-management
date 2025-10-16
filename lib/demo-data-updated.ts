// Updated demo data with proper academic hierarchy

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  phone: string;
  degreeId: string;
  degreeName: string;
  courseId: string;
  courseName: string;
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
  degreeId: string;
  degreeName: string;
  courseId: string;
  courseName: string;
  branchId: string;
  branchName: string;
  designation: string;
  qualification: string;
  experience: number;
  joiningDate: string;
  salary: number;
  status: "active" | "inactive";
  profileImage?: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  degreeId: string;
  courseId: string;
  branchId: string;
  semester: number;
  credits: number;
  type: "theory" | "practical" | "project";
  teacherId: string;
  teacherName: string;
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
  targetDegrees: string[]; // Which degrees can participate
  targetBranches: string[]; // Which branches can participate
  participants: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  degreeId: string;
  degreeName: string;
  branchId: string;
  branchName: string;
  semester: number;
  batch: number;
  totalFee: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  status: "paid" | "partial" | "overdue";
}

// Updated demo students with proper hierarchy
export const demoStudentsUpdated: Student[] = [
  {
    id: "1",
    rollNo: "21CSE001",
    name: "Rahul Sharma",
    email: "rahul.sharma@student.college.edu",
    phone: "+91 9876543210",
    degreeId: "deg_1",
    degreeName: "B.Tech",
    courseId: "crs_1",
    courseName: "Engineering",
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
    courseId: "crs_1",
    courseName: "Engineering",
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
    courseId: "crs_1",
    courseName: "Engineering",
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
    courseId: "crs_1",
    courseName: "Engineering",
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
    courseId: "crs_1",
    courseName: "Engineering",
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
    courseId: "crs_1",
    courseName: "Engineering",
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
    courseId: "crs_5",
    courseName: "Business Administration",
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
    courseId: "crs_3",
    courseName: "Computer Applications",
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

// Updated demo teachers
export const demoTeachersUpdated: Teacher[] = [
  {
    id: "1",
    employeeId: "EMP001",
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@college.edu",
    phone: "+91 9876540001",
    degreeId: "deg_1",
    degreeName: "B.Tech",
    courseId: "crs_1",
    courseName: "Engineering",
    branchId: "br_1",
    branchName: "Computer Science & Engineering",
    designation: "Professor",
    qualification: "Ph.D. in Computer Science",
    experience: 15,
    joiningDate: "2010-07-01",
    salary: 120000,
    status: "active",
  },
  {
    id: "2",
    employeeId: "EMP002",
    name: "Dr. Sunita Sharma",
    email: "sunita.sharma@college.edu",
    phone: "+91 9876540002",
    degreeId: "deg_1",
    degreeName: "B.Tech",
    courseId: "crs_1",
    courseName: "Engineering",
    branchId: "br_1",
    branchName: "Computer Science & Engineering",
    designation: "Associate Professor",
    qualification: "Ph.D. in Software Engineering",
    experience: 10,
    joiningDate: "2013-08-15",
    salary: 100000,
    status: "active",
  },
  {
    id: "3",
    employeeId: "EMP003",
    name: "Prof. Amit Gupta",
    email: "amit.gupta@college.edu",
    phone: "+91 9876540003",
    degreeId: "deg_1",
    degreeName: "B.Tech",
    courseId: "crs_1",
    courseName: "Engineering",
    branchId: "br_3",
    branchName: "Mechanical Engineering",
    designation: "Assistant Professor",
    qualification: "M.Tech in Mechanical Engineering",
    experience: 8,
    joiningDate: "2015-06-01",
    salary: 80000,
    status: "active",
  },
  {
    id: "4",
    employeeId: "EMP004",
    name: "Dr. Kavita Reddy",
    email: "kavita.reddy@college.edu",
    phone: "+91 9876540004",
    degreeId: "deg_1",
    degreeName: "B.Tech",
    courseId: "crs_1",
    courseName: "Engineering",
    branchId: "br_2",
    branchName: "Electronics & Communication Engineering",
    designation: "Professor",
    qualification: "Ph.D. in Electronics",
    experience: 18,
    joiningDate: "2007-01-10",
    salary: 130000,
    status: "active",
  },
];

// Updated subjects with proper hierarchy
export const demoSubjects: Subject[] = [
  {
    id: "sub_1",
    code: "CS301",
    name: "Data Structures and Algorithms",
    degreeId: "deg_1",
    courseId: "crs_1",
    branchId: "br_1",
    semester: 3,
    credits: 4,
    type: "theory",
    teacherId: "1",
    teacherName: "Dr. Rajesh Kumar",
  },
  {
    id: "sub_2",
    code: "CS302",
    name: "Database Management Systems",
    degreeId: "deg_1",
    courseId: "crs_1",
    branchId: "br_1",
    semester: 3,
    credits: 4,
    type: "theory",
    teacherId: "2",
    teacherName: "Dr. Sunita Sharma",
  },
  {
    id: "sub_3",
    code: "ME401",
    name: "Thermodynamics",
    degreeId: "deg_1",
    courseId: "crs_1",
    branchId: "br_3",
    semester: 4,
    credits: 3,
    type: "theory",
    teacherId: "3",
    teacherName: "Prof. Amit Gupta",
  },
  {
    id: "sub_4",
    code: "EC501",
    name: "Digital Signal Processing",
    degreeId: "deg_1",
    courseId: "crs_1",
    branchId: "br_2",
    semester: 5,
    credits: 4,
    type: "theory",
    teacherId: "4",
    teacherName: "Dr. Kavita Reddy",
  },
];

// Updated events with target degrees and branches
export const demoEventsUpdated: Event[] = [
  {
    id: "1",
    title: "Annual Tech Fest 2025",
    description: "Three-day technical festival featuring coding competitions, robotics, and innovation showcases",
    type: "cultural",
    startDate: "2025-11-15",
    endDate: "2025-11-17",
    venue: "Main Campus Auditorium",
    organizer: "Student Council",
    targetDegrees: ["deg_1", "deg_3"], // B.Tech and BCA
    targetBranches: ["br_1", "br_6", "br_9"], // CSE, IT, CA
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
    status: "upcoming",
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
    targetDegrees: ["deg_1", "deg_3", "deg_5", "deg_6"], // All degrees
    targetBranches: [], // Open to all branches
    participants: 300,
    status: "upcoming",
  },
];

// Updated fee records
export const demoFeeRecordsUpdated: FeeRecord[] = [
  {
    id: "1",
    studentId: "1",
    studentName: "Rahul Sharma",
    rollNo: "21CSE001",
    degreeId: "deg_1",
    degreeName: "B.Tech",
    branchId: "br_1",
    branchName: "Computer Science & Engineering",
    semester: 6,
    batch: 2021,
    totalFee: 75000,
    paidAmount: 75000,
    dueAmount: 0,
    dueDate: "2025-09-30",
    status: "paid",
  },
  {
    id: "2",
    studentId: "2",
    studentName: "Priya Verma",
    rollNo: "21CSE002",
    degreeId: "deg_1",
    degreeName: "B.Tech",
    branchId: "br_1",
    branchName: "Computer Science & Engineering",
    semester: 6,
    batch: 2021,
    totalFee: 75000,
    paidAmount: 50000,
    dueAmount: 25000,
    dueDate: "2025-10-20",
    status: "partial",
  },
  {
    id: "3",
    studentId: "3",
    studentName: "Amit Kumar",
    rollNo: "22ME001",
    degreeId: "deg_1",
    degreeName: "B.Tech",
    branchId: "br_3",
    branchName: "Mechanical Engineering",
    semester: 4,
    batch: 2022,
    totalFee: 70000,
    paidAmount: 35000,
    dueAmount: 35000,
    dueDate: "2025-09-30",
    status: "overdue",
  },
];

