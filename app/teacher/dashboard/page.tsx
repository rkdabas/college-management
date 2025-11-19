"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Users, 
  ClipboardList, 
  FileText,
  Award,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { demoTeachers } from "@/lib/demo-data-v2";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function TeacherDashboardPage() {
  const { user } = useAuthStore();
  const teacher = demoTeachers.find(t => t.id === user?.id);

  // Mock data
  const totalClasses = 4;
  const totalStudents = 180;
  const pendingAttendance = 3;
  const pendingGrading = 25;
  const averageAttendance = 85;

  // Today's classes
  const todayClasses = [
    { time: "09:00 AM", subject: "Database Management Systems", batch: "2021", semester: 6, room: "LT-101", students: 45 },
    { time: "11:00 AM", subject: "Database Management Systems", batch: "2022", semester: 4, room: "LT-102", students: 48 },
    { time: "02:00 PM", subject: "Operating Systems", batch: "2021", semester: 6, room: "Lab-3", students: 45 },
  ];

  // Class-wise attendance
  const classAttendance = [
    { class: "DBMS - Sem 6", attendance: 88, total: 45, present: 40 },
    { class: "DBMS - Sem 4", attendance: 85, total: 48, present: 41 },
    { class: "OS - Sem 6", attendance: 82, total: 45, present: 37 },
  ];

  // Pending tasks
  const pendingTasks = [
    { id: 1, type: "attendance", message: "Mark attendance for DBMS - Sem 6", time: "Today 9:00 AM", priority: "high" },
    { id: 2, type: "grading", message: "Grade 25 assignments for OS - Sem 6", time: "Due in 2 days", priority: "medium" },
    { id: 3, type: "attendance", message: "Mark attendance for DBMS - Sem 4", time: "Today 11:00 AM", priority: "high" },
  ];

  // Recent activities
  const recentActivities = [
    { id: 1, type: "attendance", message: "Marked attendance for AI/ML class", time: "2 hours ago", icon: CheckCircle, color: "text-emerald-600" },
    { id: 2, type: "grading", message: "Graded 30 assignments for Database Systems", time: "1 day ago", icon: Award, color: "text-sky-600" },
    { id: 3, type: "assignment", message: "Created new assignment for Operating Systems", time: "2 days ago", icon: FileText, color: "text-amber-600" },
  ];

  // Attendance distribution
  const attendanceDistribution = [
    { name: "Present", value: 85, color: "#0ea5e9" },
    { name: "Absent", value: 10, color: "#ef4444" },
    { name: "Leave", value: 5, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {teacher?.name}!</h1>
        <p className="text-gray-600">
          {teacher?.departmentName} | {teacher?.designation}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Classes</p>
                <p className="text-3xl font-bold text-gray-900">{totalClasses}</p>
                <p className="text-xs text-gray-500 mt-1">Active subjects</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-sky-600 to-sky-700 rounded-xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
                <p className="text-xs text-gray-500 mt-1">Across all classes</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Attendance</p>
                <p className="text-3xl font-bold text-gray-900">{pendingAttendance}</p>
                <p className="text-xs text-gray-500 mt-1">Classes today</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center">
                <ClipboardList className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Grading</p>
                <p className="text-3xl font-bold text-gray-900">{pendingGrading}</p>
                <p className="text-xs text-gray-500 mt-1">Assignments</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Classes */}
        <Card className="lg:col-span-2">
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
                    <Badge variant="outline">{classItem.students} students</Badge>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{classItem.subject}</h4>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>Batch {classItem.batch}</span>
                    <span>Semester {classItem.semester}</span>
                    <span>{classItem.room}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link href="/teacher/attendance">
                      <Button size="sm" variant="outline">
                        Mark Attendance
                      </Button>
                    </Link>
                    <Link href="/teacher/students">
                      <Button size="sm" variant="outline">
                        View Students
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
              <Link href="/teacher/timetable">
                <Button variant="outline" className="w-full">
                  View Full Timetable
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={attendanceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attendanceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Average Attendance</span>
                <span className="font-semibold text-gray-900">{averageAttendance}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div key={task.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {task.type === "attendance" && <ClipboardList className="w-4 h-4 text-amber-600" />}
                      {task.type === "grading" && <FileText className="w-4 h-4 text-sky-600" />}
                      <span className="text-sm font-semibold text-gray-900">{task.message}</span>
                    </div>
                    <Badge 
                      variant={task.priority === "high" ? "destructive" : "outline"}
                      className="text-xs"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">{task.time}</p>
                  <div className="mt-3">
                    {task.type === "attendance" && (
                      <Link href="/teacher/attendance">
                        <Button size="sm" variant="outline">Mark Now</Button>
                      </Link>
                    )}
                    {task.type === "grading" && (
                      <Link href="/teacher/grading">
                        <Button size="sm" variant="outline">Grade Now</Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
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

      {/* Class-wise Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Class-wise Attendance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {classAttendance.map((classItem, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{classItem.class}</h4>
                  <Badge variant="success" className="text-xs">
                    {classItem.attendance}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Present: {classItem.present}/{classItem.total}</span>
                  <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-600"
                      style={{ width: `${classItem.attendance}%` }}
                    />
                  </div>
                </div>
                <Link href="/teacher/attendance">
                  <Button size="sm" variant="outline" className="mt-2">
                    View Details
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

