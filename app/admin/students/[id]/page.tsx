"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Mail, Phone, MapPin, User, Calendar } from "lucide-react";
import { demoStudents } from "@/lib/demo-data-v2";

export default function StudentDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const student = demoStudents.find((s) => s.id === id);

  if (!student) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Student not found</h2>
        <Link href="/admin/students">
          <Button className="mt-4">Back to Students</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/students">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Details</h1>
            <p className="text-gray-600 mt-1">Complete information about {student.name}</p>
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
                  {student.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <h2 className="text-2xl font-bold">{student.name}</h2>
                <p className="text-gray-600 mt-1">{student.rollNo}</p>
                <Badge variant={student.status === "active" ? "success" : "secondary"} className="mt-3">
                  {student.status}
                </Badge>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{student.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{student.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{student.address}</span>
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
                <span className="text-sm text-gray-600">Attendance</span>
                <span className="font-semibold">92.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">CGPA</span>
                <span className="font-semibold">8.7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Credits Earned</span>
                <span className="font-semibold">120/160</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Fee Status</span>
                <Badge variant="success">Paid</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Date of Birth</p>
                  <p className="font-medium mt-1">{student.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Admission Date</p>
                  <p className="font-medium mt-1">{student.admissionDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Guardian Name</p>
                  <p className="font-medium mt-1">{student.guardianName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Guardian Phone</p>
                  <p className="font-medium mt-1">{student.guardianPhone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Degree</p>
                  <p className="font-medium mt-1">{student.degreeName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Branch</p>
                  <p className="font-medium mt-1">{student.branchName}</p>
                  <p className="text-xs text-gray-500">({student.branchCode})</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Semester</p>
                  <p className="font-medium mt-1">Semester {student.semester}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Batch</p>
                  <p className="font-medium mt-1">{student.batch}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Roll Number</p>
                  <p className="font-medium mt-1">{student.rollNo}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enrolled Courses (Semester {student.semester})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Data Structures", "Database Systems", "Operating Systems", "Computer Networks", "Software Engineering"].map(
                  (course, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{course}</p>
                        <p className="text-sm text-gray-600">Credits: 4</p>
                      </div>
                      <Badge>Enrolled</Badge>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

