"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Bell, Users, Calendar, TrendingUp } from "lucide-react";

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600 mt-1">Create and manage college-wide announcements</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Announcement
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">45</p>
              <p className="text-sm text-gray-600 mt-1">Total Announcements</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">12</p>
              <p className="text-sm text-gray-600 mt-1">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">2,547</p>
              <p className="text-sm text-gray-600 mt-1">Total Reach</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">87%</p>
              <p className="text-sm text-gray-600 mt-1">Read Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: "Mid-Term Examination Schedule Released",
                description: "The mid-term examination schedule for all departments has been published. Students are requested to check their respective schedules.",
                date: "Oct 14, 2025",
                category: "Academic",
                priority: "high",
                reach: 2547,
              },
              {
                title: "Annual Tech Fest Registration Open",
                description: "Registration for the Annual Tech Fest 2025 is now open. Participate in various coding competitions, robotics, and innovation events.",
                date: "Oct 12, 2025",
                category: "Event",
                priority: "medium",
                reach: 1200,
              },
              {
                title: "Library Timings Extended",
                description: "The library will remain open until 10 PM during the examination period to facilitate student preparations.",
                date: "Oct 10, 2025",
                category: "Facility",
                priority: "medium",
                reach: 2547,
              },
              {
                title: "Holiday Notice - Diwali Break",
                description: "College will remain closed from October 28 to November 2 for Diwali celebrations. Classes will resume on November 3.",
                date: "Oct 8, 2025",
                category: "Holiday",
                priority: "high",
                reach: 2734,
              },
            ].map((announcement, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{announcement.title}</h3>
                      <Badge variant={announcement.priority === "high" ? "destructive" : "default"}>
                        {announcement.priority}
                      </Badge>
                      <Badge variant="outline">{announcement.category}</Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{announcement.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {announcement.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {announcement.reach} people reached
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
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

