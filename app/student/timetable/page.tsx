"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Clock, MapPin, User } from "lucide-react";
import { useAuthStore } from "@/lib/store";

interface TimetableEntry {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
  subject: { id: string; name: string; code: string };
}

interface DaySchedule {
  day: string;
  classes: { time: string; subject: string; room: string; code: string }[];
}

export default function StudentTimetablePage() {
  const { user } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.semester || !user?.batch || !user?.branchId || !user?.degreeId) return;
    fetch(`/api/timetable?semester=${user.semester}&batch=${user.batch}&branchId=${user.branchId}&degreeId=${user.degreeId}`)
      .then((res) => res.ok ? res.json() : [])
      .then(setEntries)
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [user?.semester, user?.batch, user?.branchId, user?.degreeId]);

  const timetable: DaySchedule[] = useMemo(() => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    return days.map((day) => {
      const dayEntries = entries
        .filter((e) => e.dayOfWeek === day)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
      return {
        day,
        classes: dayEntries.map((e) => ({
          time: `${e.startTime} - ${e.endTime}`,
          subject: e.subject.name,
          room: e.room,
          code: e.subject.code,
        })),
      };
    }).filter((d) => d.classes.length > 0);
  }, [entries]);

  const getDayName = useCallback((date: Date) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
  }, []);

  const selectedDayClasses = useMemo(() => {
    const dayName = getDayName(selectedDate);
    const dayData = timetable.find((d) => d.day === dayName);
    return dayData?.classes || [];
  }, [selectedDate, timetable, getDayName]);

  const classesCalendarData = useMemo(() => {
    const data: Record<string, "present"> = {};
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = getDayName(date);
      const dayData = timetable.find((d) => d.day === dayName);
      if (dayData && dayData.classes.length > 0) {
        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        data[dateKey] = "present";
      }
    }
    return data;
  }, [timetable, getDayName]);

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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Timetable</h1>
        <p className="text-gray-600">Weekly class schedule for current semester</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            attendanceData={classesCalendarData}
          />
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Classes for {getDayName(selectedDate)} - {selectedDate.toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDayClasses.length > 0 ? (
                <div className="space-y-3">
                  {selectedDayClasses.map((classItem, classIndex) => (
                    <div key={classIndex} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-semibold text-gray-900">{classItem.time}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">{classItem.subject}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {classItem.room}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-12">
                  <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No classes scheduled for this day</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Timetable</CardTitle>
        </CardHeader>
        <CardContent>
          {timetable.length > 0 ? (
            <div className="space-y-4">
              {timetable.map((day, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-900 mb-3">{day.day}</h3>
                  <div className="space-y-3">
                    {day.classes.map((classItem, classIndex) => (
                      <div key={classIndex} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-semibold text-gray-900">{classItem.time}</span>
                          </div>
                          <h3 className="font-bold text-gray-900 mb-2">{classItem.subject}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {classItem.room}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-12">
              <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No timetable entries found for this semester</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}