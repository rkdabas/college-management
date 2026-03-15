"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock } from "lucide-react";
import { useAuthStore } from "@/lib/store";

interface Event {
  id: string;
  title: string;
  description: string | null;
  type: string;
  startDate: string;
  endDate: string;
  venue: string;
  status: string;
  registered?: boolean;
}

export default function StudentEventsPage() {
  const { user } = useAuthStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  useEffect(() => {
    const url = user?.id ? `/api/events?studentId=${user.id}` : "/api/events";
    fetch(url)
      .then((res) => res.ok ? res.json() : [])
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const handleRegister = async (eventId: string) => {
    if (!user?.id) return;
    setRegisteringId(eventId);
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: user.id }),
      });
      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, registered: true } : e))
        );
      } else {
        const err = await res.json();
        alert(err.error ?? "Failed to register");
      }
    } catch {
      alert("Failed to register");
    } finally {
      setRegisteringId(null);
    }
  };

  const handleWithdraw = async (eventId: string) => {
    if (!user?.id) return;
    setWithdrawingId(eventId);
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: user.id }),
      });
      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, registered: false } : e))
        );
      } else {
        const err = await res.json();
        alert(err.error ?? "Failed to withdraw");
      }
    } catch {
      alert("Failed to withdraw registration");
    } finally {
      setWithdrawingId(null);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
        <p className="text-gray-600">View and register for college events</p>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
                </div>
                <p className="text-sm text-gray-600">{event.description ?? "No description"}</p>
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
                  <div className="flex flex-col gap-2">
                    <Badge variant="success" className="w-full justify-center py-2">
                      Registered
                    </Badge>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleWithdraw(event.id)}
                      disabled={withdrawingId === event.id}
                    >
                      {withdrawingId === event.id ? "Withdrawing..." : "Withdraw registration"}
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleRegister(event.id)}
                    disabled={registeringId === event.id}
                  >
                    {registeringId === event.id ? "Registering..." : "Register Now"}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No events available</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
