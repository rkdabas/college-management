"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Send, CheckCircle, Clock, X, Upload } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { demoTeachers } from "@/lib/demo-data-v2";

interface Record {
  id: string;
  type: "attendance" | "grades" | "assignments" | "extracurricular" | "other";
  title: string;
  description: string;
  subject: string;
  semester: number;
  batch: number;
  submittedDate: string;
  status: "pending" | "approved" | "rejected";
  adminRemarks?: string;
}

export default function TeacherRecordsPage() {
  const { user } = useAuthStore();
  const teacher = demoTeachers.find(t => t.id === user?.id);

  const [records, setRecords] = useState<Record[]>([
    {
      id: "1",
      type: "attendance",
      title: "Monthly Attendance Report - January 2025",
      description: "Complete attendance records for Database Systems - Sem 6",
      subject: "Database Management Systems",
      semester: 6,
      batch: 2021,
      submittedDate: "2025-01-30",
      status: "approved",
      adminRemarks: "Records verified and approved",
    },
    {
      id: "2",
      type: "grades",
      title: "Mid-term Exam Grades - Operating Systems",
      description: "All student grades for mid-term examination",
      subject: "Operating Systems",
      semester: 4,
      batch: 2022,
      submittedDate: "2025-01-25",
      status: "pending",
    },
    {
      id: "3",
      type: "assignments",
      title: "Assignment Evaluation Report",
      description: "Grading summary for Assignment 3",
      subject: "Database Management Systems",
      semester: 6,
      batch: 2021,
      submittedDate: "2025-01-20",
      status: "approved",
    },
  ]);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    type: "attendance" as Record["type"],
    title: "",
    description: "",
    subject: "",
    semester: "",
    batch: "",
  });

  const subjects = [
    { id: "1", name: "Database Management Systems", semester: 6, batch: 2021 },
    { id: "2", name: "Database Management Systems", semester: 4, batch: 2022 },
    { id: "3", name: "Operating Systems", semester: 4, batch: 2022 },
  ];

  const recordTypeColors: Record<string, string> = {
    attendance: "bg-sky-100 text-sky-700",
    grades: "bg-emerald-100 text-emerald-700",
    assignments: "bg-amber-100 text-amber-700",
    extracurricular: "bg-pink-100 text-pink-700",
    other: "bg-gray-100 text-gray-700",
  };

  const handleSubmitRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = subjects.find((s) => s.name === newRecord.subject);
    const record: Record = {
      id: String(records.length + 1),
      type: newRecord.type,
      title: newRecord.title,
      description: newRecord.description,
      subject: newRecord.subject,
      semester: subject ? subject.semester : parseInt(newRecord.semester),
      batch: subject ? subject.batch : parseInt(newRecord.batch),
      submittedDate: new Date().toISOString().split("T")[0],
      status: "pending",
    };
    setRecords([...records, record]);
    setShowSubmitModal(false);
    setNewRecord({
      type: "attendance",
      title: "",
      description: "",
      subject: "",
      semester: "",
      batch: "",
    });
    alert("Record submitted successfully! Admin will review it.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Records</h1>
          <p className="text-gray-600">Submit records and reports to admin for review</p>
        </div>
        <Button onClick={() => setShowSubmitModal(true)}>
          <Send className="w-4 h-4 mr-2" />
          Submit Record
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Records</p>
              <p className="text-3xl font-bold text-gray-900">{records.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Approved</p>
              <p className="text-3xl font-bold text-gray-900">
                {records.filter((r) => r.status === "approved").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-gray-900">
                {records.filter((r) => r.status === "pending").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Rejected</p>
              <p className="text-3xl font-bold text-gray-900">
                {records.filter((r) => r.status === "rejected").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Records List */}
      <Card>
        <CardHeader>
          <CardTitle>Submitted Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {records.map((record) => (
              <div key={record.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900">{record.title}</h3>
                      <Badge className={recordTypeColors[record.type]}>
                        {record.type}
                      </Badge>
                      <Badge variant={record.status === "approved" ? "success" : record.status === "pending" ? "outline" : "destructive"}>
                        {record.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{record.subject}</span>
                      <span>Sem {record.semester} | Batch {record.batch}</span>
                      <span>Submitted: {new Date(record.submittedDate).toLocaleDateString()}</span>
                    </div>
                    {record.adminRemarks && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs font-semibold text-blue-900 mb-1">Admin Remarks:</p>
                        <p className="text-xs text-blue-700">{record.adminRemarks}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit Record Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Submit New Record</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowSubmitModal(false)}>
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
                    onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value as Record["type"] })}
                    required
                  >
                    <option value="attendance">Attendance Report</option>
                    <option value="grades">Grades Report</option>
                    <option value="assignments">Assignment Report</option>
                    <option value="extracurricular">Extracurricular Report</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <select
                    id="subject"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                    value={newRecord.subject}
                    onChange={(e) => {
                      setNewRecord({ ...newRecord, subject: e.target.value });
                      const subject = subjects.find((s) => s.name === e.target.value);
                      if (subject) {
                        setNewRecord({
                          ...newRecord,
                          subject: subject.name,
                          semester: String(subject.semester),
                          batch: String(subject.batch),
                        });
                      }
                    }}
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.name}>
                        {subject.name} - Sem {subject.semester} (Batch {subject.batch})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="title">Record Title *</Label>
                  <Input
                    id="title"
                    value={newRecord.title}
                    onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
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
                    onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="file">Attach File (Optional)</Label>
                  <Input
                    id="file"
                    type="file"
                    className="cursor-pointer"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    <Send className="w-4 h-4 mr-2" />
                    Submit to Admin
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowSubmitModal(false)}>
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

