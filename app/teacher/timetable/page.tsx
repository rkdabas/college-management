"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Clock, MapPin, Users, Calendar as CalendarIcon } from "lucide-react";
import { useAuthStore } from "@/lib/store";

interface TimetableEntry {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
  subject: {
    id: string;
    name: string;
    code: string;
    semester: number;
    batch: number;
  };
}

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function TeacherTimetablePage() {
  const { user } = useAuthStore();
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/timetable?teacherId=${user.id}`)
      .then((res) => res.json())
      .then((data: TimetableEntry[]) => {
        setTimetable(Array.isArray(data) ? data : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  const getDayName = (date: Date) => DAYS[date.getDay()];

  const timetableByDay = useMemo(() => {
    const map: Record<string, TimetableEntry[]> = {};
    DAYS.forEach((d) => (map[d] = []));
    timetable.forEach((entry) => {
      if (!map[entry.dayOfWeek]) map[entry.dayOfWeek] = [];
      map[entry.dayOfWeek].push(entry);
    });
    return map;
  }, [timetable]);

  const selectedDayClasses = useMemo(() => {
    const dayName = getDayName(selectedDate);
    return timetableByDay[dayName] || [];
  }, [selectedDate, timetableByDay]);

  const classesCalendarData = useMemo(() => {
    const data: Record<string, "present"> = {};
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i - 30);
      const dayName = getDayName(date);
      if (
        timetableByDay[dayName] &&
        timetableByDay[dayName].length > 0
      ) {
        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        data[dateKey] = "present";
      }
    }
    return data;
  }, [timetableByDay]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-500">Loading timetable...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          My Timetable
        </h1>
        <p className="text-gray-600">
          View your teaching schedule with calendar
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            attendanceData={classesCalendarData}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Selected Date</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-xs text-gray-500">
              {selectedDayClasses.length > 0
                ? `${selectedDayClasses.length} class(es) scheduled`
                : "No classes scheduled"}
            </p>
          </CardContent>
        </Card>
      </div>

      {selectedDayClasses.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Classes for {getDayName(selectedDate)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedDayClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-semibold text-gray-900">
                          {classItem.startTime} - {classItem.endTime}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">
                        {classItem.subject.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {classItem.room}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Batch {classItem.subject.batch} | Sem{" "}
                          {classItem.subject.semester}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No classes scheduled for this day
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {DAYS.slice(1).map((day) => (
              <div
                key={day}
                className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
              >
                <h3 className="font-semibold text-gray-900 mb-3">{day}</h3>
                {(timetableByDay[day] || []).length > 0 ? (
                  <div className="space-y-2">
                    {(timetableByDay[day] || []).map((classItem) => (
                      <div
                        key={classItem.id}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-semibold text-gray-900">
                              {classItem.startTime} - {classItem.endTime}
                            </span>
                            <p className="text-sm text-gray-700 mt-1">
                              {classItem.subject.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {classItem.room} | Batch{" "}
                              {classItem.subject.batch}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No classes</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
