"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  GraduationCap, 
  BookOpen,
  Calendar,
  TrendingUp,
  AlertCircle,
  Clock,
  Bell,
  CheckCircle,
  XCircle,
  Library,
  UserPlus,
  ArrowRight,
} from "lucide-react";
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
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { getDegreeWiseStudentCount, getBranchWiseStudentCount, demoStudents, demoTeachers, demoEvents } from "@/lib/demo-data-v2";
import { degrees, branches } from "@/lib/academic-structure-v2";
import Link from "next/link";

// Mock data for attendance trends (last 7 days)
const attendanceTrends = [
  { day: "Mon", attendance: 92.5, present: 2631, total: 2847 },
  { day: "Tue", attendance: 94.2, present: 2681, total: 2847 },
  { day: "Wed", attendance: 91.8, present: 2614, total: 2847 },
  { day: "Thu", attendance: 93.5, present: 2662, total: 2847 },
  { day: "Fri", attendance: 89.6, present: 2551, total: 2847 },
  { day: "Sat", attendance: 95.1, present: 2707, total: 2847 },
  { day: "Today", attendance: 93.2, present: 2654, total: 2847 },
];

// Mock data for monthly enrollment trends
const enrollmentTrends = [
  { month: "Jan", students: 2650 },
  { month: "Feb", students: 2680 },
  { month: "Mar", students: 2720 },
  { month: "Apr", students: 2750 },
  { month: "May", students: 2780 },
  { month: "Jun", students: 2810 },
  { month: "Jul", students: 2847 },
];

// Mock data for department-wise faculty distribution
const facultyDistribution = [
  { department: "CSE", faculty: 45 },
  { department: "ECE", faculty: 28 },
  { department: "ME", faculty: 32 },
  { department: "CE", faculty: 22 },
  { department: "EE", faculty: 26 },
  { department: "IT", faculty: 34 },
];

// Colors for charts
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// Get data
const degreeData = getDegreeWiseStudentCount();
const branchData = getBranchWiseStudentCount();
const totalStudents = demoStudents.length;
const totalTeachers = demoTeachers.length;
const activeDegrees = degrees.length;
const totalBranches = branches.length;

// Calculate attendance stats (mock data)
const todayAttendance = 93.2;
const presentToday = 2654;
const absentToday = 152;
const onLeaveToday = 41;

// Upcoming events
const upcomingEvents = demoEvents
  .filter(e => e.status === "upcoming" || e.status === "ongoing")
  .slice(0, 3);

// Recent activities (mock)
const recentActivities = [
  { id: 1, type: "enrollment", message: "5 new students enrolled in B.Tech CSE", time: "2 hours ago", icon: UserPlus, color: "text-blue-600", bg: "bg-blue-50" },
  { id: 2, type: "event", message: "Annual Tech Fest 2025 registration opened", time: "3 hours ago", icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
  { id: 3, type: "announcement", message: "Mid-term examination schedule released", time: "5 hours ago", icon: Bell, color: "text-orange-600", bg: "bg-orange-50" },
  { id: 4, type: "library", message: "45 new books added to library", time: "1 day ago", icon: Library, color: "text-green-600", bg: "bg-green-50" },
];

// Low attendance alerts (mock)
const lowAttendanceAlerts = [
  { student: "Rahul Sharma", rollNo: "21CSE001", attendance: 68.5, branch: "CSE" },
  { student: "Priya Verma", rollNo: "21CSE002", attendance: 72.3, branch: "CSE" },
  { student: "Amit Kumar", rollNo: "22ME001", attendance: 70.1, branch: "ME" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your institutional overview.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-sm py-1 px-3">
            <Clock className="w-3 h-3 mr-1" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Badge>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-bold mt-2">{totalStudents.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">+12.5%</span>
                  <span className="text-sm text-gray-500">vs last year</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Faculty</p>
                <p className="text-3xl font-bold mt-2">{totalTeachers}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">+3.2%</span>
                  <span className="text-sm text-gray-500">vs last year</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Attendance</p>
                <p className="text-3xl font-bold mt-2">{todayAttendance}%</p>
                <div className="flex items-center gap-1 mt-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">{presentToday} present</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Programs</p>
                <p className="text-3xl font-bold mt-2">{activeDegrees}</p>
                <div className="flex items-center gap-1 mt-2">
                  <BookOpen className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-gray-600">{totalBranches} branches</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Summary & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={attendanceTrends}>
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[85, 100]} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 rounded-lg shadow-lg border">
                          <p className="font-semibold">{payload[0].payload.day}</p>
                          <p className="text-sm text-blue-600">Attendance: {payload[0].value}%</p>
                          <p className="text-xs text-gray-600">
                            {payload[0].payload.present} / {payload[0].payload.total} students
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorAttendance)" 
                />
              </AreaChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">{presentToday}</span>
                </div>
                <p className="text-xs text-gray-600">Present</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-2xl font-bold text-red-600">{absentToday}</span>
                </div>
                <p className="text-xs text-gray-600">Absent</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-2xl font-bold text-orange-600">{onLeaveToday}</span>
                </div>
                <p className="text-xs text-gray-600">On Leave</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Low Attendance Alerts</CardTitle>
              <Badge variant="destructive">{lowAttendanceAlerts.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowAttendanceAlerts.map((alert) => (
                <div key={alert.rollNo} className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{alert.student}</p>
                      <p className="text-xs text-gray-600">{alert.rollNo} • {alert.branch}</p>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      {alert.attendance}%
                    </Badge>
                  </div>
                </div>
              ))}
              <Link href="/admin/attendance">
                <Button variant="outline" size="sm" className="w-full mt-2">
                  View All Attendance
                  <ArrowRight className="w-3 h-3 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Student Enrollment Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={enrollmentTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="students" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department-wise Faculty */}
        <Card>
          <CardHeader>
            <CardTitle>Department-wise Faculty Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={facultyDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="faculty" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Degree-wise Students */}
        <Card>
          <CardHeader>
            <CardTitle>Degree-wise Student Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={degreeData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, students }) => `${name}: ${students}`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="students"
                >
                  {degreeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Branch-wise Students */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Branches by Enrollment</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={branchData.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={150}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="students" fill="#f59e0b" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Events</CardTitle>
              <Link href="/admin/events">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-3 h-3 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No upcoming events</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm">{event.title}</h4>
                      <Badge variant={event.status === "ongoing" ? "success" : "default"}>
                        {event.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(event.startDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {event.participants}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`w-10 h-10 ${activity.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/students/add">
              <Button variant="outline" className="w-full h-24 flex-col gap-2">
                <UserPlus className="w-6 h-6" />
                <span className="text-sm">Add Student</span>
              </Button>
            </Link>
            <Link href="/admin/attendance">
              <Button variant="outline" className="w-full h-24 flex-col gap-2">
                <CheckCircle className="w-6 h-6" />
                <span className="text-sm">Mark Attendance</span>
              </Button>
            </Link>
            <Link href="/admin/events/add">
              <Button variant="outline" className="w-full h-24 flex-col gap-2">
                <Calendar className="w-6 h-6" />
                <span className="text-sm">Create Event</span>
              </Button>
            </Link>
            <Link href="/admin/announcements">
              <Button variant="outline" className="w-full h-24 flex-col gap-2">
                <Bell className="w-6 h-6" />
                <span className="text-sm">New Announcement</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
