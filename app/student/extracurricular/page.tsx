"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, Award, Activity } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ExtracurricularActivity {
  id: string;
  activityType: string;
  activityName: string;
  description: string | null;
  date: string;
  achievement: string | null;
  points: number;
  status: string;
}

export default function StudentExtracurricularPage() {
  const { user } = useAuthStore();
  const [activities, setActivities] = useState<ExtracurricularActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/extracurricular?studentId=${user.id}`)
      .then((res) => res.ok ? res.json() : [])
      .then(setActivities)
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const activityTypeColors: Record<string, string> = {
    sports: "bg-emerald-100 text-emerald-700",
    cultural: "bg-amber-100 text-amber-700",
    technical: "bg-sky-100 text-sky-700",
    social: "bg-pink-100 text-pink-700",
    other: "bg-gray-100 text-gray-700",
  };

  const totalPoints = activities.reduce((sum, a) => sum + a.points, 0);
  const pointsByType = activities.reduce((acc, activity) => {
    acc[activity.activityType] = (acc[activity.activityType] || 0) + activity.points;
    return acc;
  }, {} as Record<string, number>);
  const chartData = Object.entries(pointsByType).map(([type, points]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    points,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Extracurricular Activities</h1>
        <p className="text-gray-600">View your extracurricular activities and achievements</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Points</p>
                <p className="text-4xl font-bold text-gray-900">{totalPoints}</p>
              </div>
              <Award className="w-16 h-16 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Activities</p>
                <p className="text-4xl font-bold text-gray-900">{activities.length}</p>
              </div>
              <Activity className="w-16 h-16 text-sky-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Approved</p>
                <p className="text-4xl font-bold text-gray-900">
                  {activities.filter((a) => a.status === "approved").length}
                </p>
              </div>
              <Trophy className="w-16 h-16 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Points Distribution by Activity Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="type" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="points" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>My Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-bold text-gray-900">{activity.activityName}</h3>
                        <Badge className={activityTypeColors[activity.activityType] ?? "bg-gray-100 text-gray-700"}>
                          {activity.activityType}
                        </Badge>
                        <Badge variant={activity.status === "approved" ? "success" : "outline"}>
                          {activity.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{activity.description ?? "-"}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(activity.date).toLocaleDateString()}
                        </div>
                        {activity.achievement && (
                          <div className="flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            {activity.achievement}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {activity.points} points
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No extracurricular activities yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
