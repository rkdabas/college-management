"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Users, Eye, Building2 } from "lucide-react";
import { demoTeachers } from "@/lib/demo-data-v2";
import { departments } from "@/lib/departments";

export default function FacultyPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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
          <p className="text-gray-600 mt-1">Manage faculty members and their information</p>
        </div>
        <Link href="/admin/faculty/add">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add New Faculty
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Faculty</p>
                <p className="text-3xl font-bold mt-1 text-gray-900">{demoTeachers.length}</p>
              </div>
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-sky-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Departments</p>
                <p className="text-3xl font-bold mt-1 text-gray-900">{departments.length}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
      {!selectedDepartment && (
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
                    className="border-2 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all hover:border-sky-600"
                    onClick={() => setSelectedDepartment(dept.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-sky-600 to-sky-700 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <Badge variant="outline">{dept.code}</Badge>
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{dept.name}</h3>
                    <p className="text-2xl font-bold text-gray-900">{count} Faculty</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Faculty List View */}
      <Card>
          <CardHeader>
            <CardTitle>
              {selectedDepartment
                ? `${departments.find((d) => d.id === selectedDepartment)?.name} Faculty (${filteredFaculty.length})`
                : `Faculty Members (${filteredFaculty.length})`}
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
                        <span className="font-medium text-gray-900">{faculty.experience} years</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Subjects Teaching:</span>
                        <span className="font-semibold text-gray-900">{faculty.subjects.length}</span>
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
    </div>
  );
}
