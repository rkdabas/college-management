"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search, Filter as FilterIcon, Download, CheckCircle, XCircle, Clock } from "lucide-react";
import { demoStudents } from "@/lib/demo-data-v2";
import { degrees, branches, batches, getBranchesByDegreeId } from "@/lib/academic-structure-v2";

export default function AttendancePage() {
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const availableBranches = selectedDegree ? getBranchesByDegreeId(selectedDegree) : branches;

  // Filter students based on selection
  const filteredStudents = demoStudents.filter((student) => {
    if (selectedDegree && student.degreeId !== selectedDegree) return false;
    if (selectedBranch && student.branchId !== selectedBranch) return false;
    if (selectedBatch && student.batch.toString() !== selectedBatch) return false;
    if (selectedSemester && student.semester.toString() !== selectedSemester) return false;
    return true;
  });

  // Generate mock attendance data
  const attendanceData = filteredStudents.map((student) => ({
    ...student,
    attendance: Math.random() > 0.2 ? "present" : Math.random() > 0.5 ? "absent" : "leave",
    percentage: 75 + Math.random() * 20, // Random percentage between 75-95
  }));

  const presentCount = attendanceData.filter(s => s.attendance === "present").length;
  const absentCount = attendanceData.filter(s => s.attendance === "absent").length;
  const leaveCount = attendanceData.filter(s => s.attendance === "leave").length;
  const avgAttendance = attendanceData.length > 0
    ? (attendanceData.reduce((sum, s) => sum + s.percentage, 0) / attendanceData.length).toFixed(1)
    : 0;

  const resetFilters = () => {
    setSelectedDegree("");
    setSelectedBranch("");
    setSelectedBatch("");
    setSelectedSemester("");
  };

  const hasActiveFilters = selectedDegree || selectedBranch || selectedBatch || selectedSemester;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-1">Track and manage student attendance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="gap-2">
            <Calendar className="w-4 h-4" />
            Mark Attendance
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {hasActiveFilters && attendanceData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Attendance</p>
                  <p className="text-2xl font-bold mt-1">{avgAttendance}%</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Present</p>
                  <p className="text-2xl font-bold mt-1 text-green-600">{presentCount}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Absent</p>
                  <p className="text-2xl font-bold mt-1 text-red-600">{absentCount}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">On Leave</p>
                  <p className="text-2xl font-bold mt-1 text-orange-600">{leaveCount}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FilterIcon className="w-5 h-5" />
              Filter Attendance
            </CardTitle>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Degree</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedDegree}
                onChange={(e) => {
                  setSelectedDegree(e.target.value);
                  setSelectedBranch("");
                }}
              >
                <option value="">All Degrees</option>
                {degrees.map((degree) => (
                  <option key={degree.id} value={degree.id}>
                    {degree.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Branch</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                disabled={!selectedDegree}
              >
                <option value="">All Branches</option>
                {availableBranches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Batch</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
              >
                <option value="">All Batches</option>
                {batches.filter(b => b.isActive).map((batch) => (
                  <option key={batch.id} value={batch.year}>
                    {batch.year}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Semester</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                <option value="">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Records */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Attendance Records ({attendanceData.length} students)</CardTitle>
            <Badge variant="outline">
              Date: {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {attendanceData.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900">No students found</p>
              <p className="text-sm text-gray-600 mt-1">
                Select filters to view attendance records
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Roll No</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Student Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Degree</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Branch</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Semester</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Batch</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Overall %</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Today's Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{student.rollNo}</td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{student.name}</p>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Badge variant="outline">{student.degreeName}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">{student.branchCode}</td>
                      <td className="py-3 px-4 text-sm">{student.semester}</td>
                      <td className="py-3 px-4 text-sm">{student.batch}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`rounded-full h-2 ${
                                student.percentage >= 90
                                  ? "bg-green-500"
                                  : student.percentage >= 75
                                  ? "bg-orange-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${student.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{student.percentage.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            student.attendance === "present"
                              ? "success"
                              : student.attendance === "absent"
                              ? "destructive"
                              : "warning"
                          }
                        >
                          {student.attendance}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
