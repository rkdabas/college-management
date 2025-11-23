"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Award, TrendingUp, Filter, Search } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { demoStudents } from "@/lib/demo-data-v2";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type GradeType = "all" | "mid-sem" | "end-sem" | "assignment" | "lab";

interface Grade {
  subject: string;
  code: string;
  credits: number;
  grade: string;
  points: number;
  marks: number;
  type: GradeType;
  semester: number;
  midSemMarks?: number;
  endSemMarks?: number;
  assignmentMarks?: number;
  labMarks?: number;
}

export default function StudentGradesPage() {
  const { user } = useAuthStore();
  const student = demoStudents.find(s => s.id === user?.id);
  const currentSemester = student?.semester || 6;

  const [selectedGradeType, setSelectedGradeType] = useState<GradeType>("all");
  const [selectedSemester, setSelectedSemester] = useState<number>(currentSemester);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock grades data for all semesters
  const allGrades: Grade[] = [
    // Semester 6 (Current)
    { subject: "DBMS", code: "CS601", credits: 4, grade: "A", points: 9, marks: 85, type: "all", semester: 6, midSemMarks: 40, endSemMarks: 45, assignmentMarks: 18, labMarks: 22 },
    { subject: "OS", code: "CS602", credits: 4, grade: "B+", points: 8, marks: 78, type: "all", semester: 6, midSemMarks: 35, endSemMarks: 43, assignmentMarks: 16, labMarks: 20 },
    { subject: "AI/ML", code: "CS603", credits: 3, grade: "A", points: 9, marks: 88, type: "all", semester: 6, midSemMarks: 42, endSemMarks: 46, assignmentMarks: 20, labMarks: 22 },
    { subject: "SE", code: "CS604", credits: 3, grade: "B", points: 7, marks: 72, type: "all", semester: 6, midSemMarks: 32, endSemMarks: 40, assignmentMarks: 15, labMarks: 18 },
    { subject: "Web Dev", code: "CS605", credits: 3, grade: "A-", points: 8.5, marks: 82, type: "all", semester: 6, midSemMarks: 38, endSemMarks: 44, assignmentMarks: 19, labMarks: 21 },
    { subject: "Project", code: "CS606", credits: 6, grade: "A+", points: 10, marks: 95, type: "all", semester: 6, midSemMarks: 45, endSemMarks: 50, assignmentMarks: 25, labMarks: 25 },
    
    // Semester 5
    { subject: "Computer Networks", code: "CS501", credits: 4, grade: "A", points: 9, marks: 87, type: "all", semester: 5, midSemMarks: 41, endSemMarks: 46, assignmentMarks: 19, labMarks: 21 },
    { subject: "Data Structures", code: "CS502", credits: 4, grade: "B+", points: 8, marks: 80, type: "all", semester: 5, midSemMarks: 37, endSemMarks: 43, assignmentMarks: 17, labMarks: 20 },
    { subject: "Algorithm Design", code: "CS503", credits: 3, grade: "A-", points: 8.5, marks: 83, type: "all", semester: 5, midSemMarks: 39, endSemMarks: 44, assignmentMarks: 18, labMarks: 20 },
    { subject: "Software Testing", code: "CS504", credits: 3, grade: "B", points: 7, marks: 75, type: "all", semester: 5, midSemMarks: 34, endSemMarks: 41, assignmentMarks: 16, labMarks: 19 },
    
    // Semester 4
    { subject: "Object Oriented Programming", code: "CS401", credits: 4, grade: "A", points: 9, marks: 86, type: "all", semester: 4, midSemMarks: 40, endSemMarks: 46, assignmentMarks: 19, labMarks: 21 },
    { subject: "Database Systems", code: "CS402", credits: 4, grade: "B+", points: 8, marks: 79, type: "all", semester: 4, midSemMarks: 36, endSemMarks: 43, assignmentMarks: 17, labMarks: 20 },
    { subject: "Web Technologies", code: "CS403", credits: 3, grade: "A-", points: 8.5, marks: 84, type: "all", semester: 4, midSemMarks: 38, endSemMarks: 46, assignmentMarks: 18, labMarks: 22 },
    
    // Semester 3
    { subject: "Programming in C++", code: "CS301", credits: 4, grade: "B+", points: 8, marks: 81, type: "all", semester: 3, midSemMarks: 37, endSemMarks: 44, assignmentMarks: 17, labMarks: 20 },
    { subject: "Discrete Mathematics", code: "CS302", credits: 3, grade: "A", points: 9, marks: 88, type: "all", semester: 3, midSemMarks: 42, endSemMarks: 46, assignmentMarks: 20 },
    { subject: "Computer Organization", code: "CS303", credits: 4, grade: "B", points: 7, marks: 76, type: "all", semester: 3, midSemMarks: 34, endSemMarks: 42, assignmentMarks: 16, labMarks: 20 },
    
    // Semester 2
    { subject: "Programming Fundamentals", code: "CS201", credits: 4, grade: "A-", points: 8.5, marks: 83, type: "all", semester: 2, midSemMarks: 39, endSemMarks: 44, assignmentMarks: 18, labMarks: 20 },
    { subject: "Mathematics II", code: "CS202", credits: 3, grade: "B+", points: 8, marks: 80, type: "all", semester: 2, midSemMarks: 37, endSemMarks: 43, assignmentMarks: 17 },
    
    // Semester 1
    { subject: "Introduction to Programming", code: "CS101", credits: 4, grade: "A", points: 9, marks: 85, type: "all", semester: 1, midSemMarks: 40, endSemMarks: 45, assignmentMarks: 18, labMarks: 22 },
    { subject: "Mathematics I", code: "CS102", credits: 3, grade: "B+", points: 8, marks: 79, type: "all", semester: 1, midSemMarks: 36, endSemMarks: 43, assignmentMarks: 17 },
  ];

  // Calculate CGPA and SGPA
  const calculateSGPA = (semester: number): string => {
    const semesterGrades = allGrades.filter(g => g.semester === semester);
    if (semesterGrades.length === 0) return "0";
    const totalPoints = semesterGrades.reduce((sum, g) => sum + (g.points * g.credits), 0);
    const totalCredits = semesterGrades.reduce((sum, g) => sum + g.credits, 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0";
  };

  const calculateCGPA = (): string => {
    const allSemesters = Array.from(new Set(allGrades.map(g => g.semester)));
    let totalPoints = 0;
    let totalCredits = 0;
    allSemesters.forEach(sem => {
      const semGrades = allGrades.filter(g => g.semester === sem);
      semGrades.forEach(g => {
        totalPoints += g.points * g.credits;
        totalCredits += g.credits;
      });
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0";
  };

  const cgpa = parseFloat(calculateCGPA());
  const sgpa = parseFloat(calculateSGPA(selectedSemester));

  // Filter grades based on selected type and semester
  const filteredGrades = useMemo(() => {
    let filtered = allGrades.filter(g => g.semester === selectedSemester);
    
    if (selectedGradeType !== "all") {
      filtered = filtered.map(g => ({
        ...g,
        marks: selectedGradeType === "mid-sem" ? g.midSemMarks || 0 :
               selectedGradeType === "end-sem" ? g.endSemMarks || 0 :
               selectedGradeType === "assignment" ? g.assignmentMarks || 0 :
               g.labMarks || 0,
      }));
    }
    
    if (searchQuery) {
      filtered = filtered.filter(g => 
        g.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [selectedGradeType, selectedSemester, searchQuery]);

  const semesterHistory = useMemo(() => {
    const semesters = Array.from(new Set(allGrades.map(g => g.semester))).sort((a, b) => b - a);
    return semesters.map(sem => ({
      semester: sem,
      sgpa: parseFloat(calculateSGPA(sem)),
      cgpa: parseFloat(calculateCGPA()),
    }));
  }, [allGrades]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Grades</h1>
        <p className="text-gray-600">View your academic performance and grades</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Current CGPA</p>
                <p className="text-4xl font-bold text-gray-900">{cgpa}</p>
                <p className="text-xs text-gray-500 mt-1">Out of 10.0</p>
              </div>
              <Award className="w-16 h-16 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Semester {selectedSemester} SGPA</p>
                <p className="text-4xl font-bold text-gray-900">{sgpa}</p>
                <p className="text-xs text-gray-500 mt-1">Selected Semester</p>
              </div>
              <TrendingUp className="w-16 h-16 text-sky-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                value={selectedGradeType}
                onChange={(e) => setSelectedGradeType(e.target.value as GradeType)}
              >
                <option value="all">All Grades</option>
                <option value="mid-sem">Mid-Sem Exam Grades</option>
                <option value="end-sem">End-Sem Exam Grades</option>
                <option value="assignment">Assignment Grades</option>
                <option value="lab">Lab Grades</option>
              </select>
            </div>
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
              >
                {Array.from({ length: currentSemester }, (_, i) => i + 1).map(sem => (
                  <option key={sem} value={sem}>
                    Semester {sem} {sem === currentSemester ? "(Current)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedGradeType === "all" ? "All Grades" :
             selectedGradeType === "mid-sem" ? "Mid-Semester Exam Grades" :
             selectedGradeType === "end-sem" ? "End-Semester Exam Grades" :
             selectedGradeType === "assignment" ? "Assignment Grades" :
             "Lab Grades"} - Semester {selectedSemester}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredGrades.length > 0 ? (
            <div className="space-y-4">
              {filteredGrades.map((grade, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900">{grade.subject}</h3>
                        <Badge variant="outline">{grade.code}</Badge>
                        {selectedGradeType === "all" && (
                          <Badge variant="success">{grade.grade}</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Credits: {grade.credits}</span>
                        {selectedGradeType === "all" ? (
                          <>
                            <span>Total Marks: {grade.marks}/100</span>
                            <span>Points: {grade.points}</span>
                            <span>Grade: {grade.grade}</span>
                          </>
                        ) : (
                          <span>
                            {selectedGradeType === "mid-sem" && `Mid-Sem: ${grade.midSemMarks || 0}/50`}
                            {selectedGradeType === "end-sem" && `End-Sem: ${grade.endSemMarks || 0}/50`}
                            {selectedGradeType === "assignment" && `Assignment: ${grade.assignmentMarks || 0}/20`}
                            {selectedGradeType === "lab" && `Lab: ${grade.labMarks || 0}/20`}
                          </span>
                        )}
                      </div>
                      {selectedGradeType === "all" && (
                        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                          <span>Mid-Sem: {grade.midSemMarks || 0}/50</span>
                          <span>End-Sem: {grade.endSemMarks || 0}/50</span>
                          <span>Assignment: {grade.assignmentMarks || 0}/20</span>
                          {grade.labMarks && <span>Lab: {grade.labMarks}/20</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-12">
              <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No grades found for the selected filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Semester-wise Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={semesterHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="semester" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="sgpa" fill="#0ea5e9" name="SGPA" />
              <Bar dataKey="cgpa" fill="#10b981" name="CGPA" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

