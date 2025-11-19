"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Calendar as CalendarIcon, MapPin, Users, Send, X, Eye, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const eventTypeColors: Record<string, string> = {
  academic: "bg-sky-100 text-sky-700",
  cultural: "bg-amber-100 text-amber-700",
  sports: "bg-emerald-100 text-emerald-700",
  workshop: "bg-gray-100 text-gray-700",
  seminar: "bg-slate-100 text-slate-700",
  other: "bg-gray-100 text-gray-700",
};

export default function TeacherEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Department Meeting",
      description: "Monthly department meeting to discuss academic matters",
      startDate: "2025-01-30",
      endDate: "2025-01-30",
      venue: "Conference Hall",
      type: "academic",
      status: "upcoming",
      organizer: "CS Department",
    },
    {
      id: "2",
      title: "Faculty Development Program",
      description: "Workshop on modern teaching methodologies",
      startDate: "2025-02-10",
      endDate: "2025-02-10",
      venue: "Seminar Hall",
      type: "workshop",
      status: "upcoming",
      organizer: "Training Department",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [notificationAudience, setNotificationAudience] = useState<string[]>(["all"]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    type: "academic",
    startDate: "",
    endDate: "",
    venue: "",
    organizer: "",
  });

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

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const event = {
      id: String(events.length + 1),
      ...newEvent,
      status: "upcoming",
      participants: 0,
    };
    setEvents([...events, event]);
    setShowAddModal(false);
    setNewEvent({
      title: "",
      description: "",
      type: "academic",
      startDate: "",
      endDate: "",
      venue: "",
      organizer: "",
    });
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
          <p className="text-gray-600">Create and manage events, send notifications</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Events</p>
              <p className="text-3xl font-bold text-gray-900">{events.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Upcoming</p>
              <p className="text-3xl font-bold text-gray-900">
                {events.filter((e) => e.status === "upcoming").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Ongoing</p>
              <p className="text-3xl font-bold text-gray-900">
                {events.filter((e) => e.status === "ongoing").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-gray-900">
                {events.filter((e) => e.status === "completed").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <Badge className={eventTypeColors[event.type] || eventTypeColors.other}>
                  {event.type}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{event.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarIcon className="w-4 h-4" />
                  {new Date(event.startDate).toLocaleDateString()}
                  {event.endDate !== event.startDate && ` - ${new Date(event.endDate).toLocaleDateString()}`}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {event.venue}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  {event.organizer}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openNotificationModal(event)}
                  className="flex-1"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Send Notification
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteEvent(event.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Create New Event</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                    rows={3}
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Event Type *</Label>
                    <select
                      id="type"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                      required
                    >
                      <option value="academic">Academic</option>
                      <option value="cultural">Cultural</option>
                      <option value="sports">Sports</option>
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="venue">Venue *</Label>
                    <Input
                      id="venue"
                      value={newEvent.venue}
                      onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newEvent.startDate}
                      onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newEvent.endDate}
                      onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="organizer">Organizer *</Label>
                  <Input
                    id="organizer"
                    value={newEvent.organizer}
                    onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">Create Event</Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notification Modal */}
      {showNotificationModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Send Notification</CardTitle>
                <Button variant="ghost" size="icon" onClick={closeNotificationModal}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Event:</p>
                  <p className="text-sm text-gray-600">{selectedEvent.title}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-3">Select Audience:</p>
                  <div className="space-y-2">
                    {[
                      { value: "all", label: "All Users" },
                      { value: "students", label: "Students Only" },
                      { value: "teachers", label: "Teachers Only" },
                      { value: "staff", label: "Staff Only" },
                      { value: "teachers-staff", label: "Teachers + Staff" },
                      { value: "students-teachers", label: "Students + Teachers" },
                    ].map((audience) => (
                      <label
                        key={audience.value}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={notificationAudience.includes(audience.value)}
                          onChange={() => toggleAudience(audience.value)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">{audience.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={sendNotification} className="flex-1">
                    <Send className="w-4 h-4 mr-2" />
                    Send Notification
                  </Button>
                  <Button variant="outline" onClick={closeNotificationModal}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

