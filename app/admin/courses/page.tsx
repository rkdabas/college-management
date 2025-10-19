"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Search,
  Filter as FilterIcon,
  UserPlus,
  Users,
  X,
  UserMinus,
} from "lucide-react";
import { degrees, branches, batches, getBranchesByDegreeId } from "@/lib/academic-structure-v2";
import { getSubjects } from "@/lib/academic-structure-v2";
import { demoTeachers } from "@/lib/demo-data-v2";

export default function SubjectTeacherAssignmentPage() {
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Assignment Modal State
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [selectedTeacher, setSelectedTeacher] = useState("");

  // Current Academic Year (hardcoded for demo - would come from settings in real app)
  const currentAcademicYear = "2025-2026";

  const availableBranches = selectedDegree ? getBranchesByDegreeId(selectedDegree) : branches;

  // Get all subjects based on filters
  let filteredSubjects = getSubjects();

  // Apply filters
  if (selectedDegree) {
    const degreeBranches = branches.filter((b) => b.degreeId === selectedDegree).map((b) => b.id);
    filteredSubjects = filteredSubjects.filter((s) => degreeBranches.includes(s.branchId));
  }
  if (selectedBranch) {
    filteredSubjects = filteredSubjects.filter((s) => s.branchId === selectedBranch);
  }
  if (selectedSemester) {
    filteredSubjects = filteredSubjects.filter((s) => s.semester === parseInt(selectedSemester));
  }

  // Apply search
  if (searchQuery) {
    filteredSubjects = filteredSubjects.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Get subjects with teacher info
  const subjectsWithTeachers = filteredSubjects.map((subject) => {
    const assignedTeachers = demoTeachers.filter((teacher) =>
      teacher.subjects.some((sub) => sub.subjectId === subject.id)
    );
    return {
      ...subject,
      assignedTeachers,
    };
  });

  const resetFilters = () => {
    setSelectedDegree("");
    setSelectedBranch("");
    setSelectedSemester("");
    setSearchQuery("");
  };

  const hasActiveFilters = selectedDegree || selectedBranch || selectedSemester || searchQuery;

  // Statistics
  const totalSubjects = filteredSubjects.length;
  const assignedCount = subjectsWithTeachers.filter((s) => s.assignedTeachers.length > 0).length;
  const unassignedCount = totalSubjects - assignedCount;
  const totalTeacherAssignments = subjectsWithTeachers.reduce(
    (sum, s) => sum + s.assignedTeachers.length,
    0
  );

  // Get branch and degree names
  const getBranchName = (branchId: string) => {
    return branches.find((b) => b.id === branchId)?.name || "Unknown";
  };

  const getDegreeName = (branchId: string) => {
    const branch = branches.find((b) => b.id === branchId);
    return degrees.find((d) => d.id === branch?.degreeId)?.name || "Unknown";
  };

  // Handle assignment
  const handleAssignSubject = () => {
    if (!selectedSubject || !selectedTeacher) return;

    // In a real app, this would update the database
    alert(`Subject "${selectedSubject.name}" assigned to teacher successfully!`);
    setShowAssignmentModal(false);
    setSelectedSubject(null);
    setSelectedTeacher("");
  };

  // Handle unassign
  const handleUnassignTeacher = (subjectName: string, teacherName: string) => {
    if (confirm(`Are you sure you want to unassign ${teacherName} from ${subjectName}?`)) {
      alert(`${teacherName} unassigned from ${subjectName} successfully!`);
      // In a real app, this would update the database
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Subject-Teacher Assignment</h1>
        <p className="text-gray-600 mt-1">
          Assign subjects to teachers for Academic Year {currentAcademicYear}
        </p>
      </div>

      {/* Summary Cards */}
      {hasActiveFilters && filteredSubjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{totalSubjects}</p>
                <p className="text-sm text-gray-600 mt-1">Total Subjects</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{assignedCount}</p>
                <p className="text-sm text-gray-600 mt-1">Assigned</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">{unassignedCount}</p>
                <p className="text-sm text-gray-600 mt-1">Unassigned</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{totalTeacherAssignments}</p>
                <p className="text-sm text-gray-600 mt-1">Total Assignments</p>
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
              Filter Subjects
            </CardTitle>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by subject name or code..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <p className="text-sm text-gray-600">
            Select degree, branch, and semester to view subjects for easy assignment
          </p>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Subjects List */}
      <Card>
        <CardHeader>
          <CardTitle>Subjects ({subjectsWithTeachers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {subjectsWithTeachers.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900">No subjects found</p>
              <p className="text-sm text-gray-600 mt-1">
                {hasActiveFilters ? "Try adjusting your filters" : "No subjects available"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {subjectsWithTeachers.map((subject) => (
                <div
                  key={subject.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg">{subject.name}</h3>
                        <Badge variant="outline">{subject.code}</Badge>
                        <Badge variant={subject.type === "theory" ? "default" : "secondary"}>
                          {subject.type}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm mb-3">
                        <div>
                          <p className="text-gray-600">Degree:</p>
                          <p className="font-medium">{getDegreeName(subject.branchId)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Branch:</p>
                          <p className="font-medium">{getBranchName(subject.branchId)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Semester:</p>
                          <p className="font-medium">{subject.semester}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Credits:</p>
                          <p className="font-medium">{subject.credits}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Teachers:</p>
                          <p className="font-medium text-primary">{subject.assignedTeachers.length}</p>
                        </div>
                      </div>

                      {subject.assignedTeachers.length > 0 ? (
                        <div>
                          <p className="text-xs text-gray-600 mb-2">Assigned Teachers:</p>
                          <div className="flex flex-wrap gap-2">
                            {subject.assignedTeachers.map((teacher) => (
                              <div
                                key={teacher.id}
                                className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full"
                              >
                                <Users className="w-3 h-3 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">{teacher.name}</span>
                                <span className="text-xs text-blue-600">({teacher.departmentName})</span>
                                <button
                                  onClick={() => handleUnassignTeacher(subject.name, teacher.name)}
                                  className="ml-1 hover:bg-blue-100 rounded-full p-0.5"
                                  title="Unassign teacher"
                                >
                                  <X className="w-3 h-3 text-red-600" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                          <p className="text-sm text-orange-800">
                            ⚠️ No teacher assigned to this subject
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => {
                          setSelectedSubject(subject);
                          setShowAssignmentModal(true);
                        }}
                      >
                        <UserPlus className="w-4 h-4" />
                        Assign Teacher
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assignment Modal */}
      {showAssignmentModal && selectedSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Assign Teacher to Subject</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowAssignmentModal(false);
                  setSelectedSubject(null);
                  setSelectedTeacher("");
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Subject Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-lg mb-2">{selectedSubject.name}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Code:</span>
                  <span className="font-medium ml-2">{selectedSubject.code}</span>
                </div>
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium ml-2 capitalize">{selectedSubject.type}</span>
                </div>
                <div>
                  <span className="text-gray-600">Degree:</span>
                  <span className="font-medium ml-2">{getDegreeName(selectedSubject.branchId)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Branch:</span>
                  <span className="font-medium ml-2">{getBranchName(selectedSubject.branchId)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Semester:</span>
                  <span className="font-medium ml-2">{selectedSubject.semester}</span>
                </div>
                <div>
                  <span className="text-gray-600">Credits:</span>
                  <span className="font-medium ml-2">{selectedSubject.credits}</span>
                </div>
              </div>
            </div>

            {/* Currently Assigned Teachers */}
            {selectedSubject.assignedTeachers.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Currently Assigned:</h4>
                <div className="space-y-2">
                  {selectedSubject.assignedTeachers.map((teacher: any) => (
                    <div key={teacher.id} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                      <div>
                        <p className="font-medium">{teacher.name}</p>
                        <p className="text-sm text-gray-600">{teacher.departmentName}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleUnassignTeacher(selectedSubject.name, teacher.name)}
                      >
                        <UserMinus className="w-4 h-4" />
                        Unassign
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Select Teacher */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Select Teacher to Assign:</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
              >
                <option value="">Choose a teacher</option>
                {demoTeachers
                  .filter(
                    (t) =>
                      t.status === "active" &&
                      !selectedSubject.assignedTeachers.some((at: any) => at.id === t.id)
                  )
                  .map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} - {teacher.departmentName} ({teacher.designation})
                    </option>
                  ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={handleAssignSubject} disabled={!selectedTeacher} className="flex-1">
                Assign Teacher
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAssignmentModal(false);
                  setSelectedSubject(null);
                  setSelectedTeacher("");
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
