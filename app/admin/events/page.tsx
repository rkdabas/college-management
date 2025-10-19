"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar as CalendarIcon, MapPin, Users, Eye, Edit, Trash2, Filter as FilterIcon, Send, X } from "lucide-react";
import { demoEvents } from "@/lib/demo-data-v2";
import { formatDate } from "@/lib/utils";

const eventTypeColors: Record<string, string> = {
  academic: "bg-sky-100 text-sky-700",
  cultural: "bg-amber-100 text-amber-700",
  sports: "bg-emerald-100 text-emerald-700",
  workshop: "bg-gray-100 text-gray-700",
  seminar: "bg-slate-100 text-slate-700",
  other: "bg-gray-100 text-gray-700",
};

const statusColors: Record<string, "default" | "success" | "warning" | "secondary"> = {
  upcoming: "default",
  ongoing: "success",
  completed: "secondary",
  cancelled: "warning",
};

export default function EventsPage() {
  const [events] = useState(demoEvents);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  
  // Notification Modal State
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [notificationAudience, setNotificationAudience] = useState<string[]>(["all"]);

  // Get unique years from events
  const years = Array.from(new Set(events.map(e => new Date(e.startDate).getFullYear()))).sort((a, b) => b - a);
  
  // Months
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // Filter events
  const filteredEvents = events.filter((event) => {
    // Status filter
    if (selectedStatus && event.status !== selectedStatus) return false;

    // Month/Year filter
    const eventDate = new Date(event.startDate);
    if (selectedMonth && (eventDate.getMonth() + 1).toString() !== selectedMonth) return false;
    if (selectedYear && eventDate.getFullYear().toString() !== selectedYear) return false;

    return true;
  });

  const resetFilters = () => {
    setSelectedStatus("");
    setSelectedMonth("");
    setSelectedYear("");
  };

  const hasActiveFilters = selectedStatus || selectedMonth || selectedYear;

  // Count by status
  const upcomingCount = events.filter((e) => e.status === "upcoming").length;
  const ongoingCount = events.filter((e) => e.status === "ongoing").length;
  const completedCount = events.filter((e) => e.status === "completed").length;
  const cancelledCount = events.filter((e) => e.status === "cancelled").length;

  const openNotificationModal = (event: any) => {
    setSelectedEvent(event);
    setNotificationAudience(["all"]);
    setShowNotificationModal(true);
  };

  const closeNotificationModal = () => {
    setShowNotificationModal(false);
    setSelectedEvent(null);
    setNotificationAudience(["all"]);
  };

  const toggleAudience = (audience: string) => {
    if (audience === "all") {
      setNotificationAudience(["all"]);
    } else {
      // Remove "all" if selecting specific audiences
      const newAudience = notificationAudience.filter((a) => a !== "all");
      
      if (newAudience.includes(audience)) {
        const filtered = newAudience.filter((a) => a !== audience);
        setNotificationAudience(filtered.length === 0 ? ["all"] : filtered);
      } else {
        setNotificationAudience([...newAudience, audience]);
      }
    }
  };

  const sendNotification = () => {
    if (!selectedEvent || notificationAudience.length === 0) return;

    const audienceText = notificationAudience.includes("all")
      ? "All Users"
      : notificationAudience.map((a) => a.charAt(0).toUpperCase() + a.slice(1)).join(", ");

    alert(
      `Email notification sent successfully!\n\nEvent: ${selectedEvent.title}\nAudience: ${audienceText}`
    );
    closeNotificationModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600 mt-1">Organize and manage college events and activities</p>
        </div>
        <Link href="/admin/events/add">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create New Event
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedStatus("upcoming")}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{upcomingCount}</p>
              <p className="text-sm text-gray-600 mt-1">Upcoming</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedStatus("ongoing")}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{ongoingCount}</p>
              <p className="text-sm text-gray-600 mt-1">Ongoing</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedStatus("completed")}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{completedCount}</p>
              <p className="text-sm text-gray-600 mt-1">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedStatus("cancelled")}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{cancelledCount}</p>
              <p className="text-sm text-gray-600 mt-1">Cancelled</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FilterIcon className="w-5 h-5" />
              Filter Events
            </CardTitle>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Month</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="">All Months</option>
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Year</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>Events ({filteredEvents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900">No events found</p>
              <p className="text-sm text-gray-600 mt-1">
                {hasActiveFilters
                  ? "Try adjusting your filters"
                  : "No events available"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map((event) => (
                <div key={event.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${eventTypeColors[event.type]}`}>
                      {event.type}
                    </span>
                    <Badge variant={statusColors[event.status]}>{event.status}</Badge>
                  </div>

                  <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarIcon className="w-4 h-4" />
                      <span>
                        {formatDate(event.startDate)}
                        {event.endDate !== event.startDate && ` - ${formatDate(event.endDate)}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{event.participants} participants</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/events/${event.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full gap-2">
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full gap-2"
                      onClick={() => openNotificationModal(event)}
                    >
                      <Send className="w-4 h-4" />
                      Send Notification
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Modal */}
      {showNotificationModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Send Event Notification</h2>
              <Button variant="ghost" size="icon" onClick={closeNotificationModal}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Event Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-lg mb-2">{selectedEvent.title}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    {formatDate(selectedEvent.startDate)}
                    {selectedEvent.endDate !== selectedEvent.startDate && ` - ${formatDate(selectedEvent.endDate)}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedEvent.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{selectedEvent.participants} participants</span>
                </div>
              </div>
            </div>

            {/* Audience Selection */}
            <div className="mb-4">
              <h4 className="font-semibold mb-3">Select Notification Audience:</h4>
              <p className="text-sm text-gray-600 mb-3">
                Choose who should receive the email notification about this event
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

                {/* Students + Teachers (No Staff) */}
                <div
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                    notificationAudience.includes("students") &&
                    notificationAudience.includes("teachers") &&
                    !notificationAudience.includes("staff") &&
                    !notificationAudience.includes("all")
                      ? "border-primary bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => {
                    if (
                      notificationAudience.includes("students") &&
                      notificationAudience.includes("teachers") &&
                      !notificationAudience.includes("staff")
                    ) {
                      setNotificationAudience(["all"]);
                    } else {
                      setNotificationAudience(["students", "teachers"]);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Students + Teachers</p>
                      <p className="text-sm text-gray-600">Academic community only</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={
                        (notificationAudience.includes("students") &&
                          notificationAudience.includes("teachers") &&
                          !notificationAudience.includes("staff")) ||
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
              <p className="text-sm font-medium text-gray-900">
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
