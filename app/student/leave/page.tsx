"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileCheck, Plus, Clock, CheckCircle, XCircle, X } from "lucide-react";
import { useAuthStore } from "@/lib/store";

interface LeaveApplication {
  id: string;
  fromDate: string;
  toDate: string;
  reason: string;
  type: string;
  status: string;
  appliedAt: string;
}

export default function StudentLeavePage() {
  const { user } = useAuthStore();
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ fromDate: "", toDate: "", reason: "", type: "personal" });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchLeaves = useCallback((showLoading = true) => {
    if (!user?.id) return;
    if (showLoading) setLoading(true);
    fetch(`/api/leave?userId=${user.id}`)
      .then((res) => res.ok ? res.json() : [])
      .then(setLeaveApplications)
      .catch(() => setLeaveApplications([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !formData.fromDate || !formData.toDate || !formData.reason) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          fromDate: formData.fromDate,
          toDate: formData.toDate,
          reason: formData.reason,
          type: formData.type,
        }),
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({ fromDate: "", toDate: "", reason: "", type: "personal" });
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 5000);
        fetchLeaves(false);
      } else {
        const err = await res.json();
        alert(err.error ?? "Failed to submit");
      }
    } catch {
      alert("Failed to submit leave application");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="success">Approved</Badge>;
      case "pending":
        return <Badge>Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leave Applications</h1>
          <p className="text-gray-600">Apply for leave and track your applications</p>
          <p className="text-sm text-muted-foreground mt-1">
            Applications are submitted to the college admin for approval. You can track status below.
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Application
        </Button>
      </div>

      {submitSuccess && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>Your leave application has been submitted to the college admin and is pending approval.</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <p className="text-sm text-gray-600 mb-1">Approved</p>
              <p className="text-3xl font-bold text-gray-900">
                {leaveApplications.filter((l) => l.status === "approved").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-gray-900">
                {leaveApplications.filter((l) => l.status === "pending").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Leave Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {leaveApplications.length > 0 ? (
            <div className="space-y-4">
              {leaveApplications.map((leave) => (
                <div key={leave.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusBadge(leave.status)}
                        <Badge variant="outline">{leave.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{leave.reason}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                        </div>
                        <span>Applied: {new Date(leave.appliedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No leave applications yet</p>
              <Button className="mt-4" onClick={() => setShowModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Application
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>New Leave Application</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="fromDate">From Date *</Label>
                  <Input
                    id="fromDate"
                    type="date"
                    required
                    value={formData.fromDate}
                    onChange={(e) => setFormData((p) => ({ ...p, fromDate: e.target.value }))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="toDate">To Date *</Label>
                  <Input
                    id="toDate"
                    type="date"
                    required
                    value={formData.toDate}
                    onChange={(e) => setFormData((p) => ({ ...p, toDate: e.target.value }))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg mt-2"
                    value={formData.type}
                    onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                  >
                    <option value="personal">Personal</option>
                    <option value="medical">Medical</option>
                    <option value="academic">Academic</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="reason">Reason *</Label>
                  <textarea
                    id="reason"
                    required
                    rows={4}
                    value={formData.reason}
                    onChange={(e) => setFormData((p) => ({ ...p, reason: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg mt-2"
                    placeholder="Describe your reason for leave..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={submitting} className="flex-1">
                    {submitting ? "Submitting..." : "Submit"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
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
