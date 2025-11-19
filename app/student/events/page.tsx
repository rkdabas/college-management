"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users } from "lucide-react";

export default function StudentEventsPage() {
  const events = [
    {
      id: "1",
      title: "Annual Tech Fest 2025",
      description: "Three-day technical festival featuring coding competitions, robotics, and innovation showcases",
      type: "cultural",
      startDate: "2025-11-15",
      endDate: "2025-11-17",
      venue: "Main Campus Auditorium",
      status: "upcoming",
      registered: true,
    },
    {
      id: "2",
      title: "AI & Machine Learning Workshop",
      description: "Hands-on workshop on latest trends in AI and ML by industry experts",
      type: "workshop",
      startDate: "2025-10-20",
      endDate: "2025-10-20",
      venue: "Computer Science Lab",
      status: "upcoming",
      registered: false,
    },
    {
      id: "3",
      title: "Inter-College Sports Meet",
      description: "Annual sports competition with various indoor and outdoor games",
      type: "sports",
      startDate: "2025-12-01",
      endDate: "2025-12-05",
      venue: "Sports Complex",
      status: "upcoming",
      registered: false,
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "cultural":
        return "bg-sky-100 text-sky-700";
      case "workshop":
        return "bg-amber-100 text-amber-700";
      case "sports":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
        <p className="text-gray-600">View and register for college events</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
              </div>
              <p className="text-sm text-gray-600">{event.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {event.venue}
                </div>
              </div>
              {event.registered ? (
                <Badge variant="success" className="w-full justify-center py-2">
                  Registered
                </Badge>
              ) : (
                <Button className="w-full">Register Now</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

