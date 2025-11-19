"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Calendar, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { demoTeachers } from "@/lib/demo-data-v2";
import Link from "next/link";

export default function TeacherMyClassesPage() {
  const { user } = useAuthStore();
  const teacher = demoTeachers.find(t => t.id === user?.id);

  // Mock classes data
  const classes = [
    {
      id: "1",
      subject: "Database Management Systems",
      code: "CS601",
      degree: "B.Tech",
      branch: "Computer Science & Engineering",
      semester: 6,
      batch: 2021,
      students: 45,
      schedule: "Mon, Wed, Fri - 9:00 AM",
      room: "LT-101",
    },
    {
      id: "2",
      subject: "Database Management Systems",
      code: "CS401",
      degree: "B.Tech",
      branch: "Computer Science & Engineering",
      semester: 4,
      batch: 2022,
      students: 48,
      schedule: "Mon, Wed, Fri - 11:00 AM",
      room: "LT-102",
    },
    {
      id: "3",
      subject: "Operating Systems",
      code: "CS402",
      degree: "B.Tech",
      branch: "Computer Science & Engineering",
      semester: 4,
      batch: 2022,
      students: 45,
      schedule: "Tue, Thu - 11:00 AM",
      room: "LT-102",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Classes</h1>
        <p className="text-gray-600">Manage your assigned subjects and classes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Classes</p>
              <p className="text-3xl font-bold text-gray-900">{classes.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">
                {classes.reduce((sum, c) => sum + c.students, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Department</p>
              <p className="text-lg font-bold text-gray-900">{teacher?.departmentName}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {classes.map((classItem) => (
          <Card key={classItem.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{classItem.subject}</h3>
                    <Badge variant="outline">{classItem.code}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Program</p>
                      <p className="text-sm font-medium text-gray-900">
                        {classItem.degree} - {classItem.branch}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Batch & Semester</p>
                      <p className="text-sm font-medium text-gray-900">
                        Batch {classItem.batch} | Semester {classItem.semester}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Schedule</p>
                      <p className="text-sm font-medium text-gray-900">{classItem.schedule}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Room</p>
                      <p className="text-sm font-medium text-gray-900">{classItem.room}</p>
                    </div>
                  </div>
                </div>
                <Badge className="text-lg px-4 py-2">
                  <Users className="w-4 h-4 mr-1" />
                  {classItem.students} Students
                </Badge>
              </div>
              <div className="flex gap-2">
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
    </div>
  );
}

