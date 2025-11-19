"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, BookOpen } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { demoStudents } from "@/lib/demo-data-v2";

export default function StudentProfilePage() {
  const { user } = useAuthStore();
  const student = demoStudents.find(s => s.id === user?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">View and manage your profile information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-sky-600 to-sky-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{student?.name}</h2>
              <p className="text-gray-600 mb-4">{student?.rollNo}</p>
              <Button variant="outline" className="w-full">Edit Profile</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{student?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{student?.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    <p className="text-sm font-medium text-gray-900">
                      {student?.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm font-medium text-gray-900">{student?.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Academic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Degree</p>
                <p className="text-sm font-medium text-gray-900">{student?.degreeName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Branch</p>
                <p className="text-sm font-medium text-gray-900">{student?.branchName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Semester</p>
                <p className="text-sm font-medium text-gray-900">Semester {student?.semester}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Batch</p>
                <p className="text-sm font-medium text-gray-900">{student?.batch}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

