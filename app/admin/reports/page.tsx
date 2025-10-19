"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  FileText, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Filter as FilterIcon,
  Users,
  GraduationCap,
  CheckCircle,
  BookOpen,
  Calendar,
  Library,
  Building,
  Clock,
  X,
} from "lucide-react";
import { degrees, branches, batches, getBranchesByDegreeId } from "@/lib/academic-structure-v2";
import { demoStudents } from "@/lib/demo-data-v2";

type ReportCategory = "student" | "attendance" | "faculty" | "library" | "events" | "department" | "consolidation";

interface Report {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  icon: any;
  needsFilters: boolean;
  formats: string[];
}

const allReports: Report[] = [
  // Student Reports
  {
    id: "student-list",
    title: "Complete Student List",
    description: "All students with personal & academic details",
    category: "student",
    icon: Users,
    needsFilters: true,
    formats: ["PDF", "Excel", "CSV"],
  },
  {
    id: "student-demographics",
    title: "Student Demographics Report",
    description: "Age, gender, location distribution",
    category: "student",
    icon: PieChart,
    needsFilters: true,
    formats: ["PDF", "Excel"],
  },
  {
    id: "student-enrollment",
    title: "Enrollment Statistics",
    description: "Year-wise, degree-wise, branch-wise enrollment",
    category: "student",
    icon: TrendingUp,
    needsFilters: false,
    formats: ["PDF", "Excel"],
  },
  {
    id: "student-strength",
    title: "Class Strength Report",
    description: "Current strength by class, section, semester",
    category: "student",
    icon: BarChart3,
    needsFilters: true,
    formats: ["PDF", "Excel"],
  },

  // Attendance Reports
  {
    id: "attendance-daily",
    title: "Daily Attendance Report",
    description: "Day-wise attendance with present/absent/leave",
    category: "attendance",
    icon: CheckCircle,
    needsFilters: true,
    formats: ["PDF", "Excel"],
  },
  {
    id: "attendance-monthly",
    title: "Monthly Attendance Summary",
    description: "Month-wise attendance percentage",
    category: "attendance",
    icon: Calendar,
    needsFilters: true,
    formats: ["PDF", "Excel"],
  },
  {
    id: "attendance-semester",
    title: "Semester Attendance Report",
    description: "Complete semester attendance records",
    category: "attendance",
    icon: BarChart3,
    needsFilters: true,
    formats: ["PDF", "Excel"],
  },
  {
    id: "attendance-defaulters",
    title: "Low Attendance Report",
    description: "Students with attendance below threshold",
    category: "attendance",
    icon: TrendingUp,
    needsFilters: true,
    formats: ["PDF", "Excel"],
  },

  // Faculty Reports
  {
    id: "faculty-list",
    title: "Complete Faculty List",
    description: "All faculty with qualifications & designations",
    category: "faculty",
    icon: GraduationCap,
    needsFilters: false,
    formats: ["PDF", "Excel"],
  },
  {
    id: "faculty-workload",
    title: "Faculty Workload Report",
    description: "Teaching hours, subjects assigned per faculty",
    category: "faculty",
    icon: Clock,
    needsFilters: false,
    formats: ["PDF", "Excel"],
  },
  {
    id: "faculty-subject",
    title: "Subject-Teacher Assignment Report",
    description: "Subject-wise teacher allocation",
    category: "faculty",
    icon: BookOpen,
    needsFilters: true,
    formats: ["PDF", "Excel"],
  },
  {
    id: "faculty-department",
    title: "Department-wise Faculty Report",
    description: "Faculty distribution across departments",
    category: "faculty",
    icon: Building,
    needsFilters: false,
    formats: ["PDF", "Excel"],
  },

  // Library Reports
  {
    id: "library-issued",
    title: "Books Issued Report",
    description: "Currently issued books with due dates",
    category: "library",
    icon: Library,
    needsFilters: false,
    formats: ["PDF", "Excel"],
  },
  {
    id: "library-returned",
    title: "Books Returned Report",
    description: "Books returned in selected period",
    category: "library",
    icon: CheckCircle,
    needsFilters: false,
    formats: ["PDF", "Excel"],
  },
  {
    id: "library-overdue",
    title: "Overdue Books Report",
    description: "Books not returned by due date",
    category: "library",
    icon: Clock,
    needsFilters: false,
    formats: ["PDF", "Excel"],
  },
  {
    id: "library-fines",
    title: "Library Fines Report",
    description: "Fines collected for late returns",
    category: "library",
    icon: TrendingUp,
    needsFilters: false,
    formats: ["PDF", "Excel"],
  },

  // Events Reports
  {
    id: "events-calendar",
    title: "Events Calendar Report",
    description: "All events with dates and participants",
    category: "events",
    icon: Calendar,
    needsFilters: false,
    formats: ["PDF", "Excel"],
  },
  {
    id: "events-participation",
    title: "Event Participation Report",
    description: "Student participation in events",
    category: "events",
    icon: Users,
    needsFilters: false,
    formats: ["PDF", "Excel"],
  },

  // Department Reports
  {
    id: "dept-summary",
    title: "Department Summary Report",
    description: "Department-wise students, faculty, branches",
    category: "department",
    icon: Building,
    needsFilters: false,
    formats: ["PDF", "Excel"],
  },
  {
    id: "dept-performance",
    title: "Department Performance Report",
    description: "Overall department statistics",
    category: "department",
    icon: TrendingUp,
    needsFilters: false,
    formats: ["PDF", "Excel"],
  },

  // Consolidation Reports
  {
    id: "consolidation-institutional",
    title: "Institutional Overview Report",
    description: "Complete institutional statistics",
    category: "consolidation",
    icon: BarChart3,
    needsFilters: false,
    formats: ["PDF"],
  },
  {
    id: "consolidation-annual",
    title: "Annual Report",
    description: "Year-wise consolidated report",
    category: "consolidation",
    icon: FileText,
    needsFilters: false,
    formats: ["PDF"],
  },
];

const reportCategories = [
  { value: "all", label: "All Reports", icon: FileText, color: "blue" },
  { value: "student", label: "Student Reports", icon: Users, color: "blue" },
  { value: "attendance", label: "Attendance Reports", icon: CheckCircle, color: "green" },
  { value: "faculty", label: "Faculty Reports", icon: GraduationCap, color: "purple" },
  { value: "library", label: "Library Reports", icon: Library, color: "orange" },
  { value: "events", label: "Event Reports", icon: Calendar, color: "pink" },
  { value: "department", label: "Department Reports", icon: Building, color: "indigo" },
  { value: "consolidation", label: "Consolidation Reports", icon: TrendingUp, color: "red" },
];

export default function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  
  // Filters
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const availableBranches = selectedDegree ? getBranchesByDegreeId(selectedDegree) : branches;
  const years = [2025, 2024, 2023, 2022, 2021, 2020];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const resetFilters = () => {
    setSelectedDegree("");
    setSelectedBranch("");
    setSelectedBatch("");
    setSelectedSemester("");
    setSelectedMonth("");
  };

  // Filter reports by category
  const filteredReports = selectedCategory === "all" 
    ? allReports 
    : allReports.filter(r => r.category === selectedCategory);

  // Student count for filtered criteria
  const filteredStudents = demoStudents.filter((student) => {
    if (selectedDegree && student.degreeId !== selectedDegree) return false;
    if (selectedBranch && student.branchId !== selectedBranch) return false;
    if (selectedBatch && student.batch.toString() !== selectedBatch) return false;
    if (selectedSemester && student.semester.toString() !== selectedSemester) return false;
    return true;
  });

  const generateReport = (report: Report, format: string) => {
    alert(`Generating ${report.title} in ${format} format...\n\nThis will download the report file.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-1">Generate and download various institutional reports</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{allReports.length}</p>
              <p className="text-sm text-gray-600 mt-1">Available Reports</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">8</p>
              <p className="text-sm text-gray-600 mt-1">Report Categories</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-600 mt-1">Export Formats</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{demoStudents.length}</p>
              <p className="text-sm text-gray-600 mt-1">Total Records</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Report Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {reportCategories.map((category) => (
              <div
                key={category.value}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all text-center ${
                  selectedCategory === category.value
                    ? `border-${category.color}-500 bg-${category.color}-50`
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedCategory(category.value)}
              >
                <category.icon className={`w-6 h-6 mx-auto mb-2 text-${category.color}-600`} />
                <p className="text-xs font-medium">{category.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedCategory === "all" ? "All Reports" : reportCategories.find(c => c.value === selectedCategory)?.label}
            <span className="text-gray-400 ml-2">({filteredReports.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="border-2 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center`}>
                    <report.icon className="w-6 h-6 text-sky-600" />
                  </div>
                  {report.needsFilters && (
                    <Badge variant="outline" className="text-xs">
                      <FilterIcon className="w-3 h-3 mr-1" />
                      Filters
                    </Badge>
                  )}
                </div>

                <h3 className="font-bold text-sm mb-1">{report.title}</h3>
                <p className="text-xs text-gray-600 mb-3">{report.description}</p>

                <div className="flex flex-wrap gap-1">
                  {report.formats.map((format) => (
                    <Badge key={format} variant="secondary" className="text-xs">
                      {format}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Generation Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">{selectedReport.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{selectedReport.description}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedReport(null);
                  resetFilters();
                }}
              >
                <X className="w-5 h-5" />
                </Button>
            </div>

            {/* Filters Section */}
            {selectedReport.needsFilters && (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FilterIcon className="w-4 h-4" />
                    Report Filters
                  </CardTitle>
          </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Degree Filter */}
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

                    {/* Branch Filter */}
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

                    {/* Batch Filter */}
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

                    {/* Semester Filter */}
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

                    {/* Month Filter (for attendance reports) */}
                    {selectedReport.category === "attendance" && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Month</label>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                          <option value="">Select Month</option>
                          {months.map((month, idx) => (
                            <option key={month} value={idx + 1}>
                              {month}
                            </option>
                          ))}
                        </select>
            </div>
                    )}

                    {/* Year Filter */}
              <div className="space-y-2">
                      <label className="text-sm font-medium">Year</label>
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

                  {/* Filter Summary */}
                  {selectedReport.category === "student" && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
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
                  )}
          </CardContent>
        </Card>
      )}

            {/* Export Options */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Select Export Format:</h3>
              <div className="grid grid-cols-3 gap-3">
                {selectedReport.formats.map((format) => (
                  <Button
                    key={format}
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    onClick={() => generateReport(selectedReport, format)}
                  >
                    <Download className="w-5 h-5" />
                    <span className="text-sm font-medium">{format}</span>
              </Button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-6 pt-4 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSelectedReport(null);
                  resetFilters();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
                  </div>
      )}
    </div>
  );
}
