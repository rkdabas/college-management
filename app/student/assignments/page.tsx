"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload, CheckCircle, Clock, AlertCircle, X, Eye, Download, Filter, Search } from "lucide-react";

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState([
    {
      id: "1",
      subject: "Database Management Systems",
      title: "Assignment 3: SQL Queries",
      description: "Write complex SQL queries for the given database schema",
      dueDate: "2025-01-25",
      status: "submitted",
      submittedDate: "2025-01-24",
      grade: "A",
    },
    {
      id: "2",
      subject: "Operating Systems",
      title: "Assignment 2: Process Scheduling",
      description: "Implement and compare different process scheduling algorithms",
      dueDate: "2025-01-28",
      status: "pending",
    },
    {
      id: "3",
      subject: "AI/ML",
      title: "Project: Image Classification",
      description: "Build a CNN model for image classification",
      dueDate: "2025-02-05",
      status: "in-progress",
    },
    {
      id: "4",
      subject: "Software Engineering",
      title: "Assignment 1: UML Diagrams",
      description: "Create UML diagrams for the given system",
      dueDate: "2025-01-20",
      status: "overdue",
    },
  ]);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const subjects = Array.from(new Set(assignments.map(a => a.subject)));

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || assignment.status === selectedStatus;
    const matchesSubject = !selectedSubject || assignment.subject === selectedSubject;
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const handleSubmit = (assignmentId: string) => {
    setAssignments(assignments.map(a => 
      a.id === assignmentId 
        ? { ...a, status: "submitted", submittedDate: new Date().toISOString().split("T")[0] }
        : a
    ));
    setShowSubmitModal(false);
    setSelectedAssignment(null);
    alert("Assignment submitted successfully!");
  };

  const handleViewDetails = (assignment: any) => {
    setSelectedAssignment(assignment);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <Badge variant="success">Submitted</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "in-progress":
        return <Badge>In Progress</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Assignments</h1>
        <p className="text-gray-600">View and submit your assignments</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="submitted">Submitted</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-3xl font-bold text-gray-900">{assignments.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-gray-900">
                {assignments.filter(a => a.status === "pending").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Submitted</p>
              <p className="text-3xl font-bold text-gray-900">
                {assignments.filter(a => a.status === "submitted").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Overdue</p>
              <p className="text-3xl font-bold text-gray-900">
                {assignments.filter(a => a.status === "overdue").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {filteredAssignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline">{assignment.subject}</Badge>
                    {getStatusBadge(assignment.status)}
                    {assignment.grade && (
                      <Badge variant="success">Grade: {assignment.grade}</Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{assignment.title}</h3>
                  <p className="text-gray-600 mb-4">{assignment.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                    {assignment.submittedDate && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Submitted: {new Date(assignment.submittedDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {assignment.status === "pending" || assignment.status === "in-progress" ? (
                  <>
                    <Button onClick={() => {
                      setSelectedAssignment(assignment);
                      setShowSubmitModal(true);
                    }}>
                      <Upload className="w-4 h-4 mr-2" />
                      Submit Assignment
                    </Button>
                    <Button variant="outline" onClick={() => handleViewDetails(assignment)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </>
                ) : assignment.status === "submitted" ? (
                  <>
                    <Button variant="outline" onClick={() => handleViewDetails(assignment)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Submission
                    </Button>
                    {assignment.grade && (
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download Feedback
                      </Button>
                    )}
                  </>
                ) : (
                  <Button variant="destructive" onClick={() => {
                    setSelectedAssignment(assignment);
                    setShowSubmitModal(true);
                  }}>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Submit Now
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No assignments found</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Assignment Modal */}
      {showSubmitModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Submit Assignment</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => {
                  setShowSubmitModal(false);
                  setSelectedAssignment(null);
                }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">{selectedAssignment.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{selectedAssignment.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <Label htmlFor="file">Upload Assignment File *</Label>
                  <Input
                    id="file"
                    type="file"
                    className="cursor-pointer mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="comments">Comments (Optional)</Label>
                  <textarea
                    id="comments"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 mt-2"
                    rows={4}
                    placeholder="Add any comments or notes about your submission..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => handleSubmit(selectedAssignment.id)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Assignment
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowSubmitModal(false);
                    setSelectedAssignment(null);
                  }}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Details Modal */}
      {showDetailsModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Assignment Details</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedAssignment(null);
                }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="outline">{selectedAssignment.subject}</Badge>
                    {getStatusBadge(selectedAssignment.status)}
                    {selectedAssignment.grade && (
                      <Badge variant="success">Grade: {selectedAssignment.grade}</Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedAssignment.title}</h3>
                  <p className="text-gray-600 mb-4">{selectedAssignment.description}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  {selectedAssignment.submittedDate && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Submitted Date:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(selectedAssignment.submittedDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {selectedAssignment.grade && (
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <span className="text-emerald-700 font-semibold">Grade:</span>
                      <span className="font-bold text-emerald-900 text-lg">{selectedAssignment.grade}</span>
                    </div>
                  )}
                </div>
                {selectedAssignment.status === "submitted" && (
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Submitted File
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

