"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, CheckCircle, XCircle, Clock, Eye, Filter, Search } from "lucide-react";

interface SubmittedRecord {
  id: string;
  teacherId: string;
  teacherName: string;
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

export default function AdminRecordsPage() {
  const [records, setRecords] = useState<SubmittedRecord[]>([
    {
      id: "1",
      teacherId: "1",
      teacherName: "Dr. Rajesh Kumar",
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
      teacherId: "2",
      teacherName: "Dr. Sunita Sharma",
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
      teacherId: "1",
      teacherName: "Dr. Rajesh Kumar",
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

  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const recordTypeColors: Record<string, string> = {
    attendance: "bg-sky-100 text-sky-700",
    grades: "bg-emerald-100 text-emerald-700",
    assignments: "bg-amber-100 text-amber-700",
    extracurricular: "bg-pink-100 text-pink-700",
    other: "bg-gray-100 text-gray-700",
  };

  const filteredRecords = records.filter((record) => {
    const matchesStatus = !selectedStatus || record.status === selectedStatus;
    const matchesType = !selectedType || record.type === selectedType;
    const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const handleStatusChange = (id: string, status: SubmittedRecord["status"], remarks?: string) => {
    setRecords(
      records.map((r) =>
        r.id === id
          ? { ...r, status, adminRemarks: remarks }
          : r
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Submitted Records</h1>
        <p className="text-gray-600">Review and manage records submitted by teachers</p>
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
              <p className="text-sm text-gray-600 mb-1">Pending Review</p>
              <p className="text-3xl font-bold text-gray-900">
                {records.filter((r) => r.status === "pending").length}
              </p>
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
              <p className="text-sm text-gray-600 mb-1">Rejected</p>
              <p className="text-3xl font-bold text-gray-900">
                {records.filter((r) => r.status === "rejected").length}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search records..."
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
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="attendance">Attendance</option>
                <option value="grades">Grades</option>
                <option value="assignments">Assignments</option>
                <option value="extracurricular">Extracurricular</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      <Card>
        <CardHeader>
          <CardTitle>Records ({filteredRecords.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRecords.map((record) => (
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
                      <span>Teacher: {record.teacherName}</span>
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
                {record.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const remarks = prompt("Enter approval remarks (optional):");
                        handleStatusChange(record.id, "approved", remarks || undefined);
                      }}
                      className="bg-emerald-50 text-emerald-700 border-emerald-200"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const remarks = prompt("Enter rejection reason:");
                        if (remarks) {
                          handleStatusChange(record.id, "rejected", remarks);
                        }
                      }}
                      className="bg-red-50 text-red-700 border-red-200"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

