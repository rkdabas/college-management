"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, FileText, Eye, X, CheckCircle, Download, Filter, Search } from "lucide-react";

interface GradingItem {
  id: string;
  subject: string;
  assignment: string;
  student: string;
  rollNo: string;
  submittedDate: string;
  status: "pending" | "graded";
  grade?: string;
  marks?: number;
  feedback?: string;
}

export default function TeacherGradingPage() {
  const [gradingItems, setGradingItems] = useState<GradingItem[]>([
    {
      id: "1",
      subject: "Database Management Systems",
      assignment: "Assignment 3: SQL Queries",
      student: "Rahul Sharma",
      rollNo: "21CSE001",
      submittedDate: "2025-01-24",
      status: "graded",
      grade: "A",
      marks: 18,
      feedback: "Excellent work! All queries are correct and well-structured.",
    },
    {
      id: "2",
      subject: "Database Management Systems",
      assignment: "Assignment 3: SQL Queries",
      student: "Priya Verma",
      rollNo: "21CSE002",
      submittedDate: "2025-01-24",
      status: "pending",
    },
    {
      id: "3",
      subject: "Database Management Systems",
      assignment: "Assignment 3: SQL Queries",
      student: "Amit Kumar",
      rollNo: "21CSE003",
      submittedDate: "2025-01-25",
      status: "pending",
    },
    {
      id: "4",
      subject: "Operating Systems",
      assignment: "Assignment 2: Process Scheduling",
      student: "Sneha Patel",
      rollNo: "21CSE004",
      submittedDate: "2025-01-26",
      status: "pending",
    },
  ]);

  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GradingItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const [gradeData, setGradeData] = useState({
    marks: "",
    grade: "",
    feedback: "",
  });

  const subjects = Array.from(new Set(gradingItems.map(item => item.subject)));

  const filteredItems = gradingItems.filter((item) => {
    const matchesSearch = item.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.assignment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || item.status === selectedStatus;
    const matchesSubject = !selectedSubject || item.subject === selectedSubject;
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const handleGrade = (item: GradingItem) => {
    setSelectedItem(item);
    setGradeData({ marks: "", grade: "", feedback: "" });
    setShowGradeModal(true);
  };

  const handleSubmitGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    setGradingItems(gradingItems.map(item =>
      item.id === selectedItem.id
        ? { ...item, status: "graded", grade: gradeData.grade, marks: parseInt(gradeData.marks), feedback: gradeData.feedback }
        : item
    ));
    setShowGradeModal(false);
    setSelectedItem(null);
    setGradeData({ marks: "", grade: "", feedback: "" });
    alert("Grade submitted successfully!");
  };

  const grades = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Grading</h1>
        <p className="text-gray-600">Grade student assignments and assessments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Pending</p>
              <p className="text-3xl font-bold text-gray-900">
                {gradingItems.filter(item => item.status === "pending").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Graded</p>
              <p className="text-3xl font-bold text-gray-900">
                {gradingItems.filter(item => item.status === "graded").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Items</p>
              <p className="text-3xl font-bold text-gray-900">{gradingItems.length}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search students..."
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
                <option value="graded">Graded</option>
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

      {/* Grading List */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Grading</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline">{item.subject}</Badge>
                      <Badge>{item.assignment}</Badge>
                      <Badge variant={item.status === "graded" ? "success" : "outline"}>
                        {item.status}
                      </Badge>
                      {item.grade && (
                        <Badge variant="success">Grade: {item.grade}</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.student}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.rollNo}</p>
                    <p className="text-xs text-gray-500">Submitted: {new Date(item.submittedDate).toLocaleDateString()}</p>
                    {item.feedback && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs font-semibold text-blue-900 mb-1">Feedback:</p>
                        <p className="text-xs text-blue-700">{item.feedback}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    setSelectedItem(item);
                    setShowViewModal(true);
                  }}>
                    <Eye className="w-4 h-4 mr-1" />
                    View Submission
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  {item.status === "pending" && (
                    <Button size="sm" onClick={() => handleGrade(item)}>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Grade Now
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grade Modal */}
      {showGradeModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Grade Assignment</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => {
                  setShowGradeModal(false);
                  setSelectedItem(null);
                }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900">{selectedItem.student} ({selectedItem.rollNo})</p>
                <p className="text-sm text-gray-600">{selectedItem.assignment}</p>
              </div>
              <form onSubmit={handleSubmitGrade} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="marks">Marks (out of 20) *</Label>
                    <Input
                      id="marks"
                      type="number"
                      min="0"
                      max="20"
                      value={gradeData.marks}
                      onChange={(e) => setGradeData({ ...gradeData, marks: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="grade">Grade *</Label>
                    <select
                      id="grade"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                      value={gradeData.grade}
                      onChange={(e) => setGradeData({ ...gradeData, grade: e.target.value })}
                      required
                    >
                      <option value="">Select Grade</option>
                      {grades.map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="feedback">Feedback *</Label>
                  <textarea
                    id="feedback"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                    rows={4}
                    value={gradeData.feedback}
                    onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                    placeholder="Provide feedback on the submission..."
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Grade
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setShowGradeModal(false);
                    setSelectedItem(null);
                  }}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Submission Modal */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>View Submission</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => {
                  setShowViewModal(false);
                  setSelectedItem(null);
                }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-900">{selectedItem.student}</p>
                  <p className="text-sm text-gray-600">{selectedItem.rollNo}</p>
                  <p className="text-sm text-gray-600">{selectedItem.assignment}</p>
                  <p className="text-xs text-gray-500 mt-2">Submitted: {new Date(selectedItem.submittedDate).toLocaleDateString()}</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Submission File:</p>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Submission
                  </Button>
                </div>
                {selectedItem.status === "graded" && (
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="font-semibold text-emerald-900 mb-2">Grading Details:</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-emerald-700">Marks: {selectedItem.marks}/20</span>
                      <span className="text-emerald-700">Grade: {selectedItem.grade}</span>
                    </div>
                    {selectedItem.feedback && (
                      <div className="mt-2">
                        <p className="text-xs font-semibold text-emerald-900 mb-1">Feedback:</p>
                        <p className="text-xs text-emerald-700">{selectedItem.feedback}</p>
                      </div>
                    )}
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
