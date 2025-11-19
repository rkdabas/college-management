"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ClipboardList, CheckCircle, XCircle, Clock, Calendar as CalendarIcon } from "lucide-react";
import { useState, useMemo } from "react";

export default function TeacherAttendancePage() {
  const [selectedClass, setSelectedClass] = useState("1");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">("daily");
  const [studentAttendance, setStudentAttendance] = useState<Record<string, Record<string, "present" | "absent" | "leave">>>({});
  
  const classes = [
    { id: "1", subject: "Database Management Systems", batch: 2021, semester: 6 },
    { id: "2", subject: "Database Management Systems", batch: 2022, semester: 4 },
    { id: "3", subject: "Operating Systems", batch: 2022, semester: 4 },
  ];

  const students = [
    { id: "1", rollNo: "21CSE001", name: "Rahul Sharma" },
    { id: "2", rollNo: "21CSE002", name: "Priya Verma" },
    { id: "3", rollNo: "21CSE003", name: "Amit Kumar" },
    { id: "4", rollNo: "21CSE004", name: "Sneha Patel" },
    { id: "5", rollNo: "21CSE005", name: "Arjun Singh" },
  ];

  const currentClass = classes.find(c => c.id === selectedClass);

  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleAttendanceChange = (studentId: string, status: "present" | "absent" | "leave") => {
    const dateKey = formatDateKey(selectedDate);
    setStudentAttendance(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [studentId]: status,
      }
    }));
  };

  const getStudentStatus = (studentId: string) => {
    const dateKey = formatDateKey(selectedDate);
    return studentAttendance[dateKey]?.[studentId] || null;
  };

  // Build attendance data for calendar
  const calendarAttendanceData = useMemo(() => {
    const data: Record<string, "present" | "absent" | "leave"> = {};
    Object.keys(studentAttendance).forEach(dateKey => {
      const dayData = studentAttendance[dateKey];
      const presentCount = Object.values(dayData).filter(s => s === "present").length;
      const absentCount = Object.values(dayData).filter(s => s === "absent").length;
      const leaveCount = Object.values(dayData).filter(s => s === "leave").length;
      const total = presentCount + absentCount + leaveCount;
      
      if (total > 0) {
        // Mark as present if majority are present
        if (presentCount > absentCount && presentCount > leaveCount) {
          data[dateKey] = "present";
        } else if (absentCount > leaveCount) {
          data[dateKey] = "absent";
        } else {
          data[dateKey] = "leave";
        }
      }
    });
    return data;
  }, [studentAttendance]);

  // Weekly attendance summary
  const weeklySummary = useMemo(() => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    let present = 0;
    let absent = 0;
    let leave = 0;
    let total = 0;

    for (let d = new Date(startOfWeek); d <= endOfWeek; d.setDate(d.getDate() + 1)) {
      const dateKey = formatDateKey(d);
      const dayData = studentAttendance[dateKey];
      if (dayData) {
        Object.values(dayData).forEach(status => {
          total++;
          if (status === "present") present++;
          else if (status === "absent") absent++;
          else if (status === "leave") leave++;
        });
      }
    }

    return { present, absent, leave, total, percentage: total > 0 ? Math.round((present / total) * 100) : 0 };
  }, [selectedDate, studentAttendance]);

  // Monthly attendance summary
  const monthlySummary = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let present = 0;
    let absent = 0;
    let leave = 0;
    let total = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayData = studentAttendance[dateKey];
      if (dayData) {
        Object.values(dayData).forEach(status => {
          total++;
          if (status === "present") present++;
          else if (status === "absent") absent++;
          else if (status === "leave") leave++;
        });
      }
    }

    return { present, absent, leave, total, percentage: total > 0 ? Math.round((present / total) * 100) : 0 };
  }, [selectedDate, studentAttendance]);

  const handleSaveAttendance = () => {
    // Save attendance logic here
    console.log("Saving attendance for", formatDateKey(selectedDate), studentAttendance[formatDateKey(selectedDate)]);
    alert("Attendance saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mark Attendance</h1>
        <p className="text-gray-600">Mark attendance for your classes with calendar view</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            attendanceData={calendarAttendanceData}
          />
        </div>

        {/* Summary Cards */}
        <div className="space-y-4">
          {viewMode === "daily" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Selected Date</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-xs text-gray-500">Select a date to mark attendance</p>
              </CardContent>
            </Card>
          )}

          {viewMode === "weekly" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Weekly Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900 mb-2">{weeklySummary.percentage}%</p>
                <div className="space-y-1 text-xs text-gray-600">
                  <p>Present: {weeklySummary.present}</p>
                  <p>Absent: {weeklySummary.absent}</p>
                  <p>Leave: {weeklySummary.leave}</p>
                  <p>Total: {weeklySummary.total}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {viewMode === "monthly" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Monthly Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900 mb-2">{monthlySummary.percentage}%</p>
                <div className="space-y-1 text-xs text-gray-600">
                  <p>Present: {monthlySummary.present}</p>
                  <p>Absent: {monthlySummary.absent}</p>
                  <p>Leave: {monthlySummary.leave}</p>
                  <p>Total: {monthlySummary.total}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Class</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {classes.map((classItem) => (
              <button
                key={classItem.id}
                onClick={() => setSelectedClass(classItem.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedClass === classItem.id
                    ? "border-sky-600 bg-sky-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <h3 className="font-semibold text-gray-900 mb-1">{classItem.subject}</h3>
                <p className="text-sm text-gray-600">Batch {classItem.batch} | Sem {classItem.semester}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {currentClass && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {currentClass.subject} - Batch {currentClass.batch} | Semester {currentClass.semester}
              </CardTitle>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {selectedDate.toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {students.map((student) => {
                const status = getStudentStatus(student.id);
                return (
                  <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.rollNo}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={status === "present" ? "default" : "outline"}
                        onClick={() => handleAttendanceChange(student.id, "present")}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Present
                      </Button>
                      <Button
                        size="sm"
                        variant={status === "absent" ? "destructive" : "outline"}
                        onClick={() => handleAttendanceChange(student.id, "absent")}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Absent
                      </Button>
                      <Button
                        size="sm"
                        variant={status === "leave" ? "default" : "outline"}
                        onClick={() => handleAttendanceChange(student.id, "leave")}
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        Leave
                      </Button>
                    </div>
                  </div>
                );
              })}
              <div className="mt-4 flex justify-end">
                <Button onClick={handleSaveAttendance}>Save Attendance</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

