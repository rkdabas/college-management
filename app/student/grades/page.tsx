"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Award, TrendingUp, Filter, Search } from "lucide-react";
import { useAuthStore } from "@/lib/store";
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
  id: string;
  subjectId: string;
  semester: number;
  type: string;
  grade: string | null;
  marks: number | null;
  totalMarks: number | null;
  points: number | null;
  subject: { id: string; name: string; code: string };
}

export default function StudentGradesPage() {
  const { user } = useAuthStore();
  const currentSemester = user?.semester ?? 6;
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGradeType, setSelectedGradeType] = useState<GradeType>("all");
  const [selectedSemester, setSelectedSemester] = useState<number>(currentSemester);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/grades?studentId=${user.id}`)
      .then((res) => res.ok ? res.json() : [])
      .then(setGrades)
      .catch(() => setGrades([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const calculateSGPA = (semester: number): string => {
    const semesterGrades = grades.filter((g) => g.semester === semester && g.points != null);
    if (semesterGrades.length === 0) return "0";
    const subjectIds = new Set(semesterGrades.map((g) => g.subjectId));
    const bySubject = new Map<string, Grade>();
    semesterGrades.forEach((g) => {
      const existing = bySubject.get(g.subjectId);
      if (!existing || (g.type === "final" && existing.type !== "final")) {
        bySubject.set(g.subjectId, g);
      }
    });
    const finalGrades = Array.from(bySubject.values()).filter((g) => g.points != null);
    const totalPoints = finalGrades.reduce((sum, g) => sum + (g.points ?? 0) * 4, 0);
    const totalCredits = finalGrades.length * 4;
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0";
  };

  const calculateCGPA = (): string => {
    const allSemesters = Array.from(new Set(grades.map((g) => g.semester)));
    let totalPoints = 0;
    let totalCredits = 0;
    allSemesters.forEach((sem) => {
      const semGrades = grades.filter((g) => g.semester === sem && g.points != null);
      const bySubject = new Map<string, Grade>();
      semGrades.forEach((g) => {
        const existing = bySubject.get(g.subjectId);
        if (!existing || (g.type === "final" && existing.type !== "final")) {
          bySubject.set(g.subjectId, g);
        }
      });
      bySubject.forEach((g) => {
        totalPoints += (g.points ?? 0) * 4;
        totalCredits += 4;
      });
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0";
  };

  const cgpa = parseFloat(calculateCGPA());
  const sgpa = parseFloat(calculateSGPA(selectedSemester));

  const filteredGrades = useMemo(() => {
    let filtered = grades.filter((g) => g.semester === selectedSemester);
    if (selectedGradeType !== "all") {
      filtered = filtered.filter((g) => g.type === selectedGradeType);
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (g) =>
          g.subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.subject.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [grades, selectedGradeType, selectedSemester, searchQuery]);

  const semesterHistory = useMemo(() => {
    const semesters = Array.from(new Set(grades.map((g) => g.semester))).sort((a, b) => b - a);
    return semesters.map((sem) => ({
      semester: sem,
      sgpa: parseFloat(calculateSGPA(sem)),
      cgpa: parseFloat(calculateCGPA()),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grades]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Grades</h1>
        <p className="text-gray-600">View your academic performance and grades</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                {Array.from({ length: Math.max(currentSemester, 1) }, (_, i) => i + 1).map((sem) => (
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
            {selectedGradeType === "all"
              ? "All Grades"
              : selectedGradeType === "mid-sem"
              ? "Mid-Semester Exam Grades"
              : selectedGradeType === "end-sem"
              ? "End-Semester Exam Grades"
              : selectedGradeType === "assignment"
              ? "Assignment Grades"
              : "Lab Grades"}{" "}
            - Semester {selectedSemester}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredGrades.length > 0 ? (
            <div className="space-y-4">
              {filteredGrades.map((grade) => (
                <div key={grade.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-bold text-gray-900">{grade.subject.name}</h3>
                        <Badge variant="outline">{grade.subject.code}</Badge>
                        {grade.grade && <Badge variant="success">{grade.grade}</Badge>}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Type: {grade.type}</span>
                        {grade.marks != null && (
                          <span>
                            Marks: {grade.marks}/{grade.totalMarks ?? 100}
                          </span>
                        )}
                        {grade.points != null && <span>Points: {grade.points}</span>}
                      </div>
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

      {semesterHistory.length > 0 && (
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
      )}
    </div>
  );
}
