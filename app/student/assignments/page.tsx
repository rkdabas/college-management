"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload, Clock, AlertCircle, X, Eye, Download, Filter, Search } from "lucide-react";
import { useAuthStore } from "@/lib/store";

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  subject: { id: string; name: string; code: string };
  submissionCount?: number;
  submitted?: boolean;
}

export default function StudentAssignmentsPage() {
  const { user } = useAuthStore();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchAssignments = useCallback(() => {
    if (!user?.id) return;
    fetch(`/api/assignments?studentId=${user.id}`)
      .then((res) => res.ok ? res.json() : [])
      .then(setAssignments)
      .catch(() => setAssignments([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const getStatus = (a: Assignment): "pending" | "in-progress" | "submitted" | "overdue" => {
    if (a.submitted) return "submitted";
    const due = new Date(a.dueDate);
    const now = new Date();
    if (due < now) return "overdue";
    return "pending";
  };

  const subjects = Array.from(new Set(assignments.map((a) => a.subject.name)));
  const filteredAssignments = assignments.filter((a) => {
    const status = getStatus(a);
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subject.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || status === selectedStatus;
    const matchesSubject = !selectedSubject || a.subject.name === selectedSubject;
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const handleSubmit = async (assignmentId: string) => {
    if (!user?.id) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/assignments/${assignmentId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: user.id }),
      });
      if (res.ok) {
        setAssignments((prev) =>
          prev.map((a) => (a.id === assignmentId ? { ...a, submitted: true } : a))
        );
        setShowSubmitModal(false);
        setSelectedAssignment(null);
        alert("Assignment submitted successfully!");
      } else {
        const err = await res.json();
        alert(err.error ?? "Failed to submit");
      }
    } catch {
      alert("Failed to submit assignment");
    } finally {
      setSubmitting(false);
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Assignments</h1>
        <p className="text-gray-600">View and submit your assignments</p>
      </div>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                {assignments.filter((a) => getStatus(a) === "pending" || getStatus(a) === "in-progress").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Submitted</p>
              <p className="text-3xl font-bold text-gray-900">
                {assignments.filter((a) => getStatus(a) === "submitted").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Overdue</p>
              <p className="text-3xl font-bold text-gray-900">
                {assignments.filter((a) => getStatus(a) === "overdue").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {filteredAssignments.map((assignment) => {
          const status = getStatus(assignment);
          return (
            <Card key={assignment.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <Badge variant="outline">{assignment.subject.name}</Badge>
                      {getStatusBadge(status)}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{assignment.title}</h3>
                    <p className="text-gray-600 mb-4">{assignment.description ?? "No description"}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {(status === "pending" || status === "in-progress") && (
                    <>
                      <Button
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setShowSubmitModal(true);
                        }}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Submit Assignment
                      </Button>
                      <Button variant="outline" onClick={() => { setSelectedAssignment(assignment); setShowDetailsModal(true); }}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </>
                  )}
                  {status === "submitted" && (
                    <Button variant="outline" onClick={() => { setSelectedAssignment(assignment); setShowDetailsModal(true); }}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Submission
                    </Button>
                  )}
                  {status === "overdue" && (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setShowSubmitModal(true);
                      }}
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Submit Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
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

      {showSubmitModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Submit Assignment</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowSubmitModal(false);
                    setSelectedAssignment(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">{selectedAssignment.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{selectedAssignment.description ?? ""}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <Label htmlFor="file">Upload Assignment File *</Label>
                  <Input id="file" type="file" className="cursor-pointer mt-2" />
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
                  <Button
                    className="flex-1"
                    onClick={() => handleSubmit(selectedAssignment.id)}
                    disabled={submitting}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {submitting ? "Submitting..." : "Submit Assignment"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowSubmitModal(false);
                      setSelectedAssignment(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showDetailsModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Assignment Details</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedAssignment(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="outline">{selectedAssignment.subject.name}</Badge>
                    {getStatusBadge(getStatus(selectedAssignment))}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedAssignment.title}</h3>
                  <p className="text-gray-600 mb-4">{selectedAssignment.description ?? ""}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {(getStatus(selectedAssignment) === "pending" ||
                  getStatus(selectedAssignment) === "in-progress" ||
                  getStatus(selectedAssignment) === "overdue") && (
                  <div className="mt-4">
                    <Button
                      onClick={() => {
                        setShowDetailsModal(false);
                        setSelectedAssignment(selectedAssignment);
                        setShowSubmitModal(true);
                      }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Submit Assignment
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
