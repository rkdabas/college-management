"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileCheck, Plus, Clock, CheckCircle, XCircle } from "lucide-react";

export default function StudentLeavePage() {
  const leaveApplications = [
    {
      id: "1",
      fromDate: "2025-01-20",
      toDate: "2025-01-22",
      reason: "Medical emergency",
      type: "sick",
      status: "approved",
      appliedDate: "2025-01-18",
    },
    {
      id: "2",
      fromDate: "2025-02-05",
      toDate: "2025-02-07",
      reason: "Family function",
      type: "other",
      status: "pending",
      appliedDate: "2025-01-25",
    },
    {
      id: "3",
      fromDate: "2024-12-10",
      toDate: "2024-12-12",
      reason: "Personal work",
      type: "other",
      status: "rejected",
      appliedDate: "2024-12-05",
    },
  ];

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leave Applications</h1>
          <p className="text-gray-600">Apply for leave and track your applications</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Application
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                {leaveApplications.filter(l => l.status === "approved").length}
              </p>
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
      </div>

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
                      {getStatusBadge(leave.status)}
                      <Badge variant="outline">{leave.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{leave.reason}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                      </div>
                      <span>Applied: {new Date(leave.appliedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

