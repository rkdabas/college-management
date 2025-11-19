"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Clock, MapPin, Users, Calendar as CalendarIcon } from "lucide-react";

export default function TeacherTimetablePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Timetable data with day mapping
  const timetableData: Record<string, Array<{
    time: string;
    subject: string;
    room: string;
    batch: number;
    semester: number;
  }>> = {
    "Monday": [
      { time: "09:00 - 10:00", subject: "Database Management Systems", room: "LT-101", batch: 2021, semester: 6 },
      { time: "11:00 - 12:00", subject: "Database Management Systems", room: "LT-102", batch: 2022, semester: 4 },
    ],
    "Tuesday": [
      { time: "11:00 - 12:00", subject: "Operating Systems", room: "LT-102", batch: 2022, semester: 4 },
    ],
    "Wednesday": [
      { time: "09:00 - 10:00", subject: "Database Management Systems", room: "LT-101", batch: 2021, semester: 6 },
    ],
    "Thursday": [
      { time: "11:00 - 12:00", subject: "Operating Systems", room: "LT-102", batch: 2022, semester: 4 },
    ],
    "Friday": [
      { time: "09:00 - 10:00", subject: "Database Management Systems", room: "LT-101", batch: 2021, semester: 6 },
      { time: "11:00 - 12:00", subject: "Database Management Systems", room: "LT-102", batch: 2022, semester: 4 },
    ],
  };

  // Get day name from date
  const getDayName = (date: Date) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
  };

  // Get classes for selected date
  const selectedDayClasses = useMemo(() => {
    const dayName = getDayName(selectedDate);
    return timetableData[dayName] || [];
  }, [selectedDate]);

  // Mark dates with classes in calendar
  const classesCalendarData = useMemo(() => {
    const data: Record<string, "present"> = {};
    // This is a simplified version - in real app, you'd mark all dates that have classes
    // For demo, we'll mark some dates
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = getDayName(date);
      if (timetableData[dayName] && timetableData[dayName].length > 0) {
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
        <p className="text-gray-600">View your teaching schedule with calendar</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            attendanceData={classesCalendarData}
          />
        </div>

        {/* Selected Date Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Selected Date</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-xs text-gray-500">
              {selectedDayClasses.length > 0 
                ? `${selectedDayClasses.length} class(es) scheduled`
                : "No classes scheduled"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Classes for Selected Date */}
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
                          <Users className="w-4 h-4" />
                          Batch {classItem.batch} | Sem {classItem.semester}
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
              <p className="text-gray-600">No classes scheduled for this day</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly View */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(timetableData).map(([day, classes]) => (
              <div key={day} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <h3 className="font-semibold text-gray-900 mb-3">{day}</h3>
                {classes.length > 0 ? (
                  <div className="space-y-2">
                    {classes.map((classItem, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-semibold text-gray-900">{classItem.time}</span>
                            <p className="text-sm text-gray-700 mt-1">{classItem.subject}</p>
                            <p className="text-xs text-gray-500 mt-1">{classItem.room} | Batch {classItem.batch}</p>
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

