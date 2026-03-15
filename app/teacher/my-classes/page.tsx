"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import Link from "next/link";

interface Subject {
  id: string;
  name: string;
  code: string;
  semester: number;
  batch: number;
  branchId?: string;
  degreeId?: string;
}

export default function TeacherMyClassesPage() {
  const { user } = useAuthStore();
  const [classes, setClasses] = useState<Subject[]>([]);
  const [studentCounts, setStudentCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/subjects?teacherId=${user.id}`)
      .then((res) => res.json())
      .then((subjects: Subject[]) => {
        if (Array.isArray(subjects)) setClasses(subjects);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  useEffect(() => {
    if (classes.length === 0) return;
    const fetchCounts = async () => {
      const counts: Record<string, number> = {};
      await Promise.all(
        classes.map(async (s) => {
          const res = await fetch(
            `/api/students?semester=${s.semester}&batch=${s.batch}${s.branchId ? `&branchId=${s.branchId}` : ""}`
          );
          const students = await res.json();
          counts[s.id] = Array.isArray(students) ? students.length : 0;
        })
      );
      setStudentCounts(counts);
    };
    fetchCounts();
  }, [classes]);

  const totalStudents = Object.values(studentCounts).reduce((a, b) => a + b, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-500">Loading classes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          My Classes
        </h1>
        <p className="text-gray-600">Manage your assigned subjects and classes</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Classes</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {classes.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Students</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {totalStudents}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Department</p>
              <p className="text-lg font-bold text-gray-900 truncate">
                {user?.departmentName || "—"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {classes.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No classes assigned yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {classes.map((classItem) => (
            <Card key={classItem.id}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                        {classItem.name}
                      </h3>
                      <Badge variant="outline">{classItem.code}</Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Batch & Semester</p>
                        <p className="text-sm font-medium text-gray-900">
                          Batch {classItem.batch} | Semester {classItem.semester}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Badge className="text-base px-4 py-2 w-fit">
                    <Users className="w-4 h-4 mr-1" />
                    {studentCounts[classItem.id] ?? 0} Students
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href="/teacher/students">
                    <Button variant="outline">
                      View Students
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/teacher/attendance">
                    <Button variant="outline">Mark Attendance</Button>
                  </Link>
                  <Link href="/teacher/assignments">
                    <Button variant="outline">Assignments</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
