"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  GraduationCap, 
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { getDegreeWiseStudentCount, getBranchWiseStudentCount } from "@/lib/demo-data-v2";

const statsCards = [
  {
    title: "Total Students",
    value: "2,847",
    change: "+12.5%",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    trend: "up",
  },
  {
    title: "Total Faculty",
    value: "187",
    change: "+3.2%",
    icon: GraduationCap,
    color: "text-green-600",
    bgColor: "bg-green-50",
    trend: "up",
  },
  {
    title: "Active Courses",
    value: "156",
    change: "+8.1%",
    icon: BookOpen,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    trend: "up",
  },
  {
    title: "Active Batches",
    value: "4",
    change: "2021-2024",
    icon: TrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    trend: "up",
  },
];

// Get degree-wise and branch-wise data
const degreeData = getDegreeWiseStudentCount();
const branchData = getBranchWiseStudentCount();

// Colors for pie chart
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                    <span className="text-sm text-gray-500">vs last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Degree-wise Students */}
        <Card>
          <CardHeader>
            <CardTitle>Degree-wise Student Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={degreeData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, students }) => `${name}: ${students}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="students"
                >
                  {degreeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Branch-wise Students */}
        <Card>
          <CardHeader>
            <CardTitle>Branch-wise Student Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={branchData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={120}
                  interval={0}
                  tick={{ fontSize: 10 }}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

