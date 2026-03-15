"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User, Clock, Award } from "lucide-react";
import { useAuthStore } from "@/lib/store";

interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  type: string;
  semester: number;
  batch: number;
}

export default function StudentAcademicsPage() {
  const { user } = useAuthStore();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.degreeId || !user?.branchId || user?.semester == null || user?.batch == null) {
      setLoading(false);
      return;
    }
    const params = new URLSearchParams({
      degreeId: user.degreeId,
      branchId: user.branchId,
      semester: String(user.semester),
      batch: String(user.batch),
    });
    fetch(`/api/subjects?${params}`)
      .then((res) => res.ok ? res.json() : [])
      .then(setSubjects)
      .catch(() => setSubjects([]))
      .finally(() => setLoading(false));
  }, [user?.degreeId, user?.branchId, user?.semester, user?.batch]);

  const theorySubjects = subjects.filter((s) => s.type?.toLowerCase() === "theory");
  const labSubjects = subjects.filter(
    (s) => s.type?.toLowerCase() === "practical" || s.type?.toLowerCase() === "project"
  );

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Academics</h1>
        <p className="text-gray-600">
          Current Semester {user?.semester ?? "-"} | {user?.degreeName ?? "-"} - {user?.branchName ?? "-"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Subjects</p>
                <p className="text-3xl font-bold text-gray-900">{subjects.length}</p>
              </div>
              <BookOpen className="w-12 h-12 text-sky-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Credits</p>
                <p className="text-3xl font-bold text-gray-900">
                  {subjects.reduce((sum, s) => sum + s.credits, 0)}
                </p>
              </div>
              <Award className="w-12 h-12 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Current Semester</p>
                <p className="text-3xl font-bold text-gray-900">Sem {user?.semester ?? "-"}</p>
              </div>
              <Clock className="w-12 h-12 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Theory Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          {theorySubjects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Code</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Subject Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Credits</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Room</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Schedule</th>
                  </tr>
                </thead>
                <tbody>
                  {theorySubjects.map((subject) => (
                    <tr key={subject.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Badge variant="outline">{subject.code}</Badge>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">{subject.name}</td>
                      <td className="py-3 px-4 text-gray-600">{subject.credits}</td>
                      <td className="py-3 px-4 text-gray-600">-</td>
                      <td className="py-3 px-4 text-gray-600">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No theory subjects</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lab/Practical Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          {labSubjects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Code</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Subject Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Credits</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Room</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Schedule</th>
                  </tr>
                </thead>
                <tbody>
                  {labSubjects.map((subject) => (
                    <tr key={subject.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Badge variant="outline">{subject.code}</Badge>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">{subject.name}</td>
                      <td className="py-3 px-4 text-gray-600">{subject.credits}</td>
                      <td className="py-3 px-4 text-gray-600">-</td>
                      <td className="py-3 px-4 text-gray-600">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No lab/practical subjects</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
