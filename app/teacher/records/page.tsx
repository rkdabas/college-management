"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, X } from "lucide-react";
import { useAuthStore } from "@/lib/store";

interface TeacherRecord {
  id: string;
  type: string;
  title: string;
  description: string;
  subject: string;
  semester: number;
  batch: number;
  submittedAt: string;
  status: string;
  adminRemarks?: string | null;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  semester: number;
  batch: number;
}

export default function TeacherRecordsPage() {
  const { user } = useAuthStore();
  const [records, setRecords] = useState<TeacherRecord[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newRecord, setNewRecord] = useState({
    type: "ATTENDANCE",
    title: "",
    description: "",
    subject: "",
    semester: "",
    batch: "",
  });

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([
      fetch(`/api/records?submitterId=${user.id}`).then((r) => r.json()),
      fetch(`/api/subjects?teacherId=${user.id}`).then((r) => r.json()),
    ])
      .then(([recs, subs]) => {
        setRecords(Array.isArray(recs) ? recs : []);
        setSubjects(Array.isArray(subs) ? subs : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  const recordTypeColors: Record<string, string> = {
    ATTENDANCE: "bg-sky-100 text-sky-700",
    GRADES: "bg-emerald-100 text-emerald-700",
    ASSIGNMENTS: "bg-amber-100 text-amber-700",
    EXTRACURRICULAR: "bg-pink-100 text-pink-700",
    OTHER: "bg-gray-100 text-gray-700",
  };

  const handleSubmitRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setSaving(true);
    try {
      const res = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newRecord,
          semester: parseInt(newRecord.semester),
          batch: parseInt(newRecord.batch),
          submitterId: user.id,
        }),
      });
      const created = await res.json();
      if (res.ok) {
        setRecords((prev) => [created, ...prev]);
        setShowSubmitModal(false);
        setNewRecord({
          type: "ATTENDANCE",
          title: "",
          description: "",
          subject: "",
          semester: "",
          batch: "",
        });
        alert("Record submitted successfully! Admin will review it.");
      } else {
        alert(created.error || "Failed to submit record.");
      }
    } catch {
      alert("Failed to submit record.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-500">Loading records...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Submit Records
          </h1>
          <p className="text-gray-600">
            Submit records and reports to admin for review
          </p>
        </div>
        <Button onClick={() => setShowSubmitModal(true)}>
          <Send className="w-4 h-4 mr-2" />
          Submit Record
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Records</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {records.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Approved</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {records.filter((r) => r.status === "APPROVED").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {records.filter((r) => r.status === "PENDING").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Rejected</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {records.filter((r) => r.status === "REJECTED").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submitted Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {records.length === 0 ? (
              <p className="text-gray-500 py-8 text-center">
                No records submitted yet
              </p>
            ) : (
              records.map((record) => (
                <div
                  key={record.id}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="font-bold text-gray-900">{record.title}</h3>
                    <Badge
                      className={
                        recordTypeColors[record.type] ||
                        recordTypeColors.OTHER
                      }
                    >
                      {record.type}
                    </Badge>
                    <Badge
                      variant={
                        record.status === "APPROVED"
                          ? "outline"
                          : record.status === "PENDING"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {record.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {record.description}
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-4 text-xs text-gray-500">
                    <span>{record.subject}</span>
                    <span>
                      Sem {record.semester} | Batch {record.batch}
                    </span>
                    <span>
                      Submitted:{" "}
                      {new Date(record.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {record.adminRemarks && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs font-semibold text-blue-900 mb-1">
                        Admin Remarks:
                      </p>
                      <p className="text-xs text-blue-700">
                        {record.adminRemarks}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Submit New Record</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSubmitModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitRecord} className="space-y-4">
                <div>
                  <Label htmlFor="type">Record Type *</Label>
                  <select
                    id="type"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                    value={newRecord.type}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, type: e.target.value })
                    }
                    required
                  >
                    <option value="ATTENDANCE">Attendance Report</option>
                    <option value="GRADES">Grades Report</option>
                    <option value="ASSIGNMENTS">Assignment Report</option>
                    <option value="EXTRACURRICULAR">
                      Extracurricular Report
                    </option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <select
                    id="subject"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                    value={newRecord.subject}
                    onChange={(e) => {
                      const sub = subjects.find(
                        (s) => s.name === e.target.value
                      );
                      setNewRecord({
                        ...newRecord,
                        subject: e.target.value,
                        semester: sub ? String(sub.semester) : "",
                        batch: sub ? String(sub.batch) : "",
                      });
                    }}
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} - Sem {s.semester} (Batch {s.batch})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="title">Record Title *</Label>
                  <Input
                    id="title"
                    value={newRecord.title}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, title: e.target.value })
                    }
                    placeholder="e.g., Monthly Attendance Report - January 2025"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                    rows={3}
                    value={newRecord.description}
                    onChange={(e) =>
                      setNewRecord({
                        ...newRecord,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={saving}>
                    <Send className="w-4 h-4 mr-2" />
                    Submit to Admin
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowSubmitModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
