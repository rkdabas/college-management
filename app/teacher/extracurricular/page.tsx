"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Trophy,
  Calendar,
  X,
  Award,
  Activity,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";

interface ExtracurricularActivity {
  id: string;
  studentId: string;
  student: { id: string; name: string; rollNo: string | null };
  activityType: string;
  activityName: string;
  description: string | null;
  date: string;
  achievement: string | null;
  points: number;
  status: string;
}

interface Student {
  id: string;
  rollNo: string | null;
  name: string;
}

export default function TeacherExtracurricularPage() {
  const { user } = useAuthStore();
  const [activities, setActivities] = useState<ExtracurricularActivity[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newActivity, setNewActivity] = useState({
    studentId: "",
    activityType: "sports",
    activityName: "",
    description: "",
    date: "",
    achievement: "",
    points: 0,
  });

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/extracurricular?teacherId=${user.id}`)
      .then((res) => res.json())
      .then((data: ExtracurricularActivity[]) => {
        setActivities(Array.isArray(data) ? data : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  useEffect(() => {
    fetch("/api/students")
      .then((res) => res.json())
      .then((data: Student[]) => {
        setStudents(Array.isArray(data) ? data : []);
      })
      .catch(() => setStudents([]));
  }, []);

  const activityTypeColors: Record<string, string> = {
    sports: "bg-emerald-100 text-emerald-700",
    cultural: "bg-amber-100 text-amber-700",
    technical: "bg-sky-100 text-sky-700",
    social: "bg-pink-100 text-pink-700",
    other: "bg-gray-100 text-gray-700",
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !newActivity.studentId) return;
    setSaving(true);
    try {
      const res = await fetch("/api/extracurricular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newActivity,
          teacherId: user.id,
        }),
      });
      const created = await res.json();
      if (res.ok) {
        setActivities((prev) => [created, ...prev]);
        setShowAddModal(false);
        setNewActivity({
          studentId: "",
          activityType: "sports",
          activityName: "",
          description: "",
          date: "",
          achievement: "",
          points: 0,
        });
        alert("Extracurricular activity marked successfully!");
      } else {
        alert(created.error || "Failed to add activity.");
      }
    } catch {
      alert("Failed to add activity.");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      const res = await fetch("/api/extracurricular", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const updated = await res.json();
      if (res.ok) {
        setActivities((prev) =>
          prev.map((a) => (a.id === id ? { ...a, ...updated } : a))
        );
      }
    } catch {
      alert("Failed to update status.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Extracurricular Activities
          </h1>
          <p className="text-gray-600">
            Mark and manage student extracurricular activities
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Mark Activity
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Activities</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {activities.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Approved</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {activities.filter((a) => a.status === "approved").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {activities.filter((a) => a.status === "pending").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Points</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {activities.reduce((sum, a) => sum + (a.points ?? 0), 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-gray-500 py-8 text-center">
                No activities recorded yet
              </p>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="font-bold text-gray-900">
                          {activity.student?.name || "—"}
                        </h3>
                        <Badge variant="outline">
                          {activity.student?.rollNo || activity.studentId}
                        </Badge>
                        <Badge
                          className={
                            activityTypeColors[activity.activityType] ||
                            activityTypeColors.other
                          }
                        >
                          {activity.activityType}
                        </Badge>
                        <Badge
                          variant={
                            activity.status === "approved"
                              ? "outline"
                              : activity.status === "pending"
                              ? "outline"
                              : "destructive"
                          }
                        >
                          {activity.status}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {activity.activityName}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {activity.description || "—"}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(activity.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="w-3 h-3" />
                          {activity.achievement || "—"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {activity.points ?? 0} points
                        </div>
                      </div>
                    </div>
                    {activity.status === "pending" && (
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatusChange(activity.id, "approved")
                          }
                          className="bg-emerald-50 text-emerald-700 border-emerald-200"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatusChange(activity.id, "rejected")
                          }
                          className="bg-red-50 text-red-700 border-red-200"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Mark Extracurricular Activity</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddActivity} className="space-y-4">
                <div>
                  <Label htmlFor="student">Student *</Label>
                  <select
                    id="student"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                    value={newActivity.studentId}
                    onChange={(e) =>
                      setNewActivity({
                        ...newActivity,
                        studentId: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.rollNo || s.id} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="activityType">Activity Type *</Label>
                  <select
                    id="activityType"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                    value={newActivity.activityType}
                    onChange={(e) =>
                      setNewActivity({
                        ...newActivity,
                        activityType: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="sports">Sports</option>
                    <option value="cultural">Cultural</option>
                    <option value="technical">Technical</option>
                    <option value="social">Social</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="activityName">Activity Name *</Label>
                  <Input
                    id="activityName"
                    value={newActivity.activityName}
                    onChange={(e) =>
                      setNewActivity({
                        ...newActivity,
                        activityName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                    rows={3}
                    value={newActivity.description}
                    onChange={(e) =>
                      setNewActivity({
                        ...newActivity,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newActivity.date}
                      onChange={(e) =>
                        setNewActivity({
                          ...newActivity,
                          date: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="points">Points</Label>
                    <Input
                      id="points"
                      type="number"
                      min="0"
                      value={newActivity.points}
                      onChange={(e) =>
                        setNewActivity({
                          ...newActivity,
                          points: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="achievement">Achievement</Label>
                  <Input
                    id="achievement"
                    value={newActivity.achievement}
                    onChange={(e) =>
                      setNewActivity({
                        ...newActivity,
                        achievement: e.target.value,
                      })
                    }
                    placeholder="e.g., First Prize, Participation, Runner-up"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={saving}>
                    <Activity className="w-4 h-4 mr-2" />
                    Mark Activity
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
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
