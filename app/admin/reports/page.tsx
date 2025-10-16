"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, BarChart3, PieChart, TrendingUp, Filter as FilterIcon } from "lucide-react";
import { degrees, branches, batches, getBranchesByDegreeId } from "@/lib/academic-structure-v2";
import { demoStudents } from "@/lib/demo-data-v2";

type ReportType = "student" | "attendance" | "faculty" | "course" | "financial" | "academic";

export default function ReportsPage() {
  const [selectedReportType, setSelectedReportType] = useState<ReportType>("student");
  
  // Student report filters
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  
  // Year filter for other reports
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const availableBranches = selectedDegree ? getBranchesByDegreeId(selectedDegree) : branches;
  const years = [2024, 2023, 2022, 2021, 2020];

  const resetFilters = () => {
    setSelectedDegree("");
    setSelectedBranch("");
    setSelectedBatch("");
    setSelectedSemester("");
  };

  // Student count for filtered criteria
  const filteredStudents = demoStudents.filter((student) => {
    if (selectedDegree && student.degreeId !== selectedDegree) return false;
    if (selectedBranch && student.branchId !== selectedBranch) return false;
    if (selectedBatch && student.batch.toString() !== selectedBatch) return false;
    if (selectedSemester && student.semester.toString() !== selectedSemester) return false;
    return true;
  });

  const reportTypes: { value: ReportType; label: string; icon: any; color: string }[] = [
    { value: "student", label: "Student Report", icon: FileText, color: "blue" },
    { value: "attendance", label: "Attendance Report", icon: BarChart3, color: "green" },
    { value: "faculty", label: "Faculty Report", icon: FileText, color: "purple" },
    { value: "course", label: "Course Report", icon: PieChart, color: "orange" },
    { value: "financial", label: "Financial Report", icon: TrendingUp, color: "red" },
    { value: "academic", label: "Academic Performance", icon: BarChart3, color: "indigo" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-1">Generate and download various institutional reports</p>
      </div>

      {/* Report Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Report Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((report) => (
              <div
                key={report.value}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedReportType === report.value
                    ? `border-${report.color}-500 bg-${report.color}-50`
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedReportType(report.value)}
              >
                <div className={`w-12 h-12 bg-${report.color}-100 rounded-lg flex items-center justify-center mb-3`}>
                  <report.icon className={`w-6 h-6 text-${report.color}-600`} />
                </div>
                <h3 className="font-semibold">{report.label}</h3>
                <p className="text-xs text-gray-600 mt-1">
                  {report.value === "student" ? "Filter by degree, branch, batch, semester" : `Year-wise ${report.label.toLowerCase()}`}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters Section */}
      {selectedReportType === "student" ? (
        /* Student Report Filters */
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FilterIcon className="w-5 h-5" />
                Student Report Filters
              </CardTitle>
              {(selectedDegree || selectedBranch || selectedBatch || selectedSemester) && (
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  Reset Filters
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            </div>

            {/* Student Count */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-900">
                Report will include: <span className="text-lg font-bold">{filteredStudents.length}</span> students
              </p>
              {selectedDegree && (
                <p className="text-xs text-blue-700 mt-1">
                  {degrees.find(d => d.id === selectedDegree)?.name}
                  {selectedBranch && ` → ${branches.find(b => b.id === selectedBranch)?.name}`}
                  {selectedBatch && ` → Batch ${selectedBatch}`}
                  {selectedSemester && ` → Semester ${selectedSemester}`}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Year Filter for Other Reports */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FilterIcon className="w-5 h-5" />
              Year-wise Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Year</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-900">
                Report for: <span className="text-lg font-bold">{selectedYear}</span>
              </p>
              <p className="text-xs text-green-700 mt-1">
                {reportTypes.find(r => r.value === selectedReportType)?.label} - Academic Year {selectedYear}-{parseInt(selectedYear) + 1}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Report Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Report Preview</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-8">
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {reportTypes.find(r => r.value === selectedReportType)?.label}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {selectedReportType === "student" 
                  ? `Showing data for ${filteredStudents.length} students`
                  : `Showing data for year ${selectedYear}`
                }
              </p>

              {/* Sample Report Data */}
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {selectedReportType === "student" ? filteredStudents.length : "187"}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {selectedReportType === "student" ? "Students" : "Total Records"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {selectedReportType === "student" ? "92.5%" : "85.2%"}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {selectedReportType === "attendance" ? "Avg. Attendance" : "Performance"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {selectedReportType === "student" ? degrees.length : "12"}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {selectedReportType === "student" ? "Degrees" : "Departments"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {selectedReportType === "financial" ? "₹42.5L" : "4"}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {selectedReportType === "financial" ? "Revenue" : "Batches"}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-6">
                Click export buttons above to download the complete report
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <FileText className="w-6 h-6" />
              <span>All Students List</span>
              <span className="text-xs text-gray-500">Complete database</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <BarChart3 className="w-6 h-6" />
              <span>Monthly Attendance</span>
              <span className="text-xs text-gray-500">Current month</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <TrendingUp className="w-6 h-6" />
              <span>Performance Summary</span>
              <span className="text-xs text-gray-500">Semester wise</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
