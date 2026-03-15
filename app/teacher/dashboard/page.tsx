"use client";

import { useState, useEffect } from "react";
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
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import Link from "next/link";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

interface DashboardData {
  totalClasses: number;
  totalStudents: number;
  pendingGradingCount: number;
  todayClasses: Array<{
    subject: { id: string; name: string; code: string };
    startTime: string;
    endTime: string;
    room: string;
  }>;
  recentActivities: Array<{
    id: string;
    activityName: string;
    activityType: string;
    date: string;
    achievement: string;
    status: string;
    student: { id: string; name: string; rollNo: string };
  }>;
}

export default function TeacherDashboardPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/dashboard/teacher?teacherId=${user.id}`)
      .then((res) => res.json())
      .then((json) => {
        if (!json.error) setData(json);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  const totalClasses = data?.totalClasses ?? 0;
  const totalStudents = data?.totalStudents ?? 0;
  const pendingAttendance = data?.todayClasses?.length ?? 0;
  const pendingGrading = data?.pendingGradingCount ?? 0;
  const averageAttendance = 85;

  const todayClasses = (data?.todayClasses ?? []).map((c) => ({
    time: `${c.startTime} - ${c.endTime}`,
    subject: c.subject.name,
    room: c.room,
    batch: "",
    semester: "",
    students: 0,
  }));

  const classAttendance = (data?.todayClasses ?? []).map((c) => ({
    class: `${c.subject.name}`,
    attendance: 85,
    total: 45,
    present: 38,
  }));

  const pendingTasks = [
    ...(pendingAttendance > 0
      ? [
          {
            id: 1,
            type: "attendance" as const,
            message: "Mark attendance for today's classes",
            time: "Today",
            priority: "high" as const,
          },
        ]
      : []),
    ...(pendingGrading > 0
      ? [
          {
            id: 2,
            type: "grading" as const,
            message: `Grade ${pendingGrading} assignments`,
            time: "Due soon",
            priority: "medium" as const,
          },
        ]
      : []),
  ];

  const recentActivities = (data?.recentActivities ?? []).slice(0, 3).map((a, i) => ({
    id: a.id,
    type: "activity" as const,
    message: `${a.activityName} - ${a.student?.name || ""}`,
    time: new Date(a.date).toLocaleDateString(),
    icon: Award,
    color: "text-sky-600",
  }));

  const attendanceDistribution = [
    { name: "Present", value: 85, color: "#0ea5e9" },
    { name: "Absent", value: 10, color: "#ef4444" },
    { name: "Leave", value: 5, color: "#f59e0b" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Welcome, {user?.name || "Teacher"}!
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          {user?.departmentName || "Department"} | {user?.designation || "Teacher"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Classes</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalClasses}</p>
                <p className="text-xs text-gray-500 mt-1">Active subjects</p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-sky-600 to-sky-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Students</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalStudents}</p>
                <p className="text-xs text-gray-500 mt-1">Across all classes</p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Attendance</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{pendingAttendance}</p>
                <p className="text-xs text-gray-500 mt-1">Classes today</p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <ClipboardList className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Grading</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{pendingGrading}</p>
                <p className="text-xs text-gray-500 mt-1">Assignments</p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Today&apos;s Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayClasses.length > 0 ? (
                todayClasses.map((classItem, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-semibold text-gray-900">
                          {classItem.time}
                        </span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{classItem.subject}</h4>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>{classItem.room}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
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
                ))
              ) : (
                <p className="text-gray-500 py-4">No classes scheduled for today</p>
              )}
              <Link href="/teacher/timetable">
                <Button variant="outline" className="w-full">
                  View Full Timetable
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

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
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
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
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTasks.length > 0 ? (
                pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {task.type === "attendance" && (
                          <ClipboardList className="w-4 h-4 text-amber-600" />
                        )}
                        {task.type === "grading" && (
                          <FileText className="w-4 h-4 text-sky-600" />
                        )}
                        <span className="text-sm font-semibold text-gray-900">
                          {task.message}
                        </span>
                      </div>
                      <Badge
                        variant={
                          task.priority === "high" ? "destructive" : "outline"
                        }
                        className="text-xs"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{task.time}</p>
                    <div className="mt-3">
                      {task.type === "attendance" && (
                        <Link href="/teacher/attendance">
                          <Button size="sm" variant="outline">
                            Mark Now
                          </Button>
                        </Link>
                      )}
                      {task.type === "grading" && (
                        <Link href="/teacher/grading">
                          <Button size="sm" variant="outline">
                            Grade Now
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 py-4">No pending tasks</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 font-medium truncate">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 py-4">No recent activities</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {classAttendance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Class-wise Attendance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classAttendance.map((classItem, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{classItem.class}</h4>
                    <Badge variant="outline" className="text-xs">
                      {classItem.attendance}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>
                      Present: {classItem.present}/{classItem.total}
                    </span>
                    <div className="w-24 sm:w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
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
      )}
    </div>
  );
}
