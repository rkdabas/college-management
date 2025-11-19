"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  attendanceData?: Record<string, "present" | "absent" | "leave">;
  className?: string;
}

export function Calendar({ selectedDate, onDateSelect, attendanceData = {}, className }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getAttendanceStatus = (date: Date) => {
    const key = formatDateKey(date);
    return attendanceData[key];
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onDateSelect(newDate);
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <div className={cn("bg-white rounded-xl border border-gray-200 p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="h-10" />;
          }

          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const dateKey = formatDateKey(date);
          const attendanceStatus = getAttendanceStatus(date);
          const isSelected = isSameDay(date, selectedDate);
          const isTodayDate = isToday(date);

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={cn(
                "h-10 rounded-lg text-sm font-medium transition-all relative",
                isSelected
                  ? "bg-sky-600 text-white shadow-md"
                  : isTodayDate
                  ? "bg-sky-50 text-sky-700 border-2 border-sky-600"
                  : "text-gray-900 hover:bg-gray-100",
                attendanceStatus === "present" && !isSelected && "bg-emerald-50 text-emerald-700",
                attendanceStatus === "absent" && !isSelected && "bg-red-50 text-red-700",
                attendanceStatus === "leave" && !isSelected && "bg-amber-50 text-amber-700"
              )}
            >
              {day}
              {attendanceStatus && (
                <span className={cn(
                  "absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full",
                  attendanceStatus === "present" && "bg-emerald-600",
                  attendanceStatus === "absent" && "bg-red-600",
                  attendanceStatus === "leave" && "bg-amber-600",
                  isSelected && "bg-white"
                )} />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-600" />
          <span className="text-gray-600">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-600" />
          <span className="text-gray-600">Absent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-600" />
          <span className="text-gray-600">Leave</span>
        </div>
      </div>
    </div>
  );
}

