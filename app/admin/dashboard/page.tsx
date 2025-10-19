"use client";

import { useState } from "react";
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

// Mock data for attendance trends (last 7 days) - Degree wise
const attendanceTrendsByDegree: Record<string, any[]> = {
  "all": [
    { day: "Mon", attendance: 92.5, present: 2631, total: 2847 },
    { day: "Tue", attendance: 94.2, present: 2681, total: 2847 },
    { day: "Wed", attendance: 91.8, present: 2614, total: 2847 },
    { day: "Thu", attendance: 93.5, present: 2662, total: 2847 },
    { day: "Fri", attendance: 89.6, present: 2551, total: 2847 },
    { day: "Sat", attendance: 95.1, present: 2707, total: 2847 },
    { day: "Today", attendance: 93.2, present: 2654, total: 2847 },
  ],
  "btech": [
    { day: "Mon", attendance: 93.8, present: 1876, total: 2000 },
    { day: "Tue", attendance: 95.2, present: 1904, total: 2000 },
    { day: "Wed", attendance: 92.4, present: 1848, total: 2000 },
    { day: "Thu", attendance: 94.1, present: 1882, total: 2000 },
    { day: "Fri", attendance: 90.3, present: 1806, total: 2000 },
    { day: "Sat", attendance: 96.0, present: 1920, total: 2000 },
    { day: "Today", attendance: 94.5, present: 1890, total: 2000 },
  ],
  "mba": [
    { day: "Mon", attendance: 89.5, present: 358, total: 400 },
    { day: "Tue", attendance: 91.8, present: 367, total: 400 },
    { day: "Wed", attendance: 88.2, present: 353, total: 400 },
    { day: "Thu", attendance: 90.5, present: 362, total: 400 },
    { day: "Fri", attendance: 86.0, present: 344, total: 400 },
    { day: "Sat", attendance: 92.5, present: 370, total: 400 },
    { day: "Today", attendance: 89.8, present: 359, total: 400 },
  ],
  "mtech": [
    { day: "Mon", attendance: 91.2, present: 274, total: 300 },
    { day: "Tue", attendance: 93.0, present: 279, total: 300 },
    { day: "Wed", attendance: 90.0, present: 270, total: 300 },
    { day: "Thu", attendance: 92.3, present: 277, total: 300 },
    { day: "Fri", attendance: 88.7, present: 266, total: 300 },
    { day: "Sat", attendance: 94.3, present: 283, total: 300 },
    { day: "Today", attendance: 91.7, present: 275, total: 300 },
  ],
  "bca": [
    { day: "Mon", attendance: 90.0, present: 123, total: 147 },
    { day: "Tue", attendance: 92.5, present: 131, total: 147 },
    { day: "Wed", attendance: 89.8, present: 143, total: 147 },
    { day: "Thu", attendance: 91.2, present: 141, total: 147 },
    { day: "Fri", attendance: 87.8, present: 135, total: 147 },
    { day: "Sat", attendance: 93.2, present: 134, total: 147 },
    { day: "Today", attendance: 90.5, present: 130, total: 147 },
  ],
};

// Mock data for yearly enrollment trends - Degree wise
const enrollmentTrendsByDegree: Record<string, any[]> = {
  "all": [
    { year: "2019", students: 2450 },
    { year: "2020", students: 2580 },
    { year: "2021", students: 2650 },
    { year: "2022", students: 2720 },
    { year: "2023", students: 2780 },
    { year: "2024", students: 2847 },
  ],
  "btech": [
    { year: "2019", students: 1750 },
    { year: "2020", students: 1820 },
    { year: "2021", students: 1880 },
    { year: "2022", students: 1920 },
    { year: "2023", students: 1970 },
    { year: "2024", students: 2000 },
  ],
  "mba": [
    { year: "2019", students: 350 },
    { year: "2020", students: 365 },
    { year: "2021", students: 375 },
    { year: "2022", students: 385 },
    { year: "2023", students: 395 },
    { year: "2024", students: 400 },
  ],
  "mtech": [
    { year: "2019", students: 220 },
    { year: "2020", students: 245 },
    { year: "2021", students: 265 },
    { year: "2022", students: 280 },
    { year: "2023", students: 290 },
    { year: "2024", students: 300 },
  ],
  "bca": [
    { year: "2019", students: 130 },
    { year: "2020", students: 150 },
    { year: "2021", students: 130 },
    { year: "2022", students: 135 },
    { year: "2023", students: 145 },
    { year: "2024", students: 147 },
  ],
};

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
  { id: 1, type: "enrollment", message: "5 new students enrolled in B.Tech CSE", time: "2 hours ago", icon: UserPlus, color: "text-sky-600", bg: "bg-sky-50" },
  { id: 2, type: "event", message: "Annual Tech Fest 2025 registration opened", time: "3 hours ago", icon: Calendar, color: "text-amber-600", bg: "bg-amber-50" },
  { id: 3, type: "announcement", message: "Mid-term examination schedule released", time: "5 hours ago", icon: Bell, color: "text-gray-600", bg: "bg-gray-50" },
  { id: 4, type: "library", message: "45 new books added to library", time: "1 day ago", icon: Library, color: "text-emerald-600", bg: "bg-emerald-50" },
];

// Low attendance alerts (mock)
const lowAttendanceAlerts = [
  { student: "Rahul Sharma", rollNo: "21CSE001", attendance: 68.5, branch: "CSE" },
  { student: "Priya Verma", rollNo: "21CSE002", attendance: 72.3, branch: "CSE" },
  { student: "Amit Kumar", rollNo: "22ME001", attendance: 70.1, branch: "ME" },
];

export default function DashboardPage() {
  const [selectedDegree, setSelectedDegree] = useState("all");
  const [selectedEnrollmentDegree, setSelectedEnrollmentDegree] = useState("all");
  const attendanceTrends = attendanceTrendsByDegree[selectedDegree] || attendanceTrendsByDegree["all"];
  const enrollmentTrends = enrollmentTrendsByDegree[selectedEnrollmentDegree] || enrollmentTrendsByDegree["all"];

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
                <p className="text-3xl font-bold mt-2 text-gray-900">{totalStudents.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-sky-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                <p className="text-sm font-medium text-gray-600">Total Faculty</p>
                <p className="text-3xl font-bold mt-2 text-gray-900">{totalTeachers}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-emerald-600" />
              </div>
                  </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Programs</p>
                <p className="text-3xl font-bold mt-2 text-gray-900">{activeDegrees}</p>
                <div className="flex items-center gap-1 mt-2">
                  <BookOpen className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">{totalBranches} branches</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Summary & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Weekly Attendance Trend - Degree Wise</CardTitle>
              <select
                value={selectedDegree}
                onChange={(e) => setSelectedDegree(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 bg-white"
              >
                <option value="all">All Degrees</option>
                <option value="btech">B.Tech</option>
                <option value="mba">MBA</option>
                <option value="mtech">M.Tech</option>
                <option value="bca">BCA</option>
              </select>
            </div>
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
                  <span className="text-2xl font-bold text-gray-900">{presentToday}</span>
                </div>
                <p className="text-xs text-gray-600">Present</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-2xl font-bold text-gray-900">{absentToday}</span>
                </div>
                <p className="text-xs text-gray-600">Absent</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-2xl font-bold text-gray-900">{onLeaveToday}</span>
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
            <div className="flex items-center justify-between">
              <CardTitle>Student Enrollment Trend - Degree Wise</CardTitle>
              <select
                value={selectedEnrollmentDegree}
                onChange={(e) => setSelectedEnrollmentDegree(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 bg-white"
              >
                <option value="all">All Degrees</option>
                <option value="btech">B.Tech</option>
                <option value="mba">MBA</option>
                <option value="mtech">M.Tech</option>
                <option value="bca">BCA</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={enrollmentTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
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
