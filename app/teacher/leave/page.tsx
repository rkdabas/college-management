"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileCheck, Plus, X, Calendar, Clock, AlertCircle } from "lucide-react";

interface LeaveApplication {
  id: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
  adminRemarks?: string;
}

export default function TeacherLeavePage() {
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>([
    {
      id: "1",
      fromDate: "2025-02-05",
      toDate: "2025-02-07",
      reason: "Personal work",
      status: "approved",
      appliedDate: "2025-01-30",
      adminRemarks: "Approved. Please inform your students about the classes.",
    },
    {
      id: "2",
      fromDate: "2025-02-15",
      toDate: "2025-02-16",
      reason: "Medical appointment",
      status: "pending",
      appliedDate: "2025-01-28",
    },
    {
      id: "3",
      fromDate: "2025-01-20",
      toDate: "2025-01-20",
      reason: "Family emergency",
      status: "rejected",
      appliedDate: "2025-01-18",
      adminRemarks: "Rejected due to insufficient notice period.",
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveApplication | null>(null);

  const [newLeave, setNewLeave] = useState({
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const leave: LeaveApplication = {
      id: String(leaveApplications.length + 1),
      fromDate: newLeave.fromDate,
      toDate: newLeave.toDate,
      reason: newLeave.reason,
      status: "pending",
      appliedDate: new Date().toISOString().split("T")[0],
    };
    setLeaveApplications([...leaveApplications, leave]);
    setShowCreateModal(false);
    setNewLeave({ fromDate: "", toDate: "", reason: "" });
    alert("Leave application submitted successfully!");
  };

  const handleEdit = (leave: LeaveApplication) => {
    if (leave.status !== "pending") {
      alert("You can only edit pending applications.");
      return;
    }
    setSelectedLeave(leave);
    setNewLeave({
      fromDate: leave.fromDate,
      toDate: leave.toDate,
      reason: leave.reason,
    });
    setShowEditModal(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeave) return;
    setLeaveApplications(leaveApplications.map(l =>
      l.id === selectedLeave.id
        ? { ...l, ...newLeave }
        : l
    ));
    setShowEditModal(false);
    setSelectedLeave(null);
    setNewLeave({ fromDate: "", toDate: "", reason: "" });
    alert("Leave application updated successfully!");
  };

  const handleDelete = (id: string) => {
    const leave = leaveApplications.find(l => l.id === id);
    if (leave && leave.status !== "pending") {
      alert("You can only delete pending applications.");
      return;
    }
    if (confirm("Are you sure you want to delete this leave application?")) {
      setLeaveApplications(leaveApplications.filter(l => l.id !== id));
    }
  };

  const calculateDays = (fromDate: string, toDate: string) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leave Applications</h1>
          <p className="text-gray-600">Apply for leave and track your applications</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Application
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900">{leaveApplications.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-gray-900">
                {leaveApplications.filter(l => l.status === "pending").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Approved</p>
              <p className="text-3xl font-bold text-gray-900">
                {leaveApplications.filter(l => l.status === "approved").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Rejected</p>
              <p className="text-3xl font-bold text-gray-900">
                {leaveApplications.filter(l => l.status === "rejected").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>My Leave Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaveApplications.map((leave) => (
              <div key={leave.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant={leave.status === "approved" ? "success" : leave.status === "pending" ? "outline" : "destructive"}>
                        {leave.status}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {calculateDays(leave.fromDate, leave.toDate)} day(s)
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{leave.reason}</p>
                    <p className="text-xs text-gray-500">Applied: {new Date(leave.appliedDate).toLocaleDateString()}</p>
                    {leave.adminRemarks && (
                      <div className={`mt-3 p-3 rounded-lg border ${
                        leave.status === "approved" 
                          ? "bg-emerald-50 border-emerald-200" 
                          : "bg-red-50 border-red-200"
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <AlertCircle className={`w-4 h-4 ${
                            leave.status === "approved" ? "text-emerald-600" : "text-red-600"
                          }`} />
                          <p className="text-xs font-semibold text-gray-900">Admin Remarks:</p>
                        </div>
                        <p className={`text-xs ${
                          leave.status === "approved" ? "text-emerald-700" : "text-red-700"
                        }`}>
                          {leave.adminRemarks}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {leave.status === "pending" && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(leave)}>
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(leave.id)} className="text-red-600 hover:text-red-700">
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Leave Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>New Leave Application</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowCreateModal(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fromDate">From Date *</Label>
                    <Input
                      id="fromDate"
                      type="date"
                      value={newLeave.fromDate}
                      onChange={(e) => setNewLeave({ ...newLeave, fromDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="toDate">To Date *</Label>
                    <Input
                      id="toDate"
                      type="date"
                      value={newLeave.toDate}
                      onChange={(e) => setNewLeave({ ...newLeave, toDate: e.target.value })}
                      min={newLeave.fromDate}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="reason">Reason *</Label>
                  <textarea
                    id="reason"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                    rows={4}
                    value={newLeave.reason}
                    onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                    placeholder="Please provide a reason for your leave..."
                    required
                  />
                </div>
                {newLeave.fromDate && newLeave.toDate && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">
                      Total Leave Days: {calculateDays(newLeave.fromDate, newLeave.toDate)} day(s)
                    </p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    Submit Application
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

      {/* Edit Leave Modal */}
      {showEditModal && selectedLeave && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Edit Leave Application</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => {
                  setShowEditModal(false);
                  setSelectedLeave(null);
                }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-fromDate">From Date *</Label>
                    <Input
                      id="edit-fromDate"
                      type="date"
                      value={newLeave.fromDate}
                      onChange={(e) => setNewLeave({ ...newLeave, fromDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-toDate">To Date *</Label>
                    <Input
                      id="edit-toDate"
                      type="date"
                      value={newLeave.toDate}
                      onChange={(e) => setNewLeave({ ...newLeave, toDate: e.target.value })}
                      min={newLeave.fromDate}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-reason">Reason *</Label>
                  <textarea
                    id="edit-reason"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                    rows={4}
                    value={newLeave.reason}
                    onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                    required
                  />
                </div>
                {newLeave.fromDate && newLeave.toDate && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">
                      Total Leave Days: {calculateDays(newLeave.fromDate, newLeave.toDate)} day(s)
                    </p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Update Application
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setShowEditModal(false);
                    setSelectedLeave(null);
                  }}>
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
