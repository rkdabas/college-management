"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  ClipboardList, 
  Award, 
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { demoStudents } from "@/lib/demo-data-v2";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

export default function StudentDashboardPage() {
  const { user } = useAuthStore();
  const student = demoStudents.find(s => s.id === user?.id);

  // Mock data
  const overallAttendance = 82;
  const cgpa = 8.4;
  const currentSemester = student?.semester || 6;
  const enrolledSubjects = 6;
  const pendingAssignments = 3;
  const upcomingExams = 2;

  // Attendance trend (last 7 days)
  const attendanceTrend = [
    { day: "Mon", attendance: 85 },
    { day: "Tue", attendance: 90 },
    { day: "Wed", attendance: 80 },
    { day: "Thu", attendance: 88 },
    { day: "Fri", attendance: 75 },
    { day: "Sat", attendance: 0 },
    { day: "Sun", attendance: 0 },
  ];

  // Subject-wise attendance
  const subjectAttendance = [
    { subject: "DBMS", attendance: 88, total: 45, present: 40 },
    { subject: "OS", attendance: 82, total: 45, present: 37 },
    { subject: "AI/ML", attendance: 85, total: 45, present: 38 },
    { subject: "SE", attendance: 75, total: 45, present: 34 },
    { subject: "Web Dev", attendance: 90, total: 45, present: 41 },
    { subject: "Project", attendance: 95, total: 45, present: 43 },
  ];

  // Recent activities
  const recentActivities = [
    { id: 1, type: "assignment", message: "Submitted assignment for AI/ML", time: "2 hours ago", icon: FileText, color: "text-sky-600" },
    { id: 2, type: "grade", message: "New grade posted for Database Systems", time: "1 day ago", icon: Award, color: "text-emerald-600" },
    { id: 3, type: "event", message: "Registered for Tech Fest 2025", time: "2 days ago", icon: Calendar, color: "text-amber-600" },
    { id: 4, type: "attendance", message: "Attendance marked for Operating Systems", time: "3 days ago", icon: CheckCircle, color: "text-gray-600" },
  ];

  // Upcoming classes (today)
  const todayClasses = [
    { time: "09:00 AM", subject: "Database Management Systems", room: "LT-101", teacher: "Dr. Rajesh Kumar" },
    { time: "11:00 AM", subject: "Operating Systems", room: "LT-102", teacher: "Dr. Sunita Sharma" },
    { time: "02:00 PM", subject: "AI/ML", room: "Lab-3", teacher: "Dr. Priya Malhotra" },
  ];

  // Low attendance alerts
  const lowAttendanceSubjects = subjectAttendance.filter(s => s.attendance < 75);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {student?.name}!</h1>
        <p className="text-gray-600">
          {student?.degreeName} - {student?.branchName} | Semester {currentSemester} | Batch {student?.batch}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Overall Attendance</p>
                <p className="text-3xl font-bold text-gray-900">{overallAttendance}%</p>
                <p className="text-xs text-gray-500 mt-1">Above 75% requirement</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-sky-600 to-sky-700 rounded-xl flex items-center justify-center">
                <ClipboardList className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Current CGPA</p>
                <p className="text-3xl font-bold text-gray-900">{cgpa}</p>
                <p className="text-xs text-gray-500 mt-1">Out of 10.0</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
                <Award className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Enrolled Subjects</p>
                <p className="text-3xl font-bold text-gray-900">{enrolledSubjects}</p>
                <p className="text-xs text-gray-500 mt-1">Current semester</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Assignments</p>
                <p className="text-3xl font-bold text-gray-900">{pendingAssignments}</p>
                <p className="text-xs text-gray-500 mt-1">Due soon</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#0ea5e9" 
                  fill="#0ea5e9" 
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Today's Classes */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayClasses.map((classItem, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-semibold text-gray-900">{classItem.time}</span>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{classItem.subject}</h4>
                  <p className="text-xs text-gray-600">{classItem.room}</p>
                  <p className="text-xs text-gray-500 mt-1">{classItem.teacher}</p>
                </div>
              ))}
              <Link href="/student/timetable">
                <Button variant="outline" className="w-full">
                  View Full Timetable
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject-wise Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectAttendance.map((subject, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{subject.subject}</h4>
                    <Badge 
                      variant={subject.attendance >= 75 ? "success" : "destructive"}
                      className="text-xs"
                    >
                      {subject.attendance}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Present: {subject.present}/{subject.total}</span>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${subject.attendance >= 75 ? 'bg-emerald-600' : 'bg-red-600'}`}
                        style={{ width: `${subject.attendance}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/student/attendance">
                <Button variant="outline" className="w-full">
                  View Detailed Attendance
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className={`w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {lowAttendanceSubjects.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <CardTitle className="text-red-900">Low Attendance Alert</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-800 mb-3">
              You have {lowAttendanceSubjects.length} subject(s) with attendance below 75%:
            </p>
            <div className="space-y-2">
              {lowAttendanceSubjects.map((subject, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                  <span className="font-medium text-gray-900">{subject.subject}</span>
                  <Badge variant="destructive">{subject.attendance}%</Badge>
                </div>
              ))}
            </div>
            <Link href="/student/attendance" className="mt-4 inline-block">
              <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                View Attendance Details
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

