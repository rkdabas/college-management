"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Bell, Users, Calendar, TrendingUp, Send, X, Edit, Trash2, Eye } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  priority: "high" | "medium" | "low";
  reach: number;
  status: "draft" | "published";
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "1",
      title: "Mid-Term Examination Schedule Released",
      description: "The mid-term examination schedule for all departments has been published. Students are requested to check their respective schedules.",
      date: "Oct 14, 2025",
      category: "Academic",
      priority: "high",
      reach: 2547,
      status: "published",
    },
    {
      id: "2",
      title: "Annual Tech Fest Registration Open",
      description: "Registration for the Annual Tech Fest 2025 is now open. Participate in various coding competitions, robotics, and innovation events.",
      date: "Oct 12, 2025",
      category: "Event",
      priority: "medium",
      reach: 1200,
      status: "published",
    },
    {
      id: "3",
      title: "Library Timings Extended",
      description: "The library will remain open until 10 PM during the examination period to facilitate student preparations.",
      date: "Oct 10, 2025",
      category: "Facility",
      priority: "medium",
      reach: 2547,
      status: "published",
    },
    {
      id: "4",
      title: "Holiday Notice - Diwali Break",
      description: "College will remain closed from October 28 to November 2 for Diwali celebrations. Classes will resume on November 3.",
      date: "Oct 8, 2025",
      category: "Holiday",
      priority: "high",
      reach: 2734,
      status: "published",
    },
  ]);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [notificationAudience, setNotificationAudience] = useState<string[]>(["all"]);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Academic",
    priority: "medium" as "high" | "medium" | "low",
  });

  const publishedCount = announcements.filter((a) => a.status === "published").length;
  const draftCount = announcements.filter((a) => a.status === "draft").length;
  const totalReach = announcements.reduce((sum, a) => sum + a.reach, 0);
  const avgReadRate = 87; // Mock data

  const openCreateModal = (announcement?: Announcement) => {
    if (announcement) {
      setIsEditing(true);
      setSelectedAnnouncement(announcement);
      setFormData({
        title: announcement.title,
        description: announcement.description,
        category: announcement.category,
        priority: announcement.priority,
      });
    } else {
      setIsEditing(false);
      setSelectedAnnouncement(null);
      setFormData({
        title: "",
        description: "",
        category: "Academic",
        priority: "medium",
      });
    }
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setIsEditing(false);
    setSelectedAnnouncement(null);
    setFormData({
      title: "",
      description: "",
      category: "Academic",
      priority: "medium",
    });
  };

  const openNotificationModal = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setNotificationAudience(["all"]);
    setShowNotificationModal(true);
  };

  const closeNotificationModal = () => {
    setShowNotificationModal(false);
    setSelectedAnnouncement(null);
    setNotificationAudience(["all"]);
  };

  const toggleAudience = (audience: string) => {
    if (audience === "all") {
      setNotificationAudience(["all"]);
    } else {
      const newAudience = notificationAudience.filter((a) => a !== "all");

      if (newAudience.includes(audience)) {
        const filtered = newAudience.filter((a) => a !== audience);
        setNotificationAudience(filtered.length === 0 ? ["all"] : filtered);
      } else {
        setNotificationAudience([...newAudience, audience]);
      }
    }
  };

  const handleCreateOrUpdate = (publish: boolean) => {
    if (!formData.title || !formData.description) {
      alert("Please fill all required fields!");
      return;
    }

    if (isEditing && selectedAnnouncement) {
      // Update existing announcement
      setAnnouncements((prev) =>
        prev.map((a) =>
          a.id === selectedAnnouncement.id
            ? { ...a, ...formData, status: publish ? "published" : "draft" }
            : a
        )
      );
      alert(`Announcement updated and ${publish ? "published" : "saved as draft"}!`);
    } else {
      // Create new announcement
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        ...formData,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        reach: 0,
        status: publish ? "published" : "draft",
      };
      setAnnouncements((prev) => [newAnnouncement, ...prev]);
      alert(`Announcement created and ${publish ? "published" : "saved as draft"}!`);
    }

    closeCreateModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      alert("Announcement deleted successfully!");
    }
  };

  const sendNotification = () => {
    if (!selectedAnnouncement || notificationAudience.length === 0) return;

    const audienceText = notificationAudience.includes("all")
      ? "All Users"
      : notificationAudience.map((a) => a.charAt(0).toUpperCase() + a.slice(1)).join(", ");

    alert(
      `Email notification sent successfully!\n\nAnnouncement: ${selectedAnnouncement.title}\nAudience: ${audienceText}`
    );
    closeNotificationModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Announcements & Notices</h1>
          <p className="text-gray-600 mt-1">Create and manage college-wide announcements</p>
        </div>
        <Button className="gap-2" onClick={() => openCreateModal()}>
          <Plus className="w-4 h-4" />
          New Announcement
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{announcements.length}</p>
              <p className="text-sm text-gray-600 mt-1">Total Announcements</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{publishedCount}</p>
              <p className="text-sm text-gray-600 mt-1">Published</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{totalReach.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1">Total Reach</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{avgReadRate}%</p>
              <p className="text-sm text-gray-600 mt-1">Read Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{announcement.title}</h3>
                      <Badge variant={announcement.priority === "high" ? "destructive" : "default"}>
                        {announcement.priority}
                      </Badge>
                      <Badge variant="outline">{announcement.category}</Badge>
                      <Badge variant={announcement.status === "published" ? "success" : "secondary"}>
                        {announcement.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{announcement.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {announcement.date}
                      </div>
                      {announcement.status === "published" && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {announcement.reach} people reached
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => openCreateModal(announcement)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    {announcement.status === "published" && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => openNotificationModal(announcement)}
                        className="gap-2"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleDelete(announcement.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">
                {isEditing ? "Edit Announcement" : "Create New Announcement"}
              </h2>
              <Button variant="ghost" size="icon" onClick={closeCreateModal}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title *</label>
                <input
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Enter announcement title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description *</label>
                <textarea
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Enter announcement details"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Academic">Academic</option>
                    <option value="Event">Event</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Facility">Facility</option>
                    <option value="Exam">Exam</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value as "high" | "medium" | "low" })
                    }
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button onClick={() => handleCreateOrUpdate(false)} variant="outline" className="flex-1">
                Save as Draft
              </Button>
              <Button onClick={() => handleCreateOrUpdate(true)} className="flex-1 gap-2">
                <Send className="w-4 h-4" />
                Publish & Notify
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotificationModal && selectedAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Send Announcement Notification</h2>
              <Button variant="ghost" size="icon" onClick={closeNotificationModal}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Announcement Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-lg mb-2">{selectedAnnouncement.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{selectedAnnouncement.description}</p>
              <div className="flex items-center gap-2">
                <Badge variant={selectedAnnouncement.priority === "high" ? "destructive" : "default"}>
                  {selectedAnnouncement.priority}
                </Badge>
                <Badge variant="outline">{selectedAnnouncement.category}</Badge>
              </div>
            </div>

            {/* Audience Selection */}
            <div className="mb-4">
              <h4 className="font-semibold mb-3">Select Notification Audience:</h4>
              <p className="text-sm text-gray-600 mb-3">
                Choose who should receive the email notification about this announcement
              </p>

              <div className="space-y-3">
                {/* All Users */}
                <div
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                    notificationAudience.includes("all")
                      ? "border-primary bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => toggleAudience("all")}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">All Users</p>
                      <p className="text-sm text-gray-600">Students, Teachers, and Staff</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationAudience.includes("all")}
                      onChange={() => {}}
                      className="w-5 h-5"
                    />
                  </div>
                </div>

                {/* Students Only */}
                <div
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                    notificationAudience.includes("students") && !notificationAudience.includes("all")
                      ? "border-primary bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => toggleAudience("students")}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Students Only</p>
                      <p className="text-sm text-gray-600">All enrolled students</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={
                        notificationAudience.includes("students") || notificationAudience.includes("all")
                      }
                      onChange={() => {}}
                      className="w-5 h-5"
                    />
                  </div>
                </div>

                {/* Teachers Only */}
                <div
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                    notificationAudience.includes("teachers") && !notificationAudience.includes("all")
                      ? "border-primary bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => toggleAudience("teachers")}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Teachers Only</p>
                      <p className="text-sm text-gray-600">All teaching staff</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={
                        notificationAudience.includes("teachers") || notificationAudience.includes("all")
                      }
                      onChange={() => {}}
                      className="w-5 h-5"
                    />
                  </div>
                </div>

                {/* Staff Only */}
                <div
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                    notificationAudience.includes("staff") && !notificationAudience.includes("all")
                      ? "border-primary bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => toggleAudience("staff")}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Staff Only</p>
                      <p className="text-sm text-gray-600">Administrative and support staff</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={
                        notificationAudience.includes("staff") || notificationAudience.includes("all")
                      }
                      onChange={() => {}}
                      className="w-5 h-5"
                    />
                  </div>
                </div>

                {/* Teachers + Staff (No Students) */}
                <div
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                    notificationAudience.includes("teachers") &&
                    notificationAudience.includes("staff") &&
                    !notificationAudience.includes("students") &&
                    !notificationAudience.includes("all")
                      ? "border-primary bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => {
                    if (
                      notificationAudience.includes("teachers") &&
                      notificationAudience.includes("staff") &&
                      !notificationAudience.includes("students")
                    ) {
                      setNotificationAudience(["all"]);
                    } else {
                      setNotificationAudience(["teachers", "staff"]);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Teachers + Staff</p>
                      <p className="text-sm text-gray-600">All employees (excluding students)</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={
                        (notificationAudience.includes("teachers") &&
                          notificationAudience.includes("staff") &&
                          !notificationAudience.includes("students")) ||
                        notificationAudience.includes("all")
                      }
                      onChange={() => {}}
                      className="w-5 h-5"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm font-medium text-blue-900">
                📧 Email notification will be sent to:{" "}
                <span className="font-bold">
                  {notificationAudience.includes("all")
                    ? "All Users"
                    : notificationAudience.map((a) => a.charAt(0).toUpperCase() + a.slice(1)).join(", ")}
                </span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={sendNotification}
                disabled={notificationAudience.length === 0}
                className="flex-1 gap-2"
              >
                <Send className="w-4 h-4" />
                Send Notification
              </Button>
              <Button variant="outline" onClick={closeNotificationModal}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
