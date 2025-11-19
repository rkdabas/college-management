"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trophy, Users, Calendar, X, Award, Activity } from "lucide-react";
import { useAuthStore } from "@/lib/store";

interface ExtracurricularActivity {
  id: string;
  studentId: string;
  rollNo: string;
  studentName: string;
  activityType: "sports" | "cultural" | "technical" | "social" | "other";
  activityName: string;
  description: string;
  date: string;
  achievement: string;
  points: number;
  status: "pending" | "approved" | "rejected";
}

export default function TeacherExtracurricularPage() {
  const { user } = useAuthStore();
  const [activities, setActivities] = useState<ExtracurricularActivity[]>([
    {
      id: "1",
      studentId: "1",
      rollNo: "21CSE001",
      studentName: "Rahul Sharma",
      activityType: "sports",
      activityName: "Inter-College Cricket Tournament",
      description: "Participated in cricket tournament",
      date: "2025-01-15",
      achievement: "Runner-up",
      points: 15,
      status: "approved",
    },
    {
      id: "2",
      studentId: "2",
      rollNo: "21CSE002",
      studentName: "Priya Verma",
      activityType: "cultural",
      activityName: "Dance Competition",
      description: "Won first prize in classical dance",
      date: "2025-01-20",
      achievement: "First Prize",
      points: 20,
      status: "approved",
    },
    {
      id: "3",
      studentId: "3",
      rollNo: "21CSE003",
      studentName: "Amit Kumar",
      activityType: "technical",
      activityName: "Hackathon 2025",
      description: "Participated in coding competition",
      date: "2025-01-25",
      achievement: "Participation",
      points: 10,
      status: "pending",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState("1");
  const [newActivity, setNewActivity] = useState({
    studentId: "",
    activityType: "sports" as ExtracurricularActivity["activityType"],
    activityName: "",
    description: "",
    date: "",
    achievement: "",
    points: 0,
  });

  const classes = [
    { id: "1", subject: "Database Management Systems", batch: 2021, semester: 6 },
    { id: "2", subject: "Operating Systems", batch: 2022, semester: 4 },
  ];

  const students = [
    { id: "1", rollNo: "21CSE001", name: "Rahul Sharma" },
    { id: "2", rollNo: "21CSE002", name: "Priya Verma" },
    { id: "3", rollNo: "21CSE003", name: "Amit Kumar" },
    { id: "4", rollNo: "21CSE004", name: "Sneha Patel" },
    { id: "5", rollNo: "21CSE005", name: "Arjun Singh" },
  ];

  const activityTypeColors: Record<string, string> = {
    sports: "bg-emerald-100 text-emerald-700",
    cultural: "bg-amber-100 text-amber-700",
    technical: "bg-sky-100 text-sky-700",
    social: "bg-pink-100 text-pink-700",
    other: "bg-gray-100 text-gray-700",
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === newActivity.studentId);
    if (!student) return;

    const activity: ExtracurricularActivity = {
      id: String(activities.length + 1),
      studentId: newActivity.studentId,
      rollNo: student.rollNo,
      studentName: student.name,
      activityType: newActivity.activityType,
      activityName: newActivity.activityName,
      description: newActivity.description,
      date: newActivity.date,
      achievement: newActivity.achievement,
      points: newActivity.points,
      status: "approved",
    };
    setActivities([...activities, activity]);
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
  };

  const handleStatusChange = (id: string, status: ExtracurricularActivity["status"]) => {
    setActivities(
      activities.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Extracurricular Activities</h1>
          <p className="text-gray-600">Mark and manage student extracurricular activities</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Mark Activity
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Activities</p>
              <p className="text-3xl font-bold text-gray-900">{activities.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Approved</p>
              <p className="text-3xl font-bold text-gray-900">
                {activities.filter((a) => a.status === "approved").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-gray-900">
                {activities.filter((a) => a.status === "pending").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Points</p>
              <p className="text-3xl font-bold text-gray-900">
                {activities.reduce((sum, a) => sum + a.points, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Class</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classes.map((classItem) => (
              <button
                key={classItem.id}
                onClick={() => setSelectedClass(classItem.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedClass === classItem.id
                    ? "border-sky-600 bg-sky-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <h3 className="font-semibold text-gray-900 mb-1">{classItem.subject}</h3>
                <p className="text-sm text-gray-600">Batch {classItem.batch} | Sem {classItem.semester}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activities List */}
      <Card>
        <CardHeader>
          <CardTitle>Student Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900">{activity.studentName}</h3>
                      <Badge variant="outline">{activity.rollNo}</Badge>
                      <Badge className={activityTypeColors[activity.activityType]}>
                        {activity.activityType}
                      </Badge>
                      <Badge variant={activity.status === "approved" ? "success" : activity.status === "pending" ? "outline" : "destructive"}>
                        {activity.status}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">{activity.activityName}</h4>
                    <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(activity.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        {activity.achievement}
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {activity.points} points
                      </div>
                    </div>
                  </div>
                </div>
                {activity.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(activity.id, "approved")}
                      className="bg-emerald-50 text-emerald-700 border-emerald-200"
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(activity.id, "rejected")}
                      className="bg-red-50 text-red-700 border-red-200"
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Activity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Mark Extracurricular Activity</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)}>
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
                    onChange={(e) => setNewActivity({ ...newActivity, studentId: e.target.value })}
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.rollNo} - {student.name}
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
                    onChange={(e) => setNewActivity({ ...newActivity, activityType: e.target.value as ExtracurricularActivity["activityType"] })}
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
                    onChange={(e) => setNewActivity({ ...newActivity, activityName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                    rows={3}
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newActivity.date}
                      onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="points">Points *</Label>
                    <Input
                      id="points"
                      type="number"
                      min="0"
                      value={newActivity.points}
                      onChange={(e) => setNewActivity({ ...newActivity, points: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="achievement">Achievement *</Label>
                  <Input
                    id="achievement"
                    value={newActivity.achievement}
                    onChange={(e) => setNewActivity({ ...newActivity, achievement: e.target.value })}
                    placeholder="e.g., First Prize, Participation, Runner-up"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    <Activity className="w-4 h-4 mr-2" />
                    Mark Activity
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
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

