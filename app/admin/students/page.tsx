"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Download, Eye, Edit, Trash2, Filter as FilterIcon } from "lucide-react";
import { demoStudents } from "@/lib/demo-data-v2";
import { degrees, branches, batches, getBranchesByDegreeId } from "@/lib/academic-structure-v2";

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [students] = useState(demoStudents);
  
  // Filters
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const availableBranches = selectedDegree ? getBranchesByDegreeId(selectedDegree) : branches;

  const filteredStudents = students.filter((student) => {
    // Search filter
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());

    // Degree filter
    if (selectedDegree && student.degreeId !== selectedDegree) return false;

    // Branch filter
    if (selectedBranch && student.branchId !== selectedBranch) return false;

    // Batch filter
    if (selectedBatch && student.batch.toString() !== selectedBatch) return false;

    // Semester filter
    if (selectedSemester && student.semester.toString() !== selectedSemester) return false;

    return matchesSearch;
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600 mt-1">Manage all student records and information</p>
        </div>
        <Link href="/admin/students/add">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add New Student
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FilterIcon className="w-5 h-5" />
              Filters
            </CardTitle>
            {hasActiveFilters && (
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
                  setSelectedBranch(""); // Reset branch when degree changes
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle>All Students ({filteredStudents.length})</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Roll No</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Degree</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Branch</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Semester</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Batch</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-gray-500">
                      No students found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{student.rollNo}</td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{student.name}</p>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Badge variant="outline">{student.degreeName}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <p className="font-medium">{student.branchCode}</p>
                        <p className="text-xs text-gray-500">{student.branchName}</p>
                      </td>
                      <td className="py-3 px-4 text-sm">{student.semester}</td>
                      <td className="py-3 px-4 text-sm">{student.batch}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{student.email}</td>
                      <td className="py-3 px-4">
                        <Badge variant={student.status === "active" ? "success" : "secondary"}>
                          {student.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/students/${student.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
