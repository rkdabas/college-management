// Department data for faculty management

export interface Department {
  id: string;
  name: string;
  code: string;
  head?: string; // Faculty ID of department head
  description: string;
}

export const departments: Department[] = [
  {
    id: "dept_1",
    name: "Computer Science & Engineering",
    code: "CSE",
    description: "Department of Computer Science & Engineering",
  },
  {
    id: "dept_2",
    name: "Electrical Engineering",
    code: "EE",
    description: "Department of Electrical Engineering",
  },
  {
    id: "dept_3",
    name: "Mechanical Engineering",
    code: "ME",
    description: "Department of Mechanical Engineering",
  },
  {
    id: "dept_4",
    name: "Civil Engineering",
    code: "CE",
    description: "Department of Civil Engineering",
  },
  {
    id: "dept_5",
    name: "Electronics & Communication Engineering",
    code: "ECE",
    description: "Department of Electronics & Communication Engineering",
  },
  {
    id: "dept_6",
    name: "Business Administration",
    code: "MBA",
    description: "Department of Business Administration",
  },
  {
    id: "dept_7",
    name: "Basic Sciences",
    code: "BS",
    description: "Department of Basic Sciences (Physics, Chemistry, Mathematics)",
  },
];

export function getDepartmentById(id: string): Department | undefined {
  return departments.find(dept => dept.id === id);
}

export function getDepartmentByCode(code: string): Department | undefined {
  return departments.find(dept => dept.code === code);
}

