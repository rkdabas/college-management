import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing seed data so re-running seed is idempotent (delete children first)
  console.log('  Clearing existing data...')
  await prisma.attendance.deleteMany()
  await prisma.assignmentSubmission.deleteMany()
  await prisma.grade.deleteMany()
  await prisma.timetableEntry.deleteMany()
  await prisma.assignment.deleteMany()
  await prisma.material.deleteMany()
  await prisma.eventRegistration.deleteMany()
  await prisma.event.deleteMany()
  await prisma.leaveApplication.deleteMany()
  await prisma.bookIssue.deleteMany()
  await prisma.libraryBook.deleteMany()
  await prisma.extracurricularActivity.deleteMany()
  await prisma.submittedRecord.deleteMany()
  await prisma.teacherSubject.deleteMany()
  await prisma.user.deleteMany()
  await prisma.subject.deleteMany()
  await prisma.branch.deleteMany()
  await prisma.degree.deleteMany()
  await prisma.department.deleteMany()

  const hashedPassword = await bcrypt.hash('password123', 10)

  // ─── Departments ───
  const depts = await Promise.all([
    prisma.department.create({ data: { code: 'CSE', name: 'Computer Science & Engineering', description: 'Computer science and software engineering' } }),
    prisma.department.create({ data: { code: 'ECE', name: 'Electronics & Communication Engineering', description: 'Electronics and communication systems' } }),
    prisma.department.create({ data: { code: 'ME', name: 'Mechanical Engineering', description: 'Mechanical systems and manufacturing' } }),
    prisma.department.create({ data: { code: 'CE', name: 'Civil Engineering', description: 'Construction and infrastructure' } }),
    prisma.department.create({ data: { code: 'EE', name: 'Electrical Engineering', description: 'Electrical systems and power' } }),
    prisma.department.create({ data: { code: 'MBA', name: 'Business Administration', description: 'Business management and administration' } }),
  ])

  // ─── Degrees ───
  const btech = await prisma.degree.create({ data: { name: 'Bachelor of Technology', code: 'B.Tech', type: 'undergraduate', duration: 4, totalSemesters: 8, description: 'Four-year undergraduate engineering program' } })
  const mtech = await prisma.degree.create({ data: { name: 'Master of Technology', code: 'M.Tech', type: 'postgraduate', duration: 2, totalSemesters: 4, description: 'Two-year postgraduate engineering program' } })
  const bca = await prisma.degree.create({ data: { name: 'Bachelor of Computer Applications', code: 'BCA', type: 'undergraduate', duration: 3, totalSemesters: 6, description: 'Three-year undergraduate computer applications program' } })
  const mba = await prisma.degree.create({ data: { name: 'Master of Business Administration', code: 'MBA', type: 'postgraduate', duration: 2, totalSemesters: 4, description: 'Two-year postgraduate management program' } })

  // ─── Branches ───
  const cse = await prisma.branch.create({ data: { degreeId: btech.id, name: 'Computer Science & Engineering', code: 'CSE', capacity: 120 } })
  const ece = await prisma.branch.create({ data: { degreeId: btech.id, name: 'Electronics & Communication Engineering', code: 'ECE', capacity: 90 } })
  const me = await prisma.branch.create({ data: { degreeId: btech.id, name: 'Mechanical Engineering', code: 'ME', capacity: 90 } })
  const ce = await prisma.branch.create({ data: { degreeId: btech.id, name: 'Civil Engineering', code: 'CE', capacity: 60 } })
  const it = await prisma.branch.create({ data: { degreeId: btech.id, name: 'Information Technology', code: 'IT', capacity: 90 } })
  const mtechCse = await prisma.branch.create({ data: { degreeId: mtech.id, name: 'Computer Science & Engineering', code: 'CSE', capacity: 30 } })
  const bcaCa = await prisma.branch.create({ data: { degreeId: bca.id, name: 'Computer Applications', code: 'CA', capacity: 60 } })

  // ─── Subjects ─── (B.Tech CSE Sem 6 Batch 2021)
  const sub_ai = await prisma.subject.create({ data: { code: 'CS601', name: 'Artificial Intelligence', degreeId: btech.id, branchId: cse.id, semester: 6, batch: 2021, credits: 4, type: 'theory' } })
  const sub_ml = await prisma.subject.create({ data: { code: 'CS602', name: 'Machine Learning', degreeId: btech.id, branchId: cse.id, semester: 6, batch: 2021, credits: 4, type: 'theory' } })
  const sub_cc = await prisma.subject.create({ data: { code: 'CS603', name: 'Cloud Computing', degreeId: btech.id, branchId: cse.id, semester: 6, batch: 2021, credits: 3, type: 'theory' } })
  const sub_se = await prisma.subject.create({ data: { code: 'CS604', name: 'Software Engineering', degreeId: btech.id, branchId: cse.id, semester: 6, batch: 2021, credits: 3, type: 'theory' } })
  const sub_wd = await prisma.subject.create({ data: { code: 'CS605', name: 'Web Development', degreeId: btech.id, branchId: cse.id, semester: 6, batch: 2021, credits: 3, type: 'practical' } })
  const sub_proj = await prisma.subject.create({ data: { code: 'CS606', name: 'Project', degreeId: btech.id, branchId: cse.id, semester: 6, batch: 2021, credits: 6, type: 'project' } })

  // B.Tech CSE Sem 4 Batch 2022
  const sub_dbms = await prisma.subject.create({ data: { code: 'CS401', name: 'Database Management Systems', degreeId: btech.id, branchId: cse.id, semester: 4, batch: 2022, credits: 4, type: 'theory' } })
  const sub_os = await prisma.subject.create({ data: { code: 'CS402', name: 'Operating Systems', degreeId: btech.id, branchId: cse.id, semester: 4, batch: 2022, credits: 4, type: 'theory' } })
  const sub_cn = await prisma.subject.create({ data: { code: 'CS403', name: 'Computer Networks', degreeId: btech.id, branchId: cse.id, semester: 4, batch: 2022, credits: 3, type: 'theory' } })

  // B.Tech ME Sem 4 Batch 2022
  const sub_thermo = await prisma.subject.create({ data: { code: 'ME401', name: 'Thermodynamics', degreeId: btech.id, branchId: me.id, semester: 4, batch: 2022, credits: 4, type: 'theory' } })
  const sub_fm = await prisma.subject.create({ data: { code: 'ME402', name: 'Fluid Mechanics', degreeId: btech.id, branchId: me.id, semester: 4, batch: 2022, credits: 4, type: 'theory' } })

  // ─── Admin ───
  const admin = await prisma.user.create({
    data: {
      email: 'admin@college.edu',
      name: 'Admin User',
      role: 'ADMIN',
      password: hashedPassword,
    }
  })

  // ─── Teachers ───
  const t1 = await prisma.user.create({
    data: {
      email: 'rajesh.kumar@college.edu', name: 'Dr. Rajesh Kumar', phone: '+91 9876540001', role: 'TEACHER', password: hashedPassword,
      employeeId: 'EMP001', departmentId: 'dept_1', departmentName: 'Computer Science & Engineering',
      designation: 'Professor', qualification: 'Ph.D. in Computer Science', experience: 15, joiningDate: '2010-07-01', salary: 120000,
    }
  })
  const t2 = await prisma.user.create({
    data: {
      email: 'sunita.sharma@college.edu', name: 'Dr. Sunita Sharma', phone: '+91 9876540002', role: 'TEACHER', password: hashedPassword,
      employeeId: 'EMP002', departmentId: 'dept_1', departmentName: 'Computer Science & Engineering',
      designation: 'Associate Professor', qualification: 'Ph.D. in Software Engineering', experience: 10, joiningDate: '2013-08-15', salary: 100000,
    }
  })
  const t3 = await prisma.user.create({
    data: {
      email: 'amit.gupta@college.edu', name: 'Prof. Amit Gupta', phone: '+91 9876540003', role: 'TEACHER', password: hashedPassword,
      employeeId: 'EMP003', departmentId: 'dept_3', departmentName: 'Mechanical Engineering',
      designation: 'Assistant Professor', qualification: 'M.Tech in Mechanical Engineering', experience: 8, joiningDate: '2015-06-01', salary: 80000,
    }
  })
  const t4 = await prisma.user.create({
    data: {
      email: 'priya.malhotra@college.edu', name: 'Dr. Priya Malhotra', phone: '+91 9876540004', role: 'TEACHER', password: hashedPassword,
      employeeId: 'EMP004', departmentId: 'dept_1', departmentName: 'Computer Science & Engineering',
      designation: 'Assistant Professor', qualification: 'Ph.D. in Data Science', experience: 6, joiningDate: '2018-07-15', salary: 85000,
    }
  })
  const t5 = await prisma.user.create({
    data: {
      email: 'vikram.singh@college.edu', name: 'Prof. Vikram Singh', phone: '+91 9876540005', role: 'TEACHER', password: hashedPassword,
      employeeId: 'EMP005', departmentId: 'dept_2', departmentName: 'Electronics & Communication Engineering',
      designation: 'Associate Professor', qualification: 'M.Tech in Electrical Engineering', experience: 12, joiningDate: '2012-08-01', salary: 95000,
    }
  })

  // ─── Teacher-Subject Assignments ───
  await prisma.teacherSubject.createMany({
    data: [
      { teacherId: t1.id, subjectId: sub_ai.id },
      { teacherId: t1.id, subjectId: sub_dbms.id },
      { teacherId: t2.id, subjectId: sub_ml.id },
      { teacherId: t2.id, subjectId: sub_os.id },
      { teacherId: t4.id, subjectId: sub_cc.id },
      { teacherId: t4.id, subjectId: sub_se.id },
      { teacherId: t4.id, subjectId: sub_wd.id },
      { teacherId: t3.id, subjectId: sub_thermo.id },
      { teacherId: t3.id, subjectId: sub_fm.id },
    ]
  })

  // ─── Students (B.Tech CSE Batch 2021, Sem 6) ───
  const s1 = await prisma.user.create({
    data: {
      email: 'rahul.sharma@student.college.edu', name: 'Rahul Sharma', phone: '+91 9876543210', role: 'STUDENT', password: hashedPassword,
      rollNo: '21CSE001', semester: 6, batch: 2021, degreeId: btech.id, degreeName: 'B.Tech', branchId: cse.id, branchName: 'Computer Science & Engineering', branchCode: 'CSE',
      dateOfBirth: '2003-05-15', address: '123 Main St, Delhi', guardianName: 'Mr. Sharma', guardianPhone: '+91 9876543211', admissionDate: '2021-08-01',
    }
  })
  const s2 = await prisma.user.create({
    data: {
      email: 'priya.verma@student.college.edu', name: 'Priya Verma', phone: '+91 9876543212', role: 'STUDENT', password: hashedPassword,
      rollNo: '21CSE002', semester: 6, batch: 2021, degreeId: btech.id, degreeName: 'B.Tech', branchId: cse.id, branchName: 'Computer Science & Engineering', branchCode: 'CSE',
      dateOfBirth: '2003-08-22', address: '456 Park Ave, Mumbai', guardianName: 'Mr. Verma', guardianPhone: '+91 9876543213', admissionDate: '2021-08-01',
    }
  })
  const s3 = await prisma.user.create({
    data: {
      email: 'sneha.patel@student.college.edu', name: 'Sneha Patel', phone: '+91 9876543216', role: 'STUDENT', password: hashedPassword,
      rollNo: '21CSE003', semester: 6, batch: 2021, degreeId: btech.id, degreeName: 'B.Tech', branchId: cse.id, branchName: 'Computer Science & Engineering', branchCode: 'CSE',
      dateOfBirth: '2003-11-30', address: '321 Hill View, Pune', guardianName: 'Mr. Patel', guardianPhone: '+91 9876543217', admissionDate: '2021-08-01',
    }
  })
  const s4 = await prisma.user.create({
    data: {
      email: 'rohan.das@student.college.edu', name: 'Rohan Das', phone: '+91 9876543230', role: 'STUDENT', password: hashedPassword,
      rollNo: '21CSE004', semester: 6, batch: 2021, degreeId: btech.id, degreeName: 'B.Tech', branchId: cse.id, branchName: 'Computer Science & Engineering', branchCode: 'CSE',
      dateOfBirth: '2003-02-14', address: '99 Tech Park, Noida', guardianName: 'Mr. Das', guardianPhone: '+91 9876543231', admissionDate: '2021-08-01',
    }
  })
  const s5 = await prisma.user.create({
    data: {
      email: 'ananya.iyer@student.college.edu', name: 'Ananya Iyer', phone: '+91 9876543232', role: 'STUDENT', password: hashedPassword,
      rollNo: '21CSE005', semester: 6, batch: 2021, degreeId: btech.id, degreeName: 'B.Tech', branchId: cse.id, branchName: 'Computer Science & Engineering', branchCode: 'CSE',
      dateOfBirth: '2003-07-08', address: '42 Lake View, Bangalore', guardianName: 'Mrs. Iyer', guardianPhone: '+91 9876543233', admissionDate: '2021-08-01',
    }
  })

  // Students (B.Tech CSE Batch 2022, Sem 4)
  const s6 = await prisma.user.create({
    data: {
      email: 'arjun.singh@student.college.edu', name: 'Arjun Singh', phone: '+91 9876543218', role: 'STUDENT', password: hashedPassword,
      rollNo: '22CSE001', semester: 4, batch: 2022, degreeId: btech.id, degreeName: 'B.Tech', branchId: cse.id, branchName: 'Computer Science & Engineering', branchCode: 'CSE',
      dateOfBirth: '2004-01-25', address: '555 Garden St, Hyderabad', guardianName: 'Mrs. Singh', guardianPhone: '+91 9876543219', admissionDate: '2022-08-01',
    }
  })
  const s7 = await prisma.user.create({
    data: {
      email: 'neha.gupta@student.college.edu', name: 'Neha Gupta', phone: '+91 9876543220', role: 'STUDENT', password: hashedPassword,
      rollNo: '22CSE002', semester: 4, batch: 2022, degreeId: btech.id, degreeName: 'B.Tech', branchId: cse.id, branchName: 'Computer Science & Engineering', branchCode: 'CSE',
      dateOfBirth: '2004-07-12', address: '888 Tech Park, Chennai', guardianName: 'Mr. Gupta', guardianPhone: '+91 9876543221', admissionDate: '2022-08-01',
    }
  })

  // Student (B.Tech ME Batch 2022)
  const s8 = await prisma.user.create({
    data: {
      email: 'amit.kumar@student.college.edu', name: 'Amit Kumar', phone: '+91 9876543214', role: 'STUDENT', password: hashedPassword,
      rollNo: '22ME001', semester: 4, batch: 2022, degreeId: btech.id, degreeName: 'B.Tech', branchId: me.id, branchName: 'Mechanical Engineering', branchCode: 'ME',
      dateOfBirth: '2004-03-10', address: '789 Lake Road, Bangalore', guardianName: 'Mrs. Kumar', guardianPhone: '+91 9876543215', admissionDate: '2022-08-01',
    }
  })

  const cseSem6Students = [s1, s2, s3, s4, s5]
  const cseSem4Students = [s6, s7]
  const cseSem6Subjects = [sub_ai, sub_ml, sub_cc, sub_se, sub_wd, sub_proj]

  // ─── Attendance (generate for last 30 days) ───
  console.log('  Seeding attendance...')
  const attendanceData: { studentId: string; subjectId: string; date: string; status: string }[] = []
  for (let dayOffset = 1; dayOffset <= 30; dayOffset++) {
    const date = new Date()
    date.setDate(date.getDate() - dayOffset)
    if (date.getDay() === 0 || date.getDay() === 6) continue
    const dateStr = date.toISOString().split('T')[0]

    for (const student of cseSem6Students) {
      for (const subject of cseSem6Subjects) {
        const rand = Math.random()
        const status = rand < 0.80 ? 'present' : rand < 0.92 ? 'absent' : 'leave'
        attendanceData.push({ studentId: student.id, subjectId: subject.id, date: dateStr, status })
      }
    }
    for (const student of cseSem4Students) {
      for (const subject of [sub_dbms, sub_os, sub_cn]) {
        const rand = Math.random()
        const status = rand < 0.80 ? 'present' : rand < 0.92 ? 'absent' : 'leave'
        attendanceData.push({ studentId: student.id, subjectId: subject.id, date: dateStr, status })
      }
    }
  }
  await prisma.attendance.createMany({ data: attendanceData })

  // ─── Timetable ───
  console.log('  Seeding timetable...')
  const timetableData = [
    // B.Tech CSE Sem 6
    { subjectId: sub_ai.id, dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:00', room: 'CS-301', semester: 6, batch: 2021, branchId: cse.id, degreeId: btech.id },
    { subjectId: sub_ml.id, dayOfWeek: 'Monday', startTime: '10:15', endTime: '11:15', room: 'CS-302', semester: 6, batch: 2021, branchId: cse.id, degreeId: btech.id },
    { subjectId: sub_cc.id, dayOfWeek: 'Monday', startTime: '11:30', endTime: '12:30', room: 'CS-303', semester: 6, batch: 2021, branchId: cse.id, degreeId: btech.id },
    { subjectId: sub_se.id, dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '10:00', room: 'CS-301', semester: 6, batch: 2021, branchId: cse.id, degreeId: btech.id },
    { subjectId: sub_wd.id, dayOfWeek: 'Tuesday', startTime: '10:15', endTime: '11:15', room: 'Lab-1', semester: 6, batch: 2021, branchId: cse.id, degreeId: btech.id },
    { subjectId: sub_ai.id, dayOfWeek: 'Tuesday', startTime: '11:30', endTime: '12:30', room: 'CS-301', semester: 6, batch: 2021, branchId: cse.id, degreeId: btech.id },
    { subjectId: sub_ml.id, dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '10:00', room: 'CS-302', semester: 6, batch: 2021, branchId: cse.id, degreeId: btech.id },
    { subjectId: sub_proj.id, dayOfWeek: 'Wednesday', startTime: '10:15', endTime: '12:30', room: 'Lab-2', semester: 6, batch: 2021, branchId: cse.id, degreeId: btech.id },
    { subjectId: sub_cc.id, dayOfWeek: 'Thursday', startTime: '09:00', endTime: '10:00', room: 'CS-303', semester: 6, batch: 2021, branchId: cse.id, degreeId: btech.id },
    { subjectId: sub_se.id, dayOfWeek: 'Thursday', startTime: '10:15', endTime: '11:15', room: 'CS-301', semester: 6, batch: 2021, branchId: cse.id, degreeId: btech.id },
    { subjectId: sub_wd.id, dayOfWeek: 'Thursday', startTime: '14:00', endTime: '16:00', room: 'Lab-1', semester: 6, batch: 2021, branchId: cse.id, degreeId: btech.id },
    { subjectId: sub_ai.id, dayOfWeek: 'Friday', startTime: '09:00', endTime: '10:00', room: 'CS-301', semester: 6, batch: 2021, branchId: cse.id, degreeId: btech.id },
    { subjectId: sub_ml.id, dayOfWeek: 'Friday', startTime: '10:15', endTime: '11:15', room: 'CS-302', semester: 6, batch: 2021, branchId: cse.id, degreeId: btech.id },
  ]
  await prisma.timetableEntry.createMany({ data: timetableData })

  // ─── Assignments ───
  console.log('  Seeding assignments...')
  const a1 = await prisma.assignment.create({
    data: {
      title: 'SQL Query Optimization', description: 'Write optimized SQL queries for given scenarios', subjectId: sub_ai.id, teacherId: t1.id,
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], totalMarks: 50,
    }
  })
  const a2 = await prisma.assignment.create({
    data: {
      title: 'Neural Network Implementation', description: 'Implement a simple neural network from scratch', subjectId: sub_ml.id, teacherId: t2.id,
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0], totalMarks: 100,
    }
  })
  const a3 = await prisma.assignment.create({
    data: {
      title: 'Cloud Architecture Design', description: 'Design a cloud-native architecture for an e-commerce app', subjectId: sub_cc.id, teacherId: t4.id,
      dueDate: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], totalMarks: 50, status: 'closed',
    }
  })
  const a4 = await prisma.assignment.create({
    data: {
      title: 'Process Scheduling Simulation', description: 'Simulate CPU scheduling algorithms', subjectId: sub_os.id, teacherId: t2.id,
      dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0], totalMarks: 50,
    }
  })

  // Assignment submissions
  await prisma.assignmentSubmission.createMany({
    data: [
      { assignmentId: a3.id, studentId: s1.id, status: 'graded', grade: 'A', marks: 45, feedback: 'Excellent work!' },
      { assignmentId: a3.id, studentId: s2.id, status: 'graded', grade: 'B+', marks: 40, feedback: 'Good effort' },
      { assignmentId: a3.id, studentId: s3.id, status: 'graded', grade: 'A-', marks: 42 },
      { assignmentId: a1.id, studentId: s1.id, status: 'submitted' },
      { assignmentId: a1.id, studentId: s2.id, status: 'submitted' },
    ]
  })

  // ─── Grades (semester-wise) ───
  console.log('  Seeding grades...')
  const gradeOptions = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C']
  const gradePointMap: Record<string, number> = { 'A+': 10, 'A': 9, 'A-': 8.5, 'B+': 8, 'B': 7, 'B-': 6.5, 'C+': 6, 'C': 5 }

  for (const student of cseSem6Students) {
    for (const subject of cseSem6Subjects) {
      const g = gradeOptions[Math.floor(Math.random() * gradeOptions.length)]
      const marks = 50 + Math.floor(Math.random() * 45)
      await prisma.grade.create({
        data: {
          studentId: student.id, subjectId: subject.id, semester: 6, type: 'overall',
          grade: g, marks, points: gradePointMap[g],
        }
      })
    }
  }

  // ─── Materials ───
  console.log('  Seeding materials...')
  await prisma.material.createMany({
    data: [
      { title: 'AI Lecture Notes - Unit 1', description: 'Introduction to Artificial Intelligence concepts', subjectId: sub_ai.id, teacherId: t1.id, type: 'document', fileSize: '2.5 MB' },
      { title: 'Machine Learning Problem Set', description: 'Practice problems for linear regression and classification', subjectId: sub_ml.id, teacherId: t2.id, type: 'document', fileSize: '1.2 MB' },
      { title: 'Cloud Computing Video Lecture', description: 'AWS services overview and hands-on demo', subjectId: sub_cc.id, teacherId: t4.id, type: 'video', fileSize: '150 MB' },
      { title: 'Software Engineering Lab Manual', description: 'Step-by-step lab exercises for SE', subjectId: sub_se.id, teacherId: t4.id, type: 'document', fileSize: '3.8 MB' },
      { title: 'DBMS SQL Reference', description: 'Complete SQL syntax reference guide', subjectId: sub_dbms.id, teacherId: t1.id, type: 'document', fileSize: '800 KB' },
      { title: 'OS Process Scheduling Demo', description: 'Video demonstration of scheduling algorithms', subjectId: sub_os.id, teacherId: t2.id, type: 'video', fileSize: '85 MB' },
    ]
  })

  // ─── Events ───
  console.log('  Seeding events...')
  const ev1 = await prisma.event.create({
    data: {
      title: 'Annual Tech Fest 2025', description: 'Three-day technical festival featuring coding competitions, robotics, and innovation showcases',
      type: 'cultural', startDate: '2025-11-15', endDate: '2025-11-17', venue: 'Main Campus Auditorium', organizer: 'Student Council', createdById: admin.id, status: 'upcoming',
    }
  })
  const ev2 = await prisma.event.create({
    data: {
      title: 'AI & Machine Learning Workshop', description: 'Hands-on workshop on latest trends in AI and ML by industry experts',
      type: 'workshop', startDate: '2025-10-20', endDate: '2025-10-20', venue: 'Computer Science Lab', organizer: 'CS Department', createdById: t1.id, status: 'upcoming',
    }
  })
  const ev3 = await prisma.event.create({
    data: {
      title: 'Inter-College Sports Meet', description: 'Annual sports competition with various indoor and outdoor games',
      type: 'sports', startDate: '2025-12-01', endDate: '2025-12-05', venue: 'Sports Complex', organizer: 'Sports Department', createdById: admin.id, status: 'upcoming',
    }
  })

  // Event registrations
  await prisma.eventRegistration.createMany({
    data: [
      { eventId: ev1.id, studentId: s1.id },
      { eventId: ev1.id, studentId: s2.id },
      { eventId: ev2.id, studentId: s1.id },
    ]
  })

  // ─── Leave Applications ───
  console.log('  Seeding leave applications...')
  await prisma.leaveApplication.createMany({
    data: [
      { userId: s1.id, fromDate: '2025-02-10', toDate: '2025-02-12', reason: 'Family function', type: 'personal', status: 'approved', reviewerId: admin.id, adminRemarks: 'Approved' },
      { userId: s1.id, fromDate: '2025-03-05', toDate: '2025-03-05', reason: 'Not feeling well', type: 'medical', status: 'pending' },
      { userId: t1.id, fromDate: '2025-02-20', toDate: '2025-02-21', reason: 'Conference attendance', type: 'academic', status: 'approved', reviewerId: admin.id, adminRemarks: 'Approved for conference' },
      { userId: t1.id, fromDate: '2025-03-15', toDate: '2025-03-15', reason: 'Personal work', type: 'personal', status: 'pending' },
      { userId: s2.id, fromDate: '2025-01-15', toDate: '2025-01-16', reason: 'Medical appointment', type: 'medical', status: 'rejected', reviewerId: admin.id, adminRemarks: 'Insufficient documentation' },
    ]
  })

  // ─── Library Books ───
  console.log('  Seeding library...')
  const book1 = await prisma.libraryBook.create({ data: { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', category: 'Computer Science', publisher: 'MIT Press', totalCopies: 5, available: 3, location: 'Shelf A-1' } })
  const book2 = await prisma.libraryBook.create({ data: { title: 'Operating System Concepts', author: 'Abraham Silberschatz', isbn: '978-1119800361', category: 'Computer Science', publisher: 'Wiley', totalCopies: 4, available: 2, location: 'Shelf A-2' } })
  const book3 = await prisma.libraryBook.create({ data: { title: 'Database System Concepts', author: 'Abraham Silberschatz', isbn: '978-0078022159', category: 'Computer Science', publisher: 'McGraw-Hill', totalCopies: 3, available: 1, location: 'Shelf A-3' } })
  const book4 = await prisma.libraryBook.create({ data: { title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell', isbn: '978-0134610993', category: 'Computer Science', publisher: 'Pearson', totalCopies: 3, available: 2, location: 'Shelf B-1' } })
  await prisma.libraryBook.create({ data: { title: 'Design Patterns', author: 'Erich Gamma', isbn: '978-0201633610', category: 'Software Engineering', publisher: 'Addison-Wesley', totalCopies: 2, available: 2, location: 'Shelf B-2' } })

  await prisma.bookIssue.createMany({
    data: [
      { bookId: book1.id, studentId: s1.id, issueDate: '2025-02-01', dueDate: '2025-02-15', status: 'active' },
      { bookId: book2.id, studentId: s1.id, issueDate: '2025-01-15', dueDate: '2025-01-30', status: 'overdue' },
      { bookId: book3.id, studentId: s2.id, issueDate: '2025-02-05', dueDate: '2025-02-20', returnDate: '2025-02-18', status: 'returned' },
    ]
  })

  // ─── Extracurricular Activities ───
  console.log('  Seeding extracurricular activities...')
  await prisma.extracurricularActivity.createMany({
    data: [
      { studentId: s1.id, teacherId: t1.id, activityType: 'sports', activityName: 'Cricket Tournament', description: 'Inter-department cricket tournament', date: '2025-01-15', achievement: 'Best Batsman', points: 50, status: 'approved' },
      { studentId: s2.id, teacherId: t2.id, activityType: 'cultural', activityName: 'Dance Competition', description: 'Annual cultural fest dance competition', date: '2025-01-20', achievement: 'First Prize', points: 40, status: 'approved' },
      { studentId: s3.id, teacherId: t1.id, activityType: 'technical', activityName: 'Hackathon', description: '24-hour coding hackathon', date: '2025-02-10', achievement: 'Runner Up', points: 45, status: 'pending' },
      { studentId: s1.id, activityType: 'social', activityName: 'Blood Donation Camp', description: 'NSS organized blood donation', date: '2025-02-05', points: 10, status: 'approved' },
    ]
  })

  // ─── Submitted Records ───
  console.log('  Seeding submitted records...')
  await prisma.submittedRecord.createMany({
    data: [
      { title: 'Monthly Attendance Report - January 2025', description: 'Complete attendance records for AI - Sem 6', type: 'ATTENDANCE', subject: 'Artificial Intelligence', semester: 6, batch: 2021, status: 'APPROVED', adminRemarks: 'Records verified and approved', submitterId: t1.id, reviewerId: admin.id },
      { title: 'Mid-term Exam Grades - Operating Systems', description: 'All student grades for mid-term examination', type: 'GRADES', subject: 'Operating Systems', semester: 4, batch: 2022, status: 'PENDING', submitterId: t2.id },
      { title: 'Assignment Evaluation Report', description: 'Grading summary for Cloud Computing Assignment', type: 'ASSIGNMENTS', subject: 'Cloud Computing', semester: 6, batch: 2021, status: 'APPROVED', submitterId: t4.id, reviewerId: admin.id },
    ]
  })

  console.log('Database seeded successfully!')
  console.log(`  Admin: admin@college.edu / password123`)
  console.log(`  Teachers: EMP001-EMP005 / password123`)
  console.log(`  Students: 21CSE001-21CSE005, 22CSE001-22CSE002, 22ME001 / password123`)
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })