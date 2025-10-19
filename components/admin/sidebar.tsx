"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  BookOpen,
  Settings,
  BarChart3,
  Library,
  ClipboardList,
  Bell,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: "Academic Structure",
    href: "/admin/academic-structure",
    icon: <GraduationCap className="w-5 h-5" />,
  },
  {
    title: "Students",
    href: "/admin/students",
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: "Faculty",
    href: "/admin/faculty",
    icon: <GraduationCap className="w-5 h-5" />,
  },
  {
    title: "Subject Assignment",
    href: "/admin/courses",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    title: "Attendance",
    href: "/admin/attendance",
    icon: <ClipboardList className="w-5 h-5" />,
  },
  {
    title: "Events",
    href: "/admin/events",
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    title: "Library",
    href: "/admin/library",
    icon: <Library className="w-5 h-5" />,
  },
  {
    title: "Announcements",
    href: "/admin/announcements",
    icon: <Bell className="w-5 h-5" />,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white shadow-xl">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-sky-600 to-sky-700 rounded-xl flex items-center justify-center shadow-md shadow-sky-600/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg tracking-tight text-gray-900">JIMS ERP</h2>
            <p className="text-xs text-gray-500 font-medium">Admin Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 scrollbar-professional">
        <div className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-lg shadow-sky-600/20"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <span className={cn(
                  "transition-transform duration-200",
                  isActive ? "scale-110" : "group-hover:scale-110"
                )}>
                  {item.icon}
                </span>
                <span className="tracking-tight">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-700 mb-1">Need Help?</p>
          <p className="text-xs text-gray-500 mb-3">Contact support team for assistance</p>
          <button className="w-full px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg transition-colors duration-200 border border-gray-200">
            Get Support
          </button>
        </div>
      </div>
    </div>
  );
}
