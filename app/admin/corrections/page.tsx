"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle, XCircle, Clock, Eye, Filter, Search, User } from "lucide-react";

interface CorrectionRequest {
  id: string;
  studentId: string;
  rollNo: string;
  studentName: string;
  subject: string;
  assessment: string;
  currentGrade: string;
  requestedGrade: string;
  reason: string;
  submittedDate: string;
  status: "pending" | "approved" | "rejected";
  teacherRemarks?: string;
}

export default function AdminCorrectionsPage() {
  const [requests, setRequests] = useState<CorrectionRequest[]>([
    {
      id: "1",
      studentId: "1",
      rollNo: "21CSE001",
      studentName: "Rahul Sharma",
      subject: "Database Management Systems",
      assessment: "Mid-term Exam",
      currentGrade: "B+",
      requestedGrade: "A",
      reason: "I believe there was an error in grading. I answered all questions correctly.",
      submittedDate: "2025-01-25",
      status: "pending",
    },
    {
      id: "2",
      studentId: "2",
      rollNo: "21CSE002",
      studentName: "Priya Verma",
      subject: "Operating Systems",
      assessment: "Assignment 2",
      currentGrade: "C",
      requestedGrade: "B",
      reason: "Some points were not considered in the evaluation.",
      submittedDate: "2025-01-20",
      status: "approved",
      teacherRemarks: "Grade corrected after review. Updated to B.",
    },
    {
      id: "3",
      studentId: "3",
      rollNo: "21CSE003",
      studentName: "Amit Kumar",
      subject: "AI/ML",
      assessment: "Project Work",
      currentGrade: "B",
      requestedGrade: "A",
      reason: "Project met all requirements and exceeded expectations.",
      submittedDate: "2025-01-15",
      status: "rejected",
      teacherRemarks: "Grade is accurate based on evaluation criteria.",
    },
  ]);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRequests = requests.filter((request) => {
    const matchesStatus = !selectedStatus || request.status === selectedStatus;
    const matchesSearch = request.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (id: string, status: CorrectionRequest["status"], remarks?: string) => {
    setRequests(
      requests.map((r) =>
        r.id === id
          ? { ...r, status, teacherRemarks: remarks }
          : r
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Grade Correction Requests</h1>
        <p className="text-gray-600">Review and manage student grade correction requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Requests</p>
              <p className="text-3xl font-bold text-gray-900">{requests.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-gray-900">
                {requests.filter((r) => r.status === "pending").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Approved</p>
              <p className="text-3xl font-bold text-gray-900">
                {requests.filter((r) => r.status === "approved").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Rejected</p>
              <p className="text-3xl font-bold text-gray-900">
                {requests.filter((r) => r.status === "rejected").length}
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
                placeholder="Search by student name, roll no, or subject..."
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
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>Correction Requests ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-sky-600 to-sky-700 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{request.studentName}</h3>
                        <p className="text-xs text-gray-600">{request.rollNo}</p>
                      </div>
                      <Badge variant={request.status === "approved" ? "success" : request.status === "pending" ? "outline" : "destructive"}>
                        {request.status}
                      </Badge>
                    </div>
                    <div className="ml-14 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-900">{request.subject}</span>
                        <Badge variant="outline">{request.assessment}</Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Current:</span>
                          <span className="text-sm font-semibold text-gray-900">{request.currentGrade}</span>
                        </div>
                        <span className="text-gray-400">→</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Requested:</span>
                          <span className="text-sm font-semibold text-gray-900">{request.requestedGrade}</span>
                        </div>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <p className="text-xs font-semibold text-gray-900 mb-1">Student's Reason:</p>
                        <p className="text-sm text-gray-700">{request.reason}</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Submitted: {new Date(request.submittedDate).toLocaleDateString()}
                        </div>
                      </div>
                      {request.teacherRemarks && (
                        <div className={`p-3 rounded-lg border ${
                          request.status === "approved" 
                            ? "bg-emerald-50 border-emerald-200" 
                            : "bg-red-50 border-red-200"
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            {request.status === "approved" ? (
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            <p className="text-xs font-semibold text-gray-900">Teacher Response:</p>
                          </div>
                          <p className={`text-xs ${
                            request.status === "approved" ? "text-emerald-700" : "text-red-700"
                          }`}>
                            {request.teacherRemarks}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {request.status === "pending" && (
                  <div className="ml-14 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const remarks = prompt("Enter approval remarks (optional):");
                        handleStatusChange(request.id, "approved", remarks || undefined);
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
                          handleStatusChange(request.id, "rejected", remarks);
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

