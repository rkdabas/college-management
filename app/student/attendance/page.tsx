"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { ClipboardList, AlertCircle, Search } from "lucide-react";
import { useAuthStore } from "@/lib/store";

interface AttendanceStats {
  overallPercentage: number;
  totalPresent: number;
  totalCount: number;
  perSubject: {
    subjectName: string;
    subjectCode: string;
    subjectId: string;
    presentCount: number;
    totalCount: number;
    percentage: number;
  }[];
}

interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  subject: { id: string; name: string; code: string };
}

export default function StudentAttendancePage() {
  const { user } = useAuthStore();
  const currentSemester = user?.semester ?? 6;
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [detailedRecords, setDetailedRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"stats" | "detailed">("stats");
  const [selectedSemester, setSelectedSemester] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/attendance/stats?studentId=${user.id}`)
      .then((res) => res.ok ? res.json() : null)
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [user?.id]);

  useEffect(() => {
    if (viewMode === "detailed" && user?.id) {
      setDetailLoading(true);
      fetch(`/api/attendance?studentId=${user.id}`)
        .then((res) => res.ok ? res.json() : [])
        .then(setDetailedRecords)
        .catch(() => setDetailedRecords([]))
        .finally(() => setDetailLoading(false));
    }
  }, [viewMode, user?.id]);

  const perSubject = stats?.perSubject ?? [];
  const overallAttendance = stats?.overallPercentage ?? 0;

  const attendanceData: Record<string, "present" | "absent" | "leave"> = useMemo(() => {
    const data: Record<string, "present" | "absent" | "leave"> = {};
    detailedRecords.forEach((r) => {
      if (r.status === "present" || r.status === "absent" || r.status === "leave") {
        data[r.date] = r.status as "present" | "absent" | "leave";
      }
    });
    return data;
  }, [detailedRecords]);

  const dailyAttendance = useMemo(() => {
    const dateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
    return detailedRecords
      .filter((r) => r.date === dateKey)
      .map((r) => ({ subject: r.subject.name, status: r.status }));
  }, [selectedDate, detailedRecords]);

  const filteredPerSubject = perSubject.filter(
    (sub) =>
      !searchQuery ||
      sub.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.subjectCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const semesterFiltered = selectedSemester === "all" ? perSubject : perSubject;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Attendance</h1>
        <p className="text-gray-600">View your attendance records with calendar</p>
      </div>

      <div className="flex gap-2">
        <Button
          variant={viewMode === "stats" ? "default" : "outline"}
          onClick={() => setViewMode("stats")}
        >
          Summary
        </Button>
        <Button
          variant={viewMode === "detailed" ? "default" : "outline"}
          onClick={() => setViewMode("detailed")}
        >
          Detailed View
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            attendanceData={attendanceData}
          />
        </div>

        <div className="lg:col-span-3 space-y-4">
          {viewMode === "stats" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Overall Attendance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-1">Overall Attendance</p>
                    <p className="text-4xl font-bold text-gray-900">{overallAttendance}%</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Present: {stats?.totalPresent ?? 0} / {stats?.totalCount ?? 0}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <CardTitle>Subject-wise Attendance</CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="text"
                          placeholder="Search subjects..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 w-48 sm:w-64"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredPerSubject.length > 0 ? (
                      filteredPerSubject.map((subject, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{subject.subjectName}</h4>
                              <Badge variant="outline">{subject.subjectCode}</Badge>
                              <Badge variant={subject.percentage >= 75 ? "success" : "destructive"}>
                                {subject.percentage}%
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Present: {subject.presentCount}/{subject.totalCount}</span>
                            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${subject.percentage >= 75 ? "bg-emerald-600" : "bg-red-600"}`}
                                style={{ width: `${subject.percentage}%` }}
                              />
                            </div>
                          </div>
                          {subject.percentage < 75 && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                              <AlertCircle className="w-4 h-4" />
                              <span>Attendance below 75% requirement</span>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No attendance data</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {viewMode === "detailed" && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Daily Attendance - {selectedDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {detailLoading ? (
                  <p className="text-gray-500">Loading...</p>
                ) : dailyAttendance.length > 0 ? (
                  <div className="space-y-3">
                    {dailyAttendance.map((item, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">{item.subject}</h3>
                          <Badge
                            variant={
                              item.status === "present"
                                ? "success"
                                : item.status === "absent"
                                ? "destructive"
                                : "warning"
                            }
                          >
                            {item.status === "present" ? "Present" : item.status === "absent" ? "Absent" : "On Leave"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No attendance records for this date</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
