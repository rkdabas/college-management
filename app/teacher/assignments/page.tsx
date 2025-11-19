"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Plus, CheckCircle, Clock, X, Eye, Edit, Trash2, Download, Filter, Search } from "lucide-react";

interface Assignment {
  id: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  submissions: number;
  total: number;
  graded: number;
}

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: "1",
      subject: "Database Management Systems",
      title: "Assignment 3: SQL Queries",
      description: "Write complex SQL queries for the given database schema. Include SELECT, JOIN, and aggregate functions.",
      dueDate: "2025-01-25",
      submissions: 42,
      total: 45,
      graded: 30,
    },
    {
      id: "2",
      subject: "Operating Systems",
      title: "Assignment 2: Process Scheduling",
      description: "Implement and compare different process scheduling algorithms (FCFS, SJF, Round Robin).",
      dueDate: "2025-01-28",
      submissions: 38,
      total: 45,
      graded: 0,
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const [newAssignment, setNewAssignment] = useState({
    subject: "",
    title: "",
    description: "",
    dueDate: "",
  });

  const subjects = Array.from(new Set(assignments.map(a => a.subject)));

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = !selectedSubject || assignment.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const assignment: Assignment = {
      id: String(assignments.length + 1),
      subject: newAssignment.subject,
      title: newAssignment.title,
      description: newAssignment.description,
      dueDate: newAssignment.dueDate,
      submissions: 0,
      total: 45,
      graded: 0,
    };
    setAssignments([...assignments, assignment]);
    setShowCreateModal(false);
    setNewAssignment({ subject: "", title: "", description: "", dueDate: "" });
    alert("Assignment created successfully!");
  };

  const handleEdit = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setNewAssignment({
      subject: assignment.subject,
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
    });
    setShowEditModal(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    setAssignments(assignments.map(a =>
      a.id === selectedAssignment.id
        ? { ...a, ...newAssignment }
        : a
    ));
    setShowEditModal(false);
    setSelectedAssignment(null);
    setNewAssignment({ subject: "", title: "", description: "", dueDate: "" });
    alert("Assignment updated successfully!");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this assignment?")) {
      setAssignments(assignments.filter(a => a.id !== id));
    }
  };

  const mockSubmissions = [
    { id: "1", student: "Rahul Sharma", rollNo: "21CSE001", submittedDate: "2025-01-24", status: "graded", grade: "A" },
    { id: "2", student: "Priya Verma", rollNo: "21CSE002", submittedDate: "2025-01-24", status: "pending", grade: null },
    { id: "3", student: "Amit Kumar", rollNo: "21CSE003", submittedDate: "2025-01-25", status: "pending", grade: null },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignments</h1>
          <p className="text-gray-600">Create and manage assignments for your classes</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Assignments</p>
              <p className="text-3xl font-bold text-gray-900">{assignments.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Submissions</p>
              <p className="text-3xl font-bold text-gray-900">
                {assignments.reduce((sum, a) => sum + a.submissions, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Pending Grading</p>
              <p className="text-3xl font-bold text-gray-900">
                {assignments.reduce((sum, a) => sum + (a.submissions - a.graded), 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Graded</p>
              <p className="text-3xl font-bold text-gray-900">
                {assignments.reduce((sum, a) => sum + a.graded, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline">{assignment.subject}</Badge>
                    <Badge>Due: {new Date(assignment.dueDate).toLocaleDateString()}</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{assignment.title}</h3>
                  <p className="text-gray-600 mb-4">{assignment.description}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Submissions: {assignment.submissions}/{assignment.total}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Graded: {assignment.graded}/{assignment.submissions}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedAssignment(assignment);
                    setShowSubmissionsModal(true);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Submissions ({assignment.submissions})
                </Button>
                <Button variant="outline" onClick={() => {
                  setSelectedAssignment(assignment);
                  setShowSubmissionsModal(true);
                }}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Grade ({assignment.submissions - assignment.graded} pending)
                </Button>
                <Button variant="outline" onClick={() => handleEdit(assignment)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" onClick={() => handleDelete(assignment.id)} className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Create New Assignment</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowCreateModal(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={newAssignment.subject}
                    onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="title">Assignment Title *</Label>
                  <Input
                    id="title"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                    rows={4}
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Assignment
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Assignment Modal */}
      {showEditModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Edit Assignment</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => {
                  setShowEditModal(false);
                  setSelectedAssignment(null);
                }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="edit-subject">Subject *</Label>
                  <Input
                    id="edit-subject"
                    value={newAssignment.subject}
                    onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-title">Assignment Title *</Label>
                  <Input
                    id="edit-title"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description *</Label>
                  <textarea
                    id="edit-description"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                    rows={4}
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-dueDate">Due Date *</Label>
                  <Input
                    id="edit-dueDate"
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Update Assignment
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setShowEditModal(false);
                    setSelectedAssignment(null);
                  }}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Submissions Modal */}
      {showSubmissionsModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Submissions - {selectedAssignment.title}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => {
                  setShowSubmissionsModal(false);
                  setSelectedAssignment(null);
                }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockSubmissions.map((submission) => (
                  <div key={submission.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{submission.student}</h4>
                        <p className="text-sm text-gray-600">{submission.rollNo}</p>
                        <p className="text-xs text-gray-500">Submitted: {new Date(submission.submittedDate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {submission.status === "graded" && (
                          <Badge variant="success">Grade: {submission.grade}</Badge>
                        )}
                        {submission.status === "pending" && (
                          <Badge variant="outline">Pending</Badge>
                        )}
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {submission.status === "pending" && (
                          <Button size="sm">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Grade
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
