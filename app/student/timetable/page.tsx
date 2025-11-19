"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Clock, MapPin, User } from "lucide-react";

export default function StudentTimetablePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const timetable = [
    { day: "Monday", classes: [
      { time: "09:00 - 10:00", subject: "Database Management Systems", room: "LT-101", teacher: "Dr. Rajesh Kumar" },
      { time: "11:00 - 12:00", subject: "Operating Systems", room: "LT-102", teacher: "Dr. Sunita Sharma" },
      { time: "02:00 - 04:00", subject: "AI/ML", room: "Lab-3", teacher: "Dr. Priya Malhotra" },
    ]},
    { day: "Tuesday", classes: [
      { time: "09:00 - 10:00", subject: "Software Engineering", room: "LT-103", teacher: "Prof. Amit Gupta" },
      { time: "11:00 - 12:00", subject: "Operating Systems", room: "LT-102", teacher: "Dr. Sunita Sharma" },
    ]},
    { day: "Wednesday", classes: [
      { time: "09:00 - 10:00", subject: "Database Management Systems", room: "LT-101", teacher: "Dr. Rajesh Kumar" },
      { time: "02:00 - 04:00", subject: "AI/ML", room: "Lab-3", teacher: "Dr. Priya Malhotra" },
    ]},
    { day: "Thursday", classes: [
      { time: "09:00 - 10:00", subject: "Software Engineering", room: "LT-103", teacher: "Prof. Amit Gupta" },
      { time: "11:00 - 12:00", subject: "Operating Systems", room: "LT-102", teacher: "Dr. Sunita Sharma" },
    ]},
    { day: "Friday", classes: [
      { time: "09:00 - 10:00", subject: "Database Management Systems", room: "LT-101", teacher: "Dr. Rajesh Kumar" },
      { time: "02:00 - 04:00", subject: "Web Development", room: "Lab-1", teacher: "Dr. Anjali Mehta" },
    ]},
  ];

  const getDayName = (date: Date) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
  };

  // Get classes for selected date
  const selectedDayClasses = useMemo(() => {
    const dayName = getDayName(selectedDate);
    const dayData = timetable.find(d => d.day === dayName);
    return dayData?.classes || [];
  }, [selectedDate]);

  // Mark dates with classes in calendar
  const classesCalendarData = useMemo(() => {
    const data: Record<string, "present"> = {};
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = getDayName(date);
      const dayData = timetable.find(d => d.day === dayName);
      if (dayData && dayData.classes.length > 0) {
        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        data[dateKey] = "present";
      }
    }
    return data;
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Timetable</h1>
        <p className="text-gray-600">Weekly class schedule for current semester</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            attendanceData={classesCalendarData}
          />
        </div>

        {/* Selected Date Classes */}
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
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-semibold text-gray-900">{classItem.time}</span>
                          </div>
                          <h3 className="font-bold text-gray-900 mb-2">{classItem.subject}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {classItem.room}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {classItem.teacher}
                            </div>
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

      {/* Weekly View */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Timetable</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timetable.map((day, index) => (
              <div key={index}>
                <h3 className="font-semibold text-gray-900 mb-3">{day.day}</h3>
                <div className="space-y-3">
                  {day.classes.map((classItem, classIndex) => (
                    <div key={classIndex} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-semibold text-gray-900">{classItem.time}</span>
                          </div>
                          <h3 className="font-bold text-gray-900 mb-2">{classItem.subject}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {classItem.room}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {classItem.teacher}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

