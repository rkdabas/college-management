"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen, Users, Calendar } from "lucide-react";
import { degrees, branches, batches, getBranchesByDegreeId, getBranchDetails } from "@/lib/academic-structure-v2";
import { demoStudents } from "@/lib/demo-data-v2";

export default function AcademicStructurePage() {
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  // Get branches for selected degree
  const availableBranches = selectedDegree ? getBranchesByDegreeId(selectedDegree) : [];

  // Get branch details if selected
  const branchDetails = selectedBranch ? getBranchDetails(selectedBranch, parseInt(selectedBatch)) : null;

  // Count students for each branch
  const getBranchStudentCount = (branchId: string) => {
    return demoStudents.filter(
      (s) => s.branchId === branchId && s.batch.toString() === selectedBatch
    ).length;
  };

  const resetFilters = () => {
    setSelectedDegree("");
    setSelectedBatch("");
    setSelectedBranch(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Academic Structure</h1>
        <p className="text-gray-600 mt-1">Manage your institution's academic hierarchy</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Degrees</p>
                <p className="text-3xl font-bold mt-1">{degrees.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Branches</p>
                <p className="text-3xl font-bold mt-1">{branches.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Batches</p>
                <p className="text-3xl font-bold mt-1">{batches.filter((b) => b.isActive).length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Explore Academic Structure</CardTitle>
            {(selectedDegree || selectedBatch) && (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset Selection
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Select a degree and batch to view all branches
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Degree</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedDegree}
                onChange={(e) => {
                  setSelectedDegree(e.target.value);
                  setSelectedBranch(null);
                }}
              >
                <option value="">Choose a degree</option>
                {degrees.map((degree) => (
                  <option key={degree.id} value={degree.id}>
                    {degree.name} ({degree.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Batch</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedBatch}
                onChange={(e) => {
                  setSelectedBatch(e.target.value);
                  setSelectedBranch(null);
                }}
              >
                <option value="">Choose a batch</option>
                {batches
                  .filter((b) => b.isActive)
                  .map((batch) => (
                    <option key={batch.id} value={batch.year}>
                      Batch {batch.year} (Graduation: {batch.graduationYear})
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Show Branches as Cards */}
      {selectedDegree && selectedBatch && !selectedBranch && (
        <Card>
          <CardHeader>
            <CardTitle>
              Branches in {degrees.find((d) => d.id === selectedDegree)?.name} - Batch {selectedBatch}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {availableBranches.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900">Nothing found</p>
                <p className="text-sm text-gray-600 mt-1">
                  No branches available for this degree and batch combination
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableBranches.map((branch) => {
                  const studentCount = getBranchStudentCount(branch.id);
                  return (
                    <div
                      key={branch.id}
                      className="border-2 rounded-lg p-5 hover:shadow-lg transition-all cursor-pointer hover:border-primary"
                      onClick={() => setSelectedBranch(branch.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <Badge variant="outline">{branch.code}</Badge>
                      </div>

                      <h3 className="font-bold text-lg mb-2">{branch.name}</h3>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Students:</span>
                          <span className="font-semibold text-primary">{studentCount}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Capacity:</span>
                          <span className="font-semibold">{branch.capacity}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className={`rounded-full h-2 ${
                              (studentCount / branch.capacity) * 100 >= 90
                                ? "bg-red-500"
                                : (studentCount / branch.capacity) * 100 >= 75
                                ? "bg-orange-500"
                                : "bg-green-500"
                            }`}
                            style={{
                              width: `${Math.min((studentCount / branch.capacity) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-1">
                          {((studentCount / branch.capacity) * 100).toFixed(1)}% filled
                        </p>
                      </div>

                      <Button variant="outline" className="w-full mt-4" onClick={() => setSelectedBranch(branch.id)}>
                        View Details
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Branch Details */}
      {selectedBranch && branchDetails && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Branch Details</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setSelectedBranch(null)}>
                Back to Branches
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Branch Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{branchDetails.branch.name}</h2>
                  <p className="text-gray-600">
                    {degrees.find((d) => d.id === selectedDegree)?.name} - Batch {selectedBatch}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600">Branch Code</p>
                  <p className="text-xl font-bold text-blue-600 mt-1">{branchDetails.branch.code}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-xl font-bold text-green-600 mt-1">{branchDetails.studentCount}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600">Capacity</p>
                  <p className="text-xl font-bold text-purple-600 mt-1">{branchDetails.branch.capacity}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="text-xl font-bold text-orange-600 mt-1">
                    {degrees.find((d) => d.id === selectedDegree)?.duration} Years
                  </p>
                </div>
              </div>
            </div>

            {/* Program Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Program Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Degree:</span>
                  <span className="font-medium">{degrees.find((d) => d.id === selectedDegree)?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Branch:</span>
                  <span className="font-medium">{branchDetails.branch.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Semesters:</span>
                  <span className="font-medium">
                    {degrees.find((d) => d.id === selectedDegree)?.totalSemesters}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Batch Year:</span>
                  <span className="font-medium">{selectedBatch}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Expected Graduation:</span>
                  <span className="font-medium">
                    {batches.find((b) => b.year.toString() === selectedBatch)?.graduationYear}
                  </span>
                </div>
              </div>
            </div>

            {/* Semester-wise Student Distribution */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Semester-wise Student Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.from(
                  { length: degrees.find((d) => d.id === selectedDegree)?.totalSemesters || 8 },
                  (_, i) => i + 1
                ).map((sem) => {
                  const semStudents = demoStudents.filter(
                    (s) =>
                      s.branchId === selectedBranch &&
                      s.batch.toString() === selectedBatch &&
                      s.semester === sem
                  ).length;
                  return (
                    <div key={sem} className="border rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600">Semester {sem}</p>
                      <p className="text-2xl font-bold text-primary mt-1">{semStudents}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Degrees List */}
      {!selectedDegree && !selectedBatch && (
        <Card>
          <CardHeader>
            <CardTitle>All Degrees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {degrees.map((degree) => {
                const degreeBranches = branches.filter((b) => b.degreeId === degree.id);
                const degreeStudents = demoStudents.filter((s) => s.degreeId === degree.id);
                return (
                  <div key={degree.id} className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="outline">{degree.code}</Badge>
                    </div>

                    <h3 className="font-bold text-lg mb-2">{degree.name}</h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{degree.duration} years</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Semesters:</span>
                        <span className="font-medium">{degree.totalSemesters}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Branches:</span>
                        <span className="font-medium">{degreeBranches.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total Students:</span>
                        <span className="font-semibold text-primary">{degreeStudents.length}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
