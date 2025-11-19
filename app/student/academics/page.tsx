"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User, Clock, Award } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { demoStudents } from "@/lib/demo-data-v2";

export default function StudentAcademicsPage() {
  const { user } = useAuthStore();
  const student = demoStudents.find(s => s.id === user?.id);

  // Mock subjects data
  const subjects = [
    {
      id: "1",
      code: "CS601",
      name: "Database Management Systems",
      credits: 4,
      type: "Theory",
      teacher: "Dr. Rajesh Kumar",
      room: "LT-101",
      schedule: "Mon, Wed, Fri - 9:00 AM",
    },
    {
      id: "2",
      code: "CS602",
      name: "Operating Systems",
      credits: 4,
      type: "Theory",
      teacher: "Dr. Sunita Sharma",
      room: "LT-102",
      schedule: "Tue, Thu - 11:00 AM",
    },
    {
      id: "3",
      code: "CS603",
      name: "Artificial Intelligence & Machine Learning",
      credits: 3,
      type: "Theory",
      teacher: "Dr. Priya Malhotra",
      room: "Lab-3",
      schedule: "Mon, Wed - 2:00 PM",
    },
    {
      id: "4",
      code: "CS604",
      name: "Software Engineering",
      credits: 3,
      type: "Theory",
      teacher: "Prof. Amit Gupta",
      room: "LT-103",
      schedule: "Tue, Thu - 9:00 AM",
    },
    {
      id: "5",
      code: "CS605",
      name: "Web Development",
      credits: 3,
      type: "Practical",
      teacher: "Dr. Anjali Mehta",
      room: "Lab-1",
      schedule: "Fri - 2:00 PM",
    },
    {
      id: "6",
      code: "CS606",
      name: "Project Work",
      credits: 6,
      type: "Project",
      teacher: "Dr. Rajesh Kumar",
      room: "Project Lab",
      schedule: "As per guide",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Academics</h1>
        <p className="text-gray-600">
          Current Semester {student?.semester} | {student?.degreeName} - {student?.branchName}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <p className="text-3xl font-bold text-gray-900">Sem {student?.semester}</p>
              </div>
              <Clock className="w-12 h-12 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Theory Subjects */}
      <Card>
        <CardHeader>
          <CardTitle>Theory Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Code</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Subject Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Credits</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Teacher</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Room</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Schedule</th>
                </tr>
              </thead>
              <tbody>
                {subjects.filter(s => s.type === "Theory").map((subject) => (
                  <tr key={subject.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Badge variant="outline">{subject.code}</Badge>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{subject.name}</td>
                    <td className="py-3 px-4 text-gray-600">{subject.credits}</td>
                    <td className="py-3 px-4 text-gray-600">{subject.teacher}</td>
                    <td className="py-3 px-4 text-gray-600">{subject.room}</td>
                    <td className="py-3 px-4 text-gray-600">{subject.schedule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Lab/Practical Subjects */}
      <Card>
        <CardHeader>
          <CardTitle>Lab/Practical Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Code</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Subject Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Credits</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Teacher</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Room</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Schedule</th>
                </tr>
              </thead>
              <tbody>
                {subjects.filter(s => s.type === "Practical" || s.type === "Project").map((subject) => (
                  <tr key={subject.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Badge variant="outline">{subject.code}</Badge>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{subject.name}</td>
                    <td className="py-3 px-4 text-gray-600">{subject.credits}</td>
                    <td className="py-3 px-4 text-gray-600">{subject.teacher}</td>
                    <td className="py-3 px-4 text-gray-600">{subject.room}</td>
                    <td className="py-3 px-4 text-gray-600">{subject.schedule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

