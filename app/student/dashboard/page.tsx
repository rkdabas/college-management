"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ClipboardList,
  Award,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardData {
  attendanceStats: {
    overallPercentage: number;
    totalPresent: number;
    totalCount: number;
    perSubject: { subjectName: string; subjectCode: string; presentCount: number; totalCount: number; percentage: number }[];
  };
  todayClasses: {
    subject: { id: string; name: string; code: string };
    startTime: string;
    endTime: string;
    room: string;
  }[];
  pendingAssignmentsCount: number;
  recentGrades: { subject: { id: string; name: string; code: string }; type: string; grade: string; marks: number; totalMarks: number }[];
  upcomingEvents: { id: string; title: string; type: string; startDate: string; endDate: string; venue: string; registrationCount: number }[];
}

export default function StudentDashboardPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/dashboard/student?studentId=${user.id}`)
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const attendanceStats = data?.attendanceStats;
  const todayClasses = data?.todayClasses ?? [];
  const subjectAttendance = attendanceStats?.perSubject ?? [];
  const pendingAssignments = data?.pendingAssignmentsCount ?? 0;
  const enrolledSubjects = subjectAttendance.length;
  const overallAttendance = attendanceStats?.overallPercentage ?? 0;

  const attendanceChartData = subjectAttendance.length > 0
    ? subjectAttendance.map((s) => ({ name: s.subjectCode, attendance: s.percentage }))
    : [{ name: "-", attendance: 0 }];

  const recentActivities: { id: string; type: string; message: string; time: string; icon: typeof FileText; color: string }[] = [];
  data?.recentGrades?.slice(0, 2).forEach((g) => {
    recentActivities.push({
      id: `grade-${g.subject.id}`,
      type: "grade",
      message: `New grade posted for ${g.subject.name}`,
      time: "Recently",
      icon: Award,
      color: "text-emerald-600",
    });
  });
  data?.upcomingEvents?.slice(0, 2).forEach((e) => {
    recentActivities.push({
      id: `event-${e.id}`,
      type: "event",
      message: `Upcoming: ${e.title}`,
      time: new Date(e.startDate).toLocaleDateString(),
      icon: Calendar,
      color: "text-amber-600",
    });
  });
  if (recentActivities.length === 0) {
    recentActivities.push({
      id: "empty",
      type: "info",
      message: "No recent activities",
      time: "-",
      icon: CheckCircle,
      color: "text-gray-600",
    });
  }

  const todayClassesFormatted = todayClasses.map((c) => ({
    time: `${c.startTime ?? "09:00"} - ${c.endTime ?? "10:00"}`,
    subject: c.subject?.name ?? "Subject",
    room: c.room ?? "-",
    teacher: "-",
  }));

  const lowAttendanceSubjects = subjectAttendance.filter((s) => s.percentage < 75);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">
          {user?.degreeName} - {user?.branchName} | Semester {user?.semester ?? "-"} | Batch {user?.batch ?? "-"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Upcoming Events</p>
                <p className="text-3xl font-bold text-gray-900">{data?.upcomingEvents?.length ?? 0}</p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={attendanceChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
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

        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayClassesFormatted.length > 0 ? (
                todayClassesFormatted.map((classItem, index) => (
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
                ))
              ) : (
                <p className="text-sm text-gray-500">No classes today</p>
              )}
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
        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectAttendance.length > 0 ? (
                subjectAttendance.map((subject, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{subject.subjectName}</h4>
                      <Badge
                        variant={subject.percentage >= 75 ? "success" : "destructive"}
                        className="text-xs"
                      >
                        {subject.percentage}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Present: {subject.presentCount}/{subject.totalCount}</span>
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${subject.percentage >= 75 ? "bg-emerald-600" : "bg-red-600"}`}
                          style={{ width: `${subject.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No attendance data</p>
              )}
              <Link href="/student/attendance">
                <Button variant="outline" className="w-full">
                  View Detailed Attendance
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
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
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200"
                >
                  <span className="font-medium text-gray-900">{subject.subjectName}</span>
                  <Badge variant="destructive">{subject.percentage}%</Badge>
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
