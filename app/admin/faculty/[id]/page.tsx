"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Mail, Phone, Briefcase, Calendar, Award } from "lucide-react";
import { demoTeachers } from "@/lib/demo-data-v2";
import { formatCurrency } from "@/lib/utils";

export default function FacultyDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const teacher = demoTeachers.find((t) => t.id === id);

  if (!teacher) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Faculty member not found</h2>
        <Link href="/admin/faculty">
          <Button className="mt-4">Back to Faculty</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/faculty">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Faculty Details</h1>
            <p className="text-gray-600 mt-1">Complete information about {teacher.name}</p>
          </div>
        </div>
        <Button className="gap-2">
          <Edit className="w-4 h-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 bg-primary text-white rounded-full flex items-center justify-center text-4xl font-bold mb-4">
                  {teacher.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                </div>
                <h2 className="text-2xl font-bold">{teacher.name}</h2>
                <p className="text-gray-600 mt-1">{teacher.employeeId}</p>
                <Badge variant="outline" className="mt-2">{teacher.designation}</Badge>
                <Badge variant={teacher.status === "active" ? "success" : "secondary"} className="mt-2">
                  {teacher.status}
                </Badge>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{teacher.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{teacher.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{teacher.departmentName}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Experience</span>
                <span className="font-semibold">{teacher.experience} years</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Courses Teaching</span>
                <span className="font-semibold">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Students</span>
                <span className="font-semibold">230</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Salary</span>
                <span className="font-semibold">{formatCurrency(teacher.salary)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Employee ID</p>
                  <p className="font-medium mt-1">{teacher.employeeId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Designation</p>
                  <p className="font-medium mt-1">{teacher.designation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-medium mt-1">{teacher.departmentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Joining Date</p>
                  <p className="font-medium mt-1">{teacher.joiningDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Qualification</p>
                  <p className="font-medium mt-1">{teacher.qualification}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Experience</p>
                  <p className="font-medium mt-1">{teacher.experience} years</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Teaching Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Data Structures and Algorithms", "Database Management Systems", "Operating Systems", "Computer Networks", "Software Engineering"].map(
                  (course, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{course}</p>
                        <p className="text-sm text-gray-600">Semester {3 + (index % 3)} • 45 Students</p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timetable</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { day: "Monday", time: "9:00 AM - 10:30 AM", subject: "Data Structures" },
                  { day: "Tuesday", time: "11:00 AM - 12:30 PM", subject: "DBMS" },
                  { day: "Wednesday", time: "2:00 PM - 3:30 PM", subject: "Operating Systems" },
                  { day: "Thursday", time: "9:00 AM - 10:30 AM", subject: "Computer Networks" },
                  { day: "Friday", time: "11:00 AM - 12:30 PM", subject: "Software Engineering" },
                ].map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{schedule.day}</p>
                      <p className="text-sm text-gray-600">{schedule.subject}</p>
                    </div>
                    <p className="text-sm text-gray-600">{schedule.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

