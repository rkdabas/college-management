// Demo data for the ERP system

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  semester: number;
  year: string;
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
  department: string;
  designation: string;
  qualification: string;
  experience: number;
  joiningDate: string;
  salary: number;
  status: "active" | "inactive";
  profileImage?: string;
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
  participants: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
}

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  semester: number;
  credits: number;
  teacherId: string;
  teacherName: string;
  capacity: number;
  enrolled: number;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  department: string;
  semester: number;
  totalFee: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  status: "paid" | "partial" | "overdue";
}

export const demoStudents: Student[] = [
  {
    id: "1",
    rollNo: "CS21001",
    name: "Rahul Sharma",
    email: "rahul.sharma@student.college.edu",
    phone: "+91 9876543210",
    department: "Computer Science",
    semester: 6,
    year: "2021",
    dateOfBirth: "2003-05-15",
    address: "123 Main St, Delhi",
    guardianName: "Mr. Sharma",
    guardianPhone: "+91 9876543211",
    admissionDate: "2021-08-01",
    status: "active",
  },
  {
    id: "2",
    rollNo: "CS21002",
    name: "Priya Verma",
    email: "priya.verma@student.college.edu",
    phone: "+91 9876543212",
    department: "Computer Science",
    semester: 6,
    year: "2021",
    dateOfBirth: "2003-08-22",
    address: "456 Park Ave, Mumbai",
    guardianName: "Mr. Verma",
    guardianPhone: "+91 9876543213",
    admissionDate: "2021-08-01",
    status: "active",
  },
  {
    id: "3",
    rollNo: "ME22001",
    name: "Amit Kumar",
    email: "amit.kumar@student.college.edu",
    phone: "+91 9876543214",
    department: "Mechanical Engineering",
    semester: 4,
    year: "2022",
    dateOfBirth: "2004-03-10",
    address: "789 Lake Road, Bangalore",
    guardianName: "Mrs. Kumar",
    guardianPhone: "+91 9876543215",
    admissionDate: "2022-08-01",
    status: "active",
  },
  {
    id: "4",
    rollNo: "EC21003",
    name: "Sneha Patel",
    email: "sneha.patel@student.college.edu",
    phone: "+91 9876543216",
    department: "Electronics",
    semester: 6,
    year: "2021",
    dateOfBirth: "2003-11-30",
    address: "321 Hill View, Pune",
    guardianName: "Mr. Patel",
    guardianPhone: "+91 9876543217",
    admissionDate: "2021-08-01",
    status: "active",
  },
  {
    id: "5",
    rollNo: "CS22005",
    name: "Arjun Singh",
    email: "arjun.singh@student.college.edu",
    phone: "+91 9876543218",
    department: "Computer Science",
    semester: 4,
    year: "2022",
    dateOfBirth: "2004-01-25",
    address: "555 Garden St, Hyderabad",
    guardianName: "Mrs. Singh",
    guardianPhone: "+91 9876543219",
    admissionDate: "2022-08-01",
    status: "active",
  },
];

export const demoTeachers: Teacher[] = [
  {
    id: "1",
    employeeId: "EMP001",
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@college.edu",
    phone: "+91 9876540001",
    department: "Computer Science",
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
    department: "Computer Science",
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
    department: "Mechanical Engineering",
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
    department: "Electronics",
    designation: "Professor",
    qualification: "Ph.D. in Electronics",
    experience: 18,
    joiningDate: "2007-01-10",
    salary: 130000,
    status: "active",
  },
];

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
    participants: 300,
    status: "upcoming",
  },
  {
    id: "4",
    title: "Semester End Examinations",
    description: "Final examinations for all departments",
    type: "academic",
    startDate: "2025-11-25",
    endDate: "2025-12-10",
    venue: "Examination Halls",
    organizer: "Examination Department",
    participants: 2000,
    status: "upcoming",
  },
  {
    id: "5",
    title: "Industry-Academia Seminar",
    description: "Seminar on bridging the gap between industry and academia",
    type: "seminar",
    startDate: "2025-10-18",
    endDate: "2025-10-18",
    venue: "Conference Hall",
    organizer: "Training & Placement Cell",
    participants: 200,
    status: "ongoing",
  },
];

export const demoCourses: Course[] = [
  {
    id: "1",
    code: "CS301",
    name: "Data Structures and Algorithms",
    department: "Computer Science",
    semester: 3,
    credits: 4,
    teacherId: "1",
    teacherName: "Dr. Rajesh Kumar",
    capacity: 60,
    enrolled: 55,
  },
  {
    id: "2",
    code: "CS302",
    name: "Database Management Systems",
    department: "Computer Science",
    semester: 3,
    credits: 4,
    teacherId: "2",
    teacherName: "Dr. Sunita Sharma",
    capacity: 60,
    enrolled: 58,
  },
  {
    id: "3",
    code: "ME401",
    name: "Thermodynamics",
    department: "Mechanical Engineering",
    semester: 4,
    credits: 3,
    teacherId: "3",
    teacherName: "Prof. Amit Gupta",
    capacity: 50,
    enrolled: 45,
  },
  {
    id: "4",
    code: "EC501",
    name: "Digital Signal Processing",
    department: "Electronics",
    semester: 5,
    credits: 4,
    teacherId: "4",
    teacherName: "Dr. Kavita Reddy",
    capacity: 40,
    enrolled: 38,
  },
];

export const demoFeeRecords: FeeRecord[] = [
  {
    id: "1",
    studentId: "1",
    studentName: "Rahul Sharma",
    rollNo: "CS21001",
    department: "Computer Science",
    semester: 6,
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
    rollNo: "CS21002",
    department: "Computer Science",
    semester: 6,
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
    rollNo: "ME22001",
    department: "Mechanical Engineering",
    semester: 4,
    totalFee: 70000,
    paidAmount: 35000,
    dueAmount: 35000,
    dueDate: "2025-09-30",
    status: "overdue",
  },
  {
    id: "4",
    studentId: "4",
    studentName: "Sneha Patel",
    rollNo: "EC21003",
    department: "Electronics",
    semester: 6,
    totalFee: 72000,
    paidAmount: 72000,
    dueAmount: 0,
    dueDate: "2025-09-30",
    status: "paid",
  },
  {
    id: "5",
    studentId: "5",
    studentName: "Arjun Singh",
    rollNo: "CS22005",
    department: "Computer Science",
    semester: 4,
    totalFee: 75000,
    paidAmount: 40000,
    dueAmount: 35000,
    dueDate: "2025-10-15",
    status: "partial",
  },
];

