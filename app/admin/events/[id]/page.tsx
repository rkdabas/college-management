"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Calendar, MapPin, Users, User, Mail, Phone, Clock } from "lucide-react";
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

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const event = demoEvents.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Event not found</h2>
        <Link href="/admin/events">
          <Button className="mt-4">Back to Events</Button>
        </Link>
      </div>
    );
  }

  const registeredParticipants = Math.floor(event.participants * 0.75);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/events">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Event Details</h1>
            <p className="text-gray-600 mt-1">Complete information about {event.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Users className="w-4 h-4" />
            View Participants
          </Button>
          <Button className="gap-2">
            <Edit className="w-4 h-4" />
            Edit Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${eventTypeColors[event.type]}`}>
                      {event.type}
                    </span>
                    <Badge variant={statusColors[event.status]}>{event.status}</Badge>
                  </div>
                  <h2 className="text-3xl font-bold">{event.title}</h2>
                </div>
              </div>
              <p className="text-gray-600 mt-4 leading-relaxed">{event.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-medium">{formatDate(event.startDate)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">End Date</p>
                    <p className="font-medium">{formatDate(event.endDate)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Venue</p>
                    <p className="font-medium">{event.venue}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Organizer</p>
                    <p className="font-medium">{event.organizer}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Expected Participants</p>
                    <p className="font-medium">{event.participants}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium">
                      {new Date(event.endDate).getDate() - new Date(event.startDate).getDate() + 1} days
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Registration Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Registration Progress</span>
                    <span className="font-semibold">{registeredParticipants} / {event.participants}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary rounded-full h-3 transition-all"
                      style={{ width: `${(registeredParticipants / event.participants) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center p-3 bg-sky-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{registeredParticipants}</p>
                    <p className="text-xs text-gray-600 mt-1">Registered</p>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{Math.floor(registeredParticipants * 0.9)}</p>
                    <p className="text-xs text-gray-600 mt-1">Confirmed</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{event.participants - registeredParticipants}</p>
                    <p className="text-xs text-gray-600 mt-1">Available</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: "9:00 AM", activity: "Registration & Welcome", duration: "30 mins" },
                  { time: "9:30 AM", activity: "Opening Ceremony", duration: "45 mins" },
                  { time: "10:15 AM", activity: "Keynote Session", duration: "1 hour" },
                  { time: "11:15 AM", activity: "Tea Break", duration: "15 mins" },
                  { time: "11:30 AM", activity: "Workshop Sessions", duration: "2 hours" },
                  { time: "1:30 PM", activity: "Lunch Break", duration: "1 hour" },
                  { time: "2:30 PM", activity: "Interactive Sessions", duration: "2 hours" },
                  { time: "4:30 PM", activity: "Closing Ceremony", duration: "30 mins" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-20 text-sm font-medium text-gray-600">{item.time}</div>
                      <div>
                        <p className="font-medium">{item.activity}</p>
                        <p className="text-sm text-gray-500">{item.duration}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Banner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-40 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-2xl font-bold">{event.title}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Contact Person</p>
                  <p className="font-medium">Dr. Event Coordinator</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-sm">events@college.edu</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">+91 9876543210</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Send Notification
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Download Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Export Participants
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600">
                Cancel Event
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge>Technology</Badge>
                <Badge>Innovation</Badge>
                <Badge>Students</Badge>
                <Badge>Learning</Badge>
                <Badge>Competition</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

