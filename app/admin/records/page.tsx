"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, CheckCircle, XCircle, Clock, Eye, Filter, Search } from "lucide-react";

interface SubmittedRecord {
  id: string;
  title: string;
  description: string;
  type: "ATTENDANCE" | "GRADES" | "ASSIGNMENTS" | "EXTRACURRICULAR" | "OTHER";
  subject: string;
  semester: number;
  batch: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminRemarks?: string;
  submittedAt: string;
  updatedAt: string;
  submitter: {
    id: string;
    name: string;
    teacherId?: string;
  };
  reviewer?: {
    id: string;
    name: string;
  };
}

export default function AdminRecordsPage() {
  const [records, setRecords] = useState<SubmittedRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus) params.append('status', selectedStatus);
      if (selectedType) params.append('type', selectedType);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/records?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      } else {
        console.error('Failed to fetch records');
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, selectedType, searchQuery]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const recordTypeColors: Record<string, string> = {
    ATTENDANCE: "bg-sky-100 text-sky-700",
    GRADES: "bg-emerald-100 text-emerald-700",
    ASSIGNMENTS: "bg-amber-100 text-amber-700",
    EXTRACURRICULAR: "bg-pink-100 text-pink-700",
    OTHER: "bg-gray-100 text-gray-700",
  };

  const filteredRecords = records; // Filtering is now done server-side

  const handleStatusChange = async (id: string, status: SubmittedRecord["status"], remarks?: string) => {
    try {
      const response = await fetch(`/api/records/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          adminRemarks: remarks,
        }),
      });

      if (response.ok) {
        // Refresh records after successful update
        fetchRecords();
      } else {
        console.error('Failed to update record status');
      }
    } catch (error) {
      console.error('Error updating record status:', error);
    }
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
                {records.filter((r) => r.status === "PENDING").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Approved</p>
              <p className="text-3xl font-bold text-gray-900">
                {records.filter((r) => r.status === "APPROVED").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Rejected</p>
              <p className="text-3xl font-bold text-gray-900">
                {records.filter((r) => r.status === "REJECTED").length}
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
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="ATTENDANCE">Attendance</option>
                <option value="GRADES">Grades</option>
                <option value="ASSIGNMENTS">Assignments</option>
                <option value="EXTRACURRICULAR">Extracurricular</option>
                <option value="OTHER">Other</option>
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
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading records...</p>
            </div>
          ) : (
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
                      <Badge variant={record.status === "APPROVED" ? "success" : record.status === "PENDING" ? "outline" : "destructive"}>
                        {record.status.toLowerCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Teacher: {record.submitter.name}</span>
                      <span>{record.subject}</span>
                      <span>Sem {record.semester} | Batch {record.batch}</span>
                      <span>Submitted: {new Date(record.submittedAt).toLocaleDateString()}</span>
                    </div>
                    {record.adminRemarks && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs font-semibold text-blue-900 mb-1">Admin Remarks:</p>
                        <p className="text-xs text-blue-700">{record.adminRemarks}</p>
                      </div>
                    )}
                  </div>
                </div>
                {record.status === "PENDING" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const remarks = prompt("Enter approval remarks (optional):");
                        handleStatusChange(record.id, "APPROVED", remarks || undefined);
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
                          handleStatusChange(record.id, "REJECTED", remarks);
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}

