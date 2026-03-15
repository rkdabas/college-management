"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Plus,
  CheckCircle,
  Clock,
  X,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";

interface Assignment {
  id: string;
  subjectId: string;
  subject: { id: string; name: string; code: string };
  title: string;
  description: string;
  dueDate: string;
  submissionCount?: number;
  submissions?: Array<{
    id: string;
    studentId: string;
    student: { id: string; name: string; rollNo: string | null };
    submittedAt: string;
    status: string;
    grade?: string | null;
    marks?: number | null;
    feedback?: string | null;
  }>;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  semester: number;
  batch: number;
}

export default function TeacherAssignmentsPage() {
  const { user } = useAuthStore();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(
    null
  );
  const [submissionsData, setSubmissionsData] = useState<Assignment | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newAssignment, setNewAssignment] = useState({
    subjectId: "",
    title: "",
    description: "",
    dueDate: "",
  });

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([
      fetch(`/api/assignments?teacherId=${user.id}`).then((r) => r.json()),
      fetch(`/api/subjects?teacherId=${user.id}`).then((r) => r.json()),
    ])
      .then(([assignmentsData, subjectsData]) => {
        setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
        setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  const subjectNames = Array.from(
    new Set(assignments.map((a) => a.subject?.name).filter(Boolean))
  );

  const filteredAssignments = assignments.filter((assignment) => {
    const subName = assignment.subject?.name || "";
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      !selectedSubject || subName === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !newAssignment.subjectId) return;
    setSaving(true);
    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAssignment,
          teacherId: user.id,
        }),
      });
      const created = await res.json();
      if (res.ok) {
        setAssignments((prev) => [created, ...prev]);
        setShowCreateModal(false);
        setNewAssignment({ subjectId: "", title: "", description: "", dueDate: "" });
        alert("Assignment created successfully!");
      } else {
        alert(created.error || "Failed to create assignment.");
      }
    } catch {
      alert("Failed to create assignment.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setNewAssignment({
      subjectId: assignment.subjectId,
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate?.split("T")[0] || "",
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/assignments/${selectedAssignment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newAssignment.title,
          description: newAssignment.description,
          dueDate: newAssignment.dueDate,
        }),
      });
      const updated = await res.json();
      if (res.ok) {
        setAssignments((prev) =>
          prev.map((a) => (a.id === selectedAssignment.id ? updated : a))
        );
        setShowEditModal(false);
        setSelectedAssignment(null);
        setNewAssignment({ subjectId: "", title: "", description: "", dueDate: "" });
        alert("Assignment updated successfully!");
      } else {
        alert(updated.error || "Failed to update assignment.");
      }
    } catch {
      alert("Failed to update assignment.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;
    try {
      const res = await fetch(`/api/assignments/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAssignments((prev) => prev.filter((a) => a.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete assignment.");
      }
    } catch {
      alert("Failed to delete assignment.");
    }
  };

  const fetchSubmissions = async (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmissionsModal(true);
    try {
      const res = await fetch(`/api/assignments/${assignment.id}`);
      const data = await res.json();
      setSubmissionsData(res.ok ? data : null);
    } catch {
      setSubmissionsData(null);
    }
  };

  const submissions = submissionsData?.submissions || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-500">Loading assignments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Assignments
          </h1>
          <p className="text-gray-600">
            Create and manage assignments for your classes
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Assignments</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {assignments.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Submissions</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {assignments.reduce(
                  (sum, a) => sum + (a.submissionCount ?? 0),
                  0
                )}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Pending Grading</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {assignments.reduce(
                  (sum, a) => sum + (a.submissionCount ?? 0),
                  0
                )}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Graded</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">—</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                {subjectNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredAssignments.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No assignments yet</p>
            <Button
              className="mt-4"
              onClick={() => setShowCreateModal(true)}
            >
              Create Assignment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <Badge variant="outline">
                        {assignment.subject?.name || "—"}
                      </Badge>
                      <Badge>
                        Due:{" "}
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </Badge>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      {assignment.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {assignment.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Submissions: {assignment.submissionCount ?? 0}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      onClick={() => fetchSubmissions(assignment)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Submissions (
                      {assignment.submissionCount ?? 0})
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(assignment)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDelete(assignment.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Create New Assignment</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCreateModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <select
                    id="subject"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                    value={newAssignment.subjectId}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        subjectId: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} - Sem {s.semester} (Batch {s.batch})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="title">Assignment Title *</Label>
                  <Input
                    id="title"
                    value={newAssignment.title}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        title: e.target.value,
                      })
                    }
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
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        dueDate: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={saving}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Assignment
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {showEditModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Edit Assignment</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedAssignment(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Assignment Title *</Label>
                  <Input
                    id="edit-title"
                    value={newAssignment.title}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        title: e.target.value,
                      })
                    }
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
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-dueDate">Due Date *</Label>
                  <Input
                    id="edit-dueDate"
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        dueDate: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={saving}>
                    <Edit className="w-4 h-4 mr-2" />
                    Update Assignment
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedAssignment(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {showSubmissionsModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Submissions - {selectedAssignment.title}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowSubmissionsModal(false);
                    setSelectedAssignment(null);
                    setSubmissionsData(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {submissions.length > 0 ? (
                  submissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {submission.student?.name || "—"}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {submission.student?.rollNo || submission.studentId}
                          </p>
                          <p className="text-xs text-gray-500">
                            Submitted:{" "}
                            {new Date(
                              submission.submittedAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {submission.status === "graded" ||
                          submission.grade ? (
                            <Badge variant="outline">
                              Grade: {submission.grade || "—"}
                            </Badge>
                          ) : (
                            <Badge variant="outline">Pending</Badge>
                          )}
                          <a href={`/teacher/grading?assignmentId=${selectedAssignment.id}`}>
                            <Button variant="outline" size="sm">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Grade
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 py-4">No submissions yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
