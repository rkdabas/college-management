"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { ClipboardList, TrendingUp, AlertCircle, Calendar as CalendarIcon, Filter, Search } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { demoStudents } from "@/lib/demo-data-v2";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SemesterAttendance {
  semester: number;
  subjects: {
    subject: string;
    code: string;
    attendance: number;
    present: number;
    total: number;
  }[];
}

export default function StudentAttendancePage() {
  const { user } = useAuthStore();
  const student = demoStudents.find(s => s.id === user?.id);
  const currentSemester = student?.semester || 6;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">("daily");
  const [selectedSemester, setSelectedSemester] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const overallAttendance = 82;
  
  const subjects = ["DBMS", "OS", "AI/ML", "SE", "Web Dev", "Project"];

  // Mock attendance data for all semesters
  const semesterAttendanceData: SemesterAttendance[] = [
    {
      semester: 6,
      subjects: [
        { subject: "DBMS", code: "CS601", attendance: 88, present: 40, total: 45 },
        { subject: "OS", code: "CS602", attendance: 82, present: 37, total: 45 },
        { subject: "AI/ML", code: "CS603", attendance: 85, present: 38, total: 45 },
        { subject: "SE", code: "CS604", attendance: 75, present: 34, total: 45 },
        { subject: "Web Dev", code: "CS605", attendance: 90, present: 41, total: 45 },
        { subject: "Project", code: "CS606", attendance: 95, present: 43, total: 45 },
      ],
    },
    {
      semester: 5,
      subjects: [
        { subject: "Computer Networks", code: "CS501", attendance: 87, present: 39, total: 45 },
        { subject: "Data Structures", code: "CS502", attendance: 80, present: 36, total: 45 },
        { subject: "Algorithm Design", code: "CS503", attendance: 83, present: 37, total: 45 },
        { subject: "Software Testing", code: "CS504", attendance: 78, present: 35, total: 45 },
      ],
    },
    {
      semester: 4,
      subjects: [
        { subject: "Object Oriented Programming", code: "CS401", attendance: 86, present: 39, total: 45 },
        { subject: "Database Systems", code: "CS402", attendance: 79, present: 36, total: 45 },
        { subject: "Web Technologies", code: "CS403", attendance: 84, present: 38, total: 45 },
      ],
    },
    {
      semester: 3,
      subjects: [
        { subject: "Programming in C++", code: "CS301", attendance: 81, present: 36, total: 45 },
        { subject: "Discrete Mathematics", code: "CS302", attendance: 88, present: 40, total: 45 },
        { subject: "Computer Organization", code: "CS303", attendance: 76, present: 34, total: 45 },
      ],
    },
    {
      semester: 2,
      subjects: [
        { subject: "Programming Fundamentals", code: "CS201", attendance: 83, present: 37, total: 45 },
        { subject: "Mathematics II", code: "CS202", attendance: 80, present: 36, total: 45 },
      ],
    },
    {
      semester: 1,
      subjects: [
        { subject: "Introduction to Programming", code: "CS101", attendance: 85, present: 38, total: 45 },
        { subject: "Mathematics I", code: "CS102", attendance: 79, present: 36, total: 45 },
      ],
    },
  ];

  // Mock attendance data by subject and date
  const attendanceDataBySubject: Record<string, Record<string, "present" | "absent" | "leave">> = {
    "DBMS": {
      "2025-01-20": "present",
      "2025-01-21": "present",
      "2025-01-22": "absent",
      "2025-01-23": "present",
      "2025-01-24": "present",
      "2025-01-25": "present",
      "2025-01-26": "present",
      "2025-01-27": "present",
      "2025-01-28": "present",
      "2025-01-29": "present",
      "2025-01-30": "absent",
    },
    "OS": {
      "2025-01-20": "present",
      "2025-01-21": "present",
      "2025-01-22": "present",
      "2025-01-23": "absent",
      "2025-01-24": "present",
      "2025-01-25": "present",
      "2025-01-26": "present",
      "2025-01-27": "present",
      "2025-01-28": "present",
      "2025-01-29": "present",
      "2025-01-30": "present",
    },
    "AI/ML": {
      "2025-01-20": "present",
      "2025-01-21": "present",
      "2025-01-22": "present",
      "2025-01-23": "present",
      "2025-01-24": "leave",
      "2025-01-25": "present",
      "2025-01-26": "present",
      "2025-01-27": "present",
      "2025-01-28": "present",
      "2025-01-29": "present",
      "2025-01-30": "present",
    },
    "SE": {
      "2025-01-20": "present",
      "2025-01-21": "absent",
      "2025-01-22": "present",
      "2025-01-23": "present",
      "2025-01-24": "present",
      "2025-01-25": "present",
      "2025-01-26": "present",
      "2025-01-27": "present",
      "2025-01-28": "present",
      "2025-01-29": "present",
      "2025-01-30": "present",
    },
    "Web Dev": {
      "2025-01-20": "present",
      "2025-01-21": "present",
      "2025-01-22": "present",
      "2025-01-23": "present",
      "2025-01-24": "present",
      "2025-01-25": "present",
      "2025-01-26": "present",
      "2025-01-27": "present",
      "2025-01-28": "present",
      "2025-01-29": "present",
      "2025-01-30": "present",
    },
    "Project": {
      "2025-01-20": "present",
      "2025-01-21": "present",
      "2025-01-22": "present",
      "2025-01-23": "present",
      "2025-01-24": "present",
      "2025-01-25": "present",
      "2025-01-26": "present",
      "2025-01-27": "present",
      "2025-01-28": "present",
      "2025-01-29": "present",
      "2025-01-30": "present",
    },
  };

  // Combined attendance data for calendar (aggregated)
  const attendanceData: Record<string, "present" | "absent" | "leave"> = {};
  Object.keys(attendanceDataBySubject).forEach(subject => {
    Object.keys(attendanceDataBySubject[subject]).forEach(date => {
      if (!attendanceData[date]) {
        attendanceData[date] = attendanceDataBySubject[subject][date];
      }
    });
  });

  // Daily attendance for selected date by subject
  const dailyAttendance = useMemo(() => {
    const dateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    return subjects.map(subject => ({
      subject,
      status: attendanceDataBySubject[subject]?.[dateKey] || null,
    }));
  }, [selectedDate]);

  // Weekly attendance calculation by subject
  const weeklyAttendance = useMemo(() => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return subjects.map(subject => {
      let present = 0;
      let total = 0;

      for (let d = new Date(startOfWeek); d <= endOfWeek; d.setDate(d.getDate() + 1)) {
        const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const status = attendanceDataBySubject[subject]?.[dateKey];
        if (status) {
          total++;
          if (status === "present") present++;
        }
      }

      return {
        subject,
        attendance: total > 0 ? Math.round((present / total) * 100) : 0,
        present,
        total,
      };
    });
  }, [selectedDate]);

  // Monthly attendance calculation by subject
  const monthlyAttendance = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return subjects.map(subject => {
      let present = 0;
      let total = 0;

      for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const status = attendanceDataBySubject[subject]?.[dateKey];
        if (status) {
          total++;
          if (status === "present") present++;
        }
      }

      return {
        subject,
        attendance: total > 0 ? Math.round((present / total) * 100) : 0,
        present,
        total,
      };
    });
  }, [selectedDate]);

  // Weekly chart data
  const weeklyChartData = useMemo(() => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return days.map((day, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const status = attendanceData[dateKey];
      
      return {
        day,
        present: status === "present" ? 1 : 0,
        absent: status === "absent" ? 1 : 0,
        leave: status === "leave" ? 1 : 0,
      };
    });
  }, [selectedDate]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Attendance</h1>
        <p className="text-gray-600">View your attendance records with calendar</p>
      </div>

      {/* View Mode Tabs */}
      <div className="flex gap-2">
        <Button
          variant={viewMode === "daily" ? "default" : "outline"}
          onClick={() => setViewMode("daily")}
        >
          Daily
        </Button>
        <Button
          variant={viewMode === "weekly" ? "default" : "outline"}
          onClick={() => setViewMode("weekly")}
        >
          Weekly
        </Button>
        <Button
          variant={viewMode === "monthly" ? "default" : "outline"}
          onClick={() => setViewMode("monthly")}
        >
          Monthly
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar - Smaller */}
        <div className="lg:col-span-1">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            attendanceData={attendanceData}
          />
        </div>

        {/* Attendance Details by Type */}
        <div className="lg:col-span-3 space-y-4">
          {viewMode === "daily" && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Daily Attendance - {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dailyAttendance.map((item, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{item.subject}</h3>
                        {item.status ? (
                          <Badge variant={item.status === "present" ? "success" : item.status === "absent" ? "destructive" : "warning"}>
                            {item.status === "present" ? "Present" : item.status === "absent" ? "Absent" : "On Leave"}
                          </Badge>
                        ) : (
                          <Badge variant="outline">No Class</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {viewMode === "weekly" && (
            <Card>
              <CardHeader>
                <CardTitle>Weekly Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weeklyAttendance.map((item, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{item.subject}</h3>
                        <Badge variant={item.attendance >= 75 ? "success" : "destructive"}>
                          {item.attendance}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Present: {item.present}/{item.total}</span>
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${item.attendance >= 75 ? 'bg-emerald-600' : 'bg-red-600'}`}
                            style={{ width: `${item.attendance}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {viewMode === "monthly" && (
            <Card>
              <CardHeader>
                <CardTitle>Monthly Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {monthlyAttendance.map((item, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{item.subject}</h3>
                        <Badge variant={item.attendance >= 75 ? "success" : "destructive"}>
                          {item.attendance}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Present: {item.present}/{item.total}</span>
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${item.attendance >= 75 ? 'bg-emerald-600' : 'bg-red-600'}`}
                            style={{ width: `${item.attendance}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Overall Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Attendance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <p className="text-sm font-medium text-gray-600 mb-1">Overall Attendance</p>
            <p className="text-4xl font-bold text-gray-900">{overallAttendance}%</p>
          </div>
        </CardContent>
      </Card>

      {/* Past Semesters Attendance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Subject-wise Attendance - All Semesters</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <div>
                <select
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value === "all" ? "all" : parseInt(e.target.value))}
                >
                  <option value="all">All Semesters</option>
                  {Array.from({ length: currentSemester }, (_, i) => i + 1).map(sem => (
                    <option key={sem} value={sem}>
                      Semester {sem} {sem === currentSemester ? "(Current)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {(selectedSemester === "all" 
              ? semesterAttendanceData 
              : semesterAttendanceData.filter(s => s.semester === selectedSemester)
            ).map((semData) => (
              <div key={semData.semester} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Semester {semData.semester}
                    {semData.semester === currentSemester && (
                      <Badge variant="outline" className="ml-2">Current</Badge>
                    )}
                  </h3>
                </div>
                <div className="space-y-3">
                  {semData.subjects
                    .filter(sub => 
                      !searchQuery || 
                      sub.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      sub.code.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((subject, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-gray-900">{subject.subject}</h4>
                            <Badge variant="outline">{subject.code}</Badge>
                            <Badge variant={subject.attendance >= 75 ? "success" : "destructive"}>
                              {subject.attendance}%
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Present: {subject.present}/{subject.total}</span>
                          <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${subject.attendance >= 75 ? 'bg-emerald-600' : 'bg-red-600'}`}
                              style={{ width: `${subject.attendance}%` }}
                            />
                          </div>
                        </div>
                        {subject.attendance < 75 && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            <span>Attendance below 75% requirement</span>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

