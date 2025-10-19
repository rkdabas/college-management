"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, LogOut, User, ChevronDown, Calendar, AlertCircle, CheckCircle, X } from "lucide-react";

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    type: "alert",
    title: "Low Attendance Alert",
    message: "5 students have attendance below 75% this week",
    time: "5 minutes ago",
    unread: true,
    icon: AlertCircle,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    id: 2,
    type: "event",
    title: "Upcoming Event",
    message: "Annual Tech Fest 2025 starts in 3 days",
    time: "1 hour ago",
    unread: true,
    icon: Calendar,
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
  {
    id: 3,
    type: "success",
    title: "Report Generated",
    message: "Student attendance report for January is ready",
    time: "2 hours ago",
    unread: true,
    icon: CheckCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    id: 4,
    type: "info",
    title: "New Faculty Added",
    message: "Dr. Sarah Johnson joined Computer Science department",
    time: "5 hours ago",
    unread: false,
    icon: User,
    color: "text-gray-600",
    bg: "bg-gray-50",
  },
  {
    id: 5,
    type: "event",
    title: "Exam Schedule Released",
    message: "Mid-term examination schedule has been published",
    time: "1 day ago",
    unread: false,
    icon: Calendar,
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
];

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center flex-1 gap-6">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search students, faculty, courses..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative" ref={notificationRef}>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                  {unreadCount}
                </span>
              </>
            )}
          </Button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 animate-scale-in">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">Notifications</h3>
                  <p className="text-xs text-gray-500">{unreadCount} unread messages</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-sky-600 hover:text-sky-700 font-medium"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto scrollbar-professional">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                        notification.unread ? 'bg-sky-50/30' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 ${notification.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <notification.icon className={`w-5 h-5 ${notification.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-sm text-gray-900">{notification.title}</h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <p className="text-xs text-gray-500">{notification.time}</p>
                            {notification.unread && (
                              <span className="w-2 h-2 bg-sky-600 rounded-full"></span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 text-center">
                  <button className="text-sm text-sky-600 hover:text-sky-700 font-medium">
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-gray-200 mx-2"></div>

        <div className="flex items-center gap-3 group cursor-pointer hover:bg-gray-50 rounded-xl px-3 py-2 transition-all duration-200">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800 tracking-tight">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize font-medium">{user?.role}</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-sky-600 to-sky-700 rounded-xl flex items-center justify-center shadow-sm">
            <User className="w-5 h-5 text-white" />
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleLogout}
          className="hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
