"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Award,
  Eye,
  X,
  CheckCircle,
  Download,
  Filter,
  Search,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { useSearchParams } from "next/navigation";

interface GradingItem {
  id: string;
  assignmentId: string;
  studentId: string;
  student: { id: string; name: string; rollNo: string | null };
  submittedAt: string;
  status: string;
  grade?: string | null;
  marks?: number | null;
  feedback?: string | null;
  assignment?: { title: string; subject?: { name: string } };
}

export default function TeacherGradingPage() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const assignmentIdParam = searchParams.get("assignmentId");

  const [assignments, setAssignments] = useState<
    Array<{
      id: string;
      title: string;
      subject?: { name: string };
      submissions?: GradingItem[];
    }>
  >([]);
  const [gradingItems, setGradingItems] = useState<GradingItem[]>([]);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GradingItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [gradeData, setGradeData] = useState({
    marks: "",
    grade: "",
    feedback: "",
  });

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/assignments?teacherId=${user.id}`)
      .then((res) => res.json())
      .then(async (list: typeof assignments) => {
        const arr = Array.isArray(list) ? list : [];
        setAssignments(arr);
        const filtered = assignmentIdParam
          ? arr.filter((a) => a.id === assignmentIdParam)
          : arr;
        const allItems: GradingItem[] = [];
        for (const a of filtered) {
          const res = await fetch(`/api/assignments/${a.id}`);
          const detail = await res.json();
          if (detail.submissions) {
            detail.submissions.forEach((s: GradingItem) => {
              allItems.push({
                ...s,
                assignmentId: detail.id,
                assignment: {
                  title: detail.title,
                  subject: detail.subject,
                },
              });
            });
          }
        }
        setGradingItems(allItems);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id, assignmentIdParam]);

  const subjects = Array.from(
    new Set(
      gradingItems
        .map((i) => i.assignment?.subject?.name)
        .filter(Boolean) as string[]
    )
  );

  const filteredItems = gradingItems.filter((item) => {
    const studentName = item.student?.name || "";
    const rollNo = item.student?.rollNo || "";
    const assignmentTitle = item.assignment?.title || "";
    const matchesSearch =
      studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      !selectedStatus ||
      (selectedStatus === "pending" &&
        (item.status !== "graded" || !item.grade)) ||
      (selectedStatus === "graded" && (item.status === "graded" || item.grade));
    const matchesSubject =
      !selectedSubject ||
      item.assignment?.subject?.name === selectedSubject;
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const pendingCount = gradingItems.filter(
    (i) => i.status !== "graded" && !i.grade
  ).length;

  const handleGrade = (item: GradingItem) => {
    setSelectedItem(item);
    setGradeData({
      marks: String(item.marks ?? ""),
      grade: item.grade ?? "",
      feedback: item.feedback ?? "",
    });
    setShowGradeModal(true);
  };

  const handleSubmitGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !user?.id) return;
    setSaving(true);
    try {
      const res = await fetch(
        `/api/assignments/${selectedItem.assignmentId}/grade`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: selectedItem.studentId,
            grade: gradeData.grade,
            marks: parseFloat(gradeData.marks) || undefined,
            feedback: gradeData.feedback,
          }),
        }
      );
      const updated = await res.json();
      if (res.ok) {
        setGradingItems((prev) =>
          prev.map((item) =>
            item.studentId === selectedItem.studentId &&
            item.assignmentId === selectedItem.assignmentId
              ? { ...item, ...updated, status: "graded" }
              : item
          )
        );
        setShowGradeModal(false);
        setSelectedItem(null);
        setGradeData({ marks: "", grade: "", feedback: "" });
        alert("Grade submitted successfully!");
      } else {
        alert(updated.error || "Failed to submit grade.");
      }
    } catch {
      alert("Failed to submit grade.");
    } finally {
      setSaving(false);
    }
  };

  const grades = [
    "A+",
    "A",
    "A-",
    "B+",
    "B",
    "B-",
    "C+",
    "C",
    "C-",
    "D",
    "F",
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Grading
        </h1>
        <p className="text-gray-600">
          Grade student assignments and assessments
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Pending</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {pendingCount}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Graded</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {gradingItems.length - pendingCount}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Items</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {gradingItems.length}
              </p>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                {subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Grading</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredItems.length === 0 ? (
              <p className="text-gray-500 py-8 text-center">
                No submissions to grade
              </p>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={`${item.assignmentId}-${item.studentId}`}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <Badge variant="outline">
                          {item.assignment?.subject?.name || "—"}
                        </Badge>
                        <Badge>{item.assignment?.title || "—"}</Badge>
                        <Badge
                          variant={
                            item.status === "graded" || item.grade
                              ? "outline"
                              : "outline"
                          }
                        >
                          {item.status === "graded" || item.grade
                            ? "graded"
                            : "pending"}
                        </Badge>
                        {item.grade && (
                          <Badge variant="outline">
                            Grade: {item.grade}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.student?.name || "—"}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {item.student?.rollNo || item.studentId}
                      </p>
                      <p className="text-xs text-gray-500">
                        Submitted:{" "}
                        {new Date(item.submittedAt).toLocaleDateString()}
                      </p>
                      {item.feedback && (
                        <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs font-semibold text-blue-900 mb-1">
                            Feedback:
                          </p>
                          <p className="text-xs text-blue-700">
                            {item.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          setShowViewModal(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Submission
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        title="Download not implemented"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      {(item.status !== "graded" || !item.grade) && (
                        <Button
                          size="sm"
                          onClick={() => handleGrade(item)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Grade Now
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {showGradeModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Grade Assignment</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowGradeModal(false);
                    setSelectedItem(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900">
                  {selectedItem.student?.name} (
                  {selectedItem.student?.rollNo || selectedItem.studentId})
                </p>
                <p className="text-sm text-gray-600">
                  {selectedItem.assignment?.title}
                </p>
              </div>
              <form onSubmit={handleSubmitGrade} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="marks">Marks (out of 20) *</Label>
                    <Input
                      id="marks"
                      type="number"
                      min="0"
                      max="20"
                      value={gradeData.marks}
                      onChange={(e) =>
                        setGradeData({ ...gradeData, marks: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="grade">Grade *</Label>
                    <select
                      id="grade"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                      value={gradeData.grade}
                      onChange={(e) =>
                        setGradeData({ ...gradeData, grade: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Grade</option>
                      {grades.map((g) => (
                        <option key={g} value={g}>
                          {g}
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
                    onChange={(e) =>
                      setGradeData({ ...gradeData, feedback: e.target.value })
                    }
                    placeholder="Provide feedback on the submission..."
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={saving}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Grade
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowGradeModal(false);
                      setSelectedItem(null);
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

      {showViewModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>View Submission</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedItem(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-900">
                    {selectedItem.student?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedItem.student?.rollNo || selectedItem.studentId}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedItem.assignment?.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Submitted:{" "}
                    {new Date(
                      selectedItem.submittedAt
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Submission File:</p>
                  <Button variant="outline" size="sm" disabled>
                    <Download className="w-4 h-4 mr-2" />
                    Download Submission
                  </Button>
                </div>
                {(selectedItem.status === "graded" || selectedItem.grade) && (
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="font-semibold text-emerald-900 mb-2">
                      Grading Details:
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="text-emerald-700">
                        Marks: {selectedItem.marks ?? "—"}/20
                      </span>
                      <span className="text-emerald-700">
                        Grade: {selectedItem.grade ?? "—"}
                      </span>
                    </div>
                    {selectedItem.feedback && (
                      <div className="mt-2">
                        <p className="text-xs font-semibold text-emerald-900 mb-1">
                          Feedback:
                        </p>
                        <p className="text-xs text-emerald-700">
                          {selectedItem.feedback}
                        </p>
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
