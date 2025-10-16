// Comprehensive Library Management Data

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publicationYear: number;
  edition: string;
  category: string;
  subCategory: string;
  language: string;
  pages: number;
  price: number;
  totalCopies: number;
  availableCopies: number;
  issuedCopies: number;
  location: string; // Shelf/Rack location
  description: string;
  coverImage?: string;
  status: "available" | "low-stock" | "out-of-stock";
  addedDate: string;
}

export interface IssuedBook {
  id: string;
  bookId: string;
  bookTitle: string;
  isbn: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  degreeId: string;
  degreeName: string;
  branchId: string;
  branchName: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: "issued" | "returned" | "overdue";
  fine: number;
  renewalCount: number;
}

export interface LibraryMember {
  id: string;
  memberId: string;
  name: string;
  rollNo: string;
  type: "student" | "faculty";
  degreeId: string;
  degreeName: string;
  booksIssued: number;
  booksLimit: number;
  finesPending: number;
  memberSince: string;
  status: "active" | "suspended" | "blocked";
}

export interface DigitalResource {
  id: string;
  title: string;
  type: "e-book" | "journal" | "research-paper" | "magazine" | "video";
  category: string;
  author: string;
  url: string;
  accessType: "free" | "subscribed" | "premium";
  downloads: number;
  addedDate: string;
}

// Book Categories
export const bookCategories = [
  { id: "tech", name: "Technology & Engineering", subCategories: ["Computer Science", "Electrical", "Mechanical", "Civil", "Electronics"] },
  { id: "science", name: "Science", subCategories: ["Physics", "Chemistry", "Mathematics", "Biology"] },
  { id: "business", name: "Business & Management", subCategories: ["Marketing", "Finance", "HR", "Operations"] },
  { id: "literature", name: "Literature", subCategories: ["Fiction", "Non-Fiction", "Poetry", "Drama"] },
  { id: "reference", name: "Reference", subCategories: ["Encyclopedia", "Dictionary", "Handbook", "Atlas"] },
  { id: "competitive", name: "Competitive Exams", subCategories: ["GATE", "GRE", "CAT", "UPSC"] },
];

// Demo Books
export const demoBooks: Book[] = [
  {
    id: "b1",
    isbn: "978-0-13-235088-4",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen, Charles E. Leiserson",
    publisher: "MIT Press",
    publicationYear: 2022,
    edition: "4th Edition",
    category: "Technology & Engineering",
    subCategory: "Computer Science",
    language: "English",
    pages: 1312,
    price: 3500,
    totalCopies: 15,
    availableCopies: 8,
    issuedCopies: 7,
    location: "Rack A1, Shelf 3",
    description: "Comprehensive guide to algorithms covering sorting, graph algorithms, dynamic programming, and more.",
    status: "available",
    addedDate: "2023-01-15",
  },
  {
    id: "b2",
    isbn: "978-0-13-468599-1",
    title: "Operating System Concepts",
    author: "Abraham Silberschatz, Peter B. Galvin",
    publisher: "Wiley",
    publicationYear: 2021,
    edition: "10th Edition",
    category: "Technology & Engineering",
    subCategory: "Computer Science",
    language: "English",
    pages: 1040,
    price: 2800,
    totalCopies: 12,
    availableCopies: 3,
    issuedCopies: 9,
    location: "Rack A1, Shelf 4",
    description: "Fundamental concepts of operating systems including process management, memory management, and file systems.",
    status: "low-stock",
    addedDate: "2023-02-20",
  },
  {
    id: "b3",
    isbn: "978-0-07-338065-0",
    title: "Database System Concepts",
    author: "Abraham Silberschatz, Henry F. Korth",
    publisher: "McGraw-Hill",
    publicationYear: 2020,
    edition: "7th Edition",
    category: "Technology & Engineering",
    subCategory: "Computer Science",
    language: "English",
    pages: 1376,
    price: 3200,
    totalCopies: 10,
    availableCopies: 5,
    issuedCopies: 5,
    location: "Rack A2, Shelf 1",
    description: "Complete coverage of database management systems, SQL, and modern database technologies.",
    status: "available",
    addedDate: "2023-03-10",
  },
  {
    id: "b4",
    isbn: "978-0-13-476904-0",
    title: "Computer Networks",
    author: "Andrew S. Tanenbaum, David J. Wetherall",
    publisher: "Pearson",
    publicationYear: 2021,
    edition: "6th Edition",
    category: "Technology & Engineering",
    subCategory: "Computer Science",
    language: "English",
    pages: 960,
    price: 2500,
    totalCopies: 8,
    availableCopies: 0,
    issuedCopies: 8,
    location: "Rack A2, Shelf 2",
    description: "Comprehensive guide to computer networking including protocols, internet architecture, and security.",
    status: "out-of-stock",
    addedDate: "2023-01-25",
  },
  {
    id: "b5",
    isbn: "978-0-13-236371-6",
    title: "Software Engineering",
    author: "Ian Sommerville",
    publisher: "Pearson",
    publicationYear: 2022,
    edition: "10th Edition",
    category: "Technology & Engineering",
    subCategory: "Computer Science",
    language: "English",
    pages: 816,
    price: 2600,
    totalCopies: 10,
    availableCopies: 6,
    issuedCopies: 4,
    location: "Rack A2, Shelf 3",
    description: "Modern software engineering practices including agile methodologies and DevOps.",
    status: "available",
    addedDate: "2023-04-05",
  },
  {
    id: "b6",
    isbn: "978-0-07-803473-2",
    title: "Engineering Mechanics - Statics",
    author: "J.L. Meriam, L.G. Kraige",
    publisher: "Wiley",
    publicationYear: 2020,
    edition: "9th Edition",
    category: "Technology & Engineering",
    subCategory: "Mechanical",
    language: "English",
    pages: 672,
    price: 2200,
    totalCopies: 12,
    availableCopies: 7,
    issuedCopies: 5,
    location: "Rack B1, Shelf 1",
    description: "Fundamental principles of engineering mechanics with practical applications.",
    status: "available",
    addedDate: "2023-02-15",
  },
  {
    id: "b7",
    isbn: "978-1-118-06571-6",
    title: "Thermodynamics: An Engineering Approach",
    author: "Yunus A. Cengel, Michael A. Boles",
    publisher: "McGraw-Hill",
    publicationYear: 2021,
    edition: "9th Edition",
    category: "Technology & Engineering",
    subCategory: "Mechanical",
    language: "English",
    pages: 1040,
    price: 2900,
    totalCopies: 10,
    availableCopies: 4,
    issuedCopies: 6,
    location: "Rack B1, Shelf 2",
    description: "Comprehensive coverage of thermodynamics principles and applications.",
    status: "available",
    addedDate: "2023-03-20",
  },
  {
    id: "b8",
    isbn: "978-0-07-338066-7",
    title: "Marketing Management",
    author: "Philip Kotler, Kevin Lane Keller",
    publisher: "Pearson",
    publicationYear: 2021,
    edition: "15th Edition",
    category: "Business & Management",
    subCategory: "Marketing",
    language: "English",
    pages: 720,
    price: 3000,
    totalCopies: 8,
    availableCopies: 5,
    issuedCopies: 3,
    location: "Rack C1, Shelf 1",
    description: "Global perspective on marketing management with case studies.",
    status: "available",
    addedDate: "2023-01-30",
  },
];

// Demo Issued Books
export const demoIssuedBooks: IssuedBook[] = [
  {
    id: "ib1",
    bookId: "b1",
    bookTitle: "Introduction to Algorithms",
    isbn: "978-0-13-235088-4",
    studentId: "1",
    studentName: "Rahul Sharma",
    rollNo: "21CSE001",
    degreeId: "deg_1",
    degreeName: "B.Tech",
    branchId: "br_1",
    branchName: "Computer Science & Engineering",
    issueDate: "2025-10-01",
    dueDate: "2025-10-15",
    status: "issued",
    fine: 0,
    renewalCount: 0,
  },
  {
    id: "ib2",
    bookId: "b2",
    bookTitle: "Operating System Concepts",
    isbn: "978-0-13-468599-1",
    studentId: "2",
    studentName: "Priya Verma",
    rollNo: "21CSE002",
    degreeId: "deg_1",
    degreeName: "B.Tech",
    branchId: "br_1",
    branchName: "Computer Science & Engineering",
    issueDate: "2025-09-20",
    dueDate: "2025-10-04",
    status: "overdue",
    fine: 110,
    renewalCount: 1,
  },
  {
    id: "ib3",
    bookId: "b3",
    bookTitle: "Database System Concepts",
    isbn: "978-0-07-338065-0",
    studentId: "3",
    studentName: "Amit Kumar",
    rollNo: "22ME001",
    degreeId: "deg_1",
    degreeName: "B.Tech",
    branchId: "br_3",
    branchName: "Mechanical Engineering",
    issueDate: "2025-10-05",
    dueDate: "2025-10-19",
    status: "issued",
    fine: 0,
    renewalCount: 0,
  },
  {
    id: "ib4",
    bookId: "b1",
    bookTitle: "Introduction to Algorithms",
    isbn: "978-0-13-235088-4",
    studentId: "5",
    studentName: "Arjun Singh",
    rollNo: "22CSE001",
    degreeId: "deg_1",
    degreeName: "B.Tech",
    branchId: "br_1",
    branchName: "Computer Science & Engineering",
    issueDate: "2025-09-15",
    dueDate: "2025-09-29",
    returnDate: "2025-10-05",
    status: "returned",
    fine: 60,
    renewalCount: 0,
  },
];

// Demo Library Members
export const demoMembers: LibraryMember[] = [
  {
    id: "m1",
    memberId: "LIB21001",
    name: "Rahul Sharma",
    rollNo: "21CSE001",
    type: "student",
    degreeId: "deg_1",
    degreeName: "B.Tech",
    booksIssued: 2,
    booksLimit: 5,
    finesPending: 0,
    memberSince: "2021-08-01",
    status: "active",
  },
  {
    id: "m2",
    memberId: "LIB21002",
    name: "Priya Verma",
    rollNo: "21CSE002",
    type: "student",
    degreeId: "deg_1",
    degreeName: "B.Tech",
    booksIssued: 3,
    booksLimit: 5,
    finesPending: 110,
    memberSince: "2021-08-01",
    status: "active",
  },
  {
    id: "m3",
    memberId: "LIBF001",
    name: "Dr. Rajesh Kumar",
    rollNo: "EMP001",
    type: "faculty",
    degreeId: "deg_1",
    degreeName: "B.Tech",
    booksIssued: 5,
    booksLimit: 10,
    finesPending: 0,
    memberSince: "2010-07-01",
    status: "active",
  },
];

// Demo Digital Resources
export const demoDigitalResources: DigitalResource[] = [
  {
    id: "dr1",
    title: "IEEE Xplore Digital Library",
    type: "journal",
    category: "Technology & Engineering",
    author: "IEEE",
    url: "https://ieeexplore.ieee.org",
    accessType: "subscribed",
    downloads: 1250,
    addedDate: "2023-01-01",
  },
  {
    id: "dr2",
    title: "ACM Digital Library",
    type: "journal",
    category: "Computer Science",
    author: "ACM",
    url: "https://dl.acm.org",
    accessType: "subscribed",
    downloads: 980,
    addedDate: "2023-01-01",
  },
  {
    id: "dr3",
    title: "Introduction to Python Programming",
    type: "e-book",
    category: "Computer Science",
    author: "Various Authors",
    url: "#",
    accessType: "free",
    downloads: 2450,
    addedDate: "2023-06-15",
  },
  {
    id: "dr4",
    title: "MIT OpenCourseWare",
    type: "video",
    category: "Technology & Engineering",
    author: "MIT",
    url: "https://ocw.mit.edu",
    accessType: "free",
    downloads: 3200,
    addedDate: "2023-02-01",
  },
];

