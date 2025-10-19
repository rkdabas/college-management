"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Bell, Search, LogOut, User, ChevronDown } from "lucide-react";

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

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
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative hover:bg-gray-100 rounded-xl transition-colors duration-200"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </Button>

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
