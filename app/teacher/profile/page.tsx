"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, GraduationCap, Award, Calendar } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { demoTeachers } from "@/lib/demo-data-v2";

export default function TeacherProfilePage() {
  const { user } = useAuthStore();
  const teacher = demoTeachers.find(t => t.id === user?.id);

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
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{teacher?.name}</h2>
              <p className="text-gray-600 mb-4">{teacher?.employeeId}</p>
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
                    <p className="text-sm font-medium text-gray-900">{teacher?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{teacher?.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="text-sm font-medium text-gray-900">{teacher?.departmentName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Designation</p>
                    <p className="text-sm font-medium text-gray-900">{teacher?.designation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Qualification</p>
                    <p className="text-sm font-medium text-gray-900">{teacher?.qualification}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Experience</p>
                    <p className="text-sm font-medium text-gray-900">{teacher?.experience} years</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

