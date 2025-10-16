"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Users, BookOpen, Eye, Building2 } from "lucide-react";
import { demoTeachers } from "@/lib/demo-data-v2";
import { departments } from "@/lib/departments";

export default function FacultyPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "assignments">("list");

  // Filter faculty by department and search
  const filteredFaculty = demoTeachers.filter((faculty) => {
    if (selectedDepartment && faculty.departmentId !== selectedDepartment) return false;
    if (
      searchQuery &&
      !faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !faculty.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  // Get faculty count by department
  const getDepartmentFacultyCount = (deptId: string) => {
    return demoTeachers.filter((f) => f.departmentId === deptId).length;
  };

  // Get all teaching assignments
  const allAssignments = demoTeachers.flatMap((teacher) =>
    teacher.subjects.map((subject) => ({
      teacher,
      subject,
    }))
  );

  const resetFilters = () => {
    setSelectedDepartment("");
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Faculty Management</h1>
          <p className="text-gray-600 mt-1">Manage faculty members and their assignments</p>
        </div>
        <Link href="/admin/faculty/add">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add New Faculty
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Faculty</p>
                <p className="text-3xl font-bold mt-1">{demoTeachers.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Departments</p>
                <p className="text-3xl font-bold mt-1">{departments.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Teaching Assignments</p>
                <p className="text-3xl font-bold mt-1">{allAssignments.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Experience</p>
                <p className="text-3xl font-bold mt-1">
                  {(demoTeachers.reduce((sum, f) => sum + f.experience, 0) / demoTeachers.length).toFixed(1)} yrs
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Mode Tabs */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
              className="gap-2"
            >
              <Users className="w-4 h-4" />
              Faculty List
            </Button>
            <Button
              variant={viewMode === "assignments" ? "default" : "outline"}
              onClick={() => setViewMode("assignments")}
              className="gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Teaching Assignments
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Search & Filter</CardTitle>
            {(selectedDepartment || searchQuery) && (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or employee ID..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} ({getDepartmentFacultyCount(dept.id)} faculty)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Department-wise Faculty Count */}
      {!selectedDepartment && viewMode === "list" && (
        <Card>
          <CardHeader>
            <CardTitle>Department-wise Faculty Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((dept) => {
                const count = getDepartmentFacultyCount(dept.id);
                return (
                  <div
                    key={dept.id}
                    className="border-2 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all hover:border-primary"
                    onClick={() => setSelectedDepartment(dept.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <Badge variant="outline">{dept.code}</Badge>
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{dept.name}</h3>
                    <p className="text-2xl font-bold text-primary">{count} Faculty</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Faculty List View */}
      {viewMode === "list" && (
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDepartment
                ? `${departments.find((d) => d.id === selectedDepartment)?.name} Faculty (${filteredFaculty.length})`
                : `All Faculty (${filteredFaculty.length})`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredFaculty.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900">No faculty found</p>
                <p className="text-sm text-gray-600 mt-1">
                  {searchQuery || selectedDepartment
                    ? "Try adjusting your filters"
                    : "No faculty members available"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFaculty.map((faculty) => (
                  <div key={faculty.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{faculty.name}</h3>
                        <p className="text-sm text-gray-600">{faculty.employeeId}</p>
                      </div>
                      <Badge variant={faculty.status === "active" ? "success" : "secondary"}>
                        {faculty.status}
                      </Badge>
                    </div>

                    <div className="mb-3">
                      <Badge variant="outline" className="mb-2">
                        {faculty.departmentName}
                      </Badge>
                      <p className="text-sm text-gray-600">{faculty.designation}</p>
                      <p className="text-sm text-gray-600">{faculty.qualification}</p>
                    </div>

                    <div className="space-y-2 mb-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium">{faculty.experience} years</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Subjects Teaching:</span>
                        <span className="font-semibold text-primary">{faculty.subjects.length}</span>
                      </div>
                    </div>

                    {faculty.subjects.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-600 mb-1">Currently Teaching:</p>
                        <div className="flex flex-wrap gap-1">
                          {faculty.subjects.slice(0, 2).map((sub, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {sub.subjectCode}
                            </Badge>
                          ))}
                          {faculty.subjects.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{faculty.subjects.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-3 border-t">
                      <Link href={`/admin/faculty/${faculty.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full gap-2">
                          <Eye className="w-4 h-4" />
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Teaching Assignments View */}
      {viewMode === "assignments" && (
        <Card>
          <CardHeader>
            <CardTitle>Teaching Assignments ({allAssignments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {allAssignments.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900">No assignments found</p>
                <p className="text-sm text-gray-600 mt-1">No subjects are currently assigned to faculty members</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Teacher</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Department</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Subject</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Degree</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Branch</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Semester</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Batch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allAssignments.map((assignment, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-900">{assignment.teacher.name}</p>
                          <p className="text-xs text-gray-500">{assignment.teacher.employeeId}</p>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{assignment.teacher.departmentName}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium">{assignment.subject.subjectName}</p>
                          <p className="text-xs text-gray-500">{assignment.subject.subjectCode}</p>
                        </td>
                        <td className="py-3 px-4 text-sm">{assignment.subject.degreeName}</td>
                        <td className="py-3 px-4 text-sm">{assignment.subject.branchName}</td>
                        <td className="py-3 px-4 text-sm text-center">{assignment.subject.semester}</td>
                        <td className="py-3 px-4 text-sm text-center">{assignment.subject.batch}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
