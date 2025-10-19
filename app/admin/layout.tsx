"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Sidebar } from "@/components/admin/sidebar";
import { Header } from "@/components/admin/header";
import { Bot, Send, X } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // AI Chat State
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([
    { role: 'assistant', content: 'Hello! I\'m your JIMS ERP AI Assistant. How can I help you with the admin panel today?' }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const newMessages = [...chatMessages, { role: 'user' as const, content: inputMessage }];
    setChatMessages(newMessages);
    setInputMessage("");

    // Simulate AI response (in real implementation, this would call an API)
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      setChatMessages([...newMessages, { role: 'assistant' as const, content: aiResponse }]);
    }, 500);
  };

  const generateAIResponse = (question: string): string => {
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes('student') && (lowerQ.includes('total') || lowerQ.includes('how many'))) {
      return `I can help you find information about students. Please navigate to the Students page to see detailed enrollment data across all programs including B.Tech, MBA, M.Tech, and BCA.`;
    } else if (lowerQ.includes('faculty') || lowerQ.includes('teacher')) {
      return `For faculty information, you can visit the Faculty page where you'll find details about all teaching staff across different departments and their subject assignments.`;
    } else if (lowerQ.includes('attendance')) {
      return `To check attendance data, navigate to the Attendance page or Dashboard. The Dashboard shows today's overall attendance trends, while the Attendance page allows you to mark and view detailed attendance records.`;
    } else if (lowerQ.includes('degree') || lowerQ.includes('program') || lowerQ.includes('branch')) {
      return `You can manage academic structure including degrees, branches, and batches in the Academic Structure page. This section allows you to view and organize all programs offered by the institution.`;
    } else if (lowerQ.includes('event')) {
      return `For event management, please visit the Events page where you can create, view, and manage college events. You can also send notifications to students and faculty about upcoming events.`;
    } else if (lowerQ.includes('announcement') || lowerQ.includes('notice')) {
      return `Visit the Announcements page to create and publish notices. You can target specific audiences and send notifications via email.`;
    } else if (lowerQ.includes('library') || lowerQ.includes('book')) {
      return `The Library page provides comprehensive library management including book inventory, issued books, overdue items, and member management.`;
    } else if (lowerQ.includes('report')) {
      return `You can generate and download various institutional reports from the Reports page. Multiple categories of reports are available including student, attendance, faculty, and library reports.`;
    } else if (lowerQ.includes('subject') || lowerQ.includes('assignment')) {
      return `For subject-teacher assignments, navigate to the Subject Assignment page where you can assign teachers to subjects for different branches and semesters.`;
    } else {
      return `I can help you navigate the admin panel and provide information about students, faculty, attendance, programs, events, library, reports, and more. What would you like to know?`;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <aside className="w-64 flex-shrink-0 border-r border-gray-200 shadow-xl">
        <Sidebar />
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8 scrollbar-professional">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      {/* AI Chat Assistant - Available on all admin pages */}
      {!showAIChat && (
        <button
          onClick={() => setShowAIChat(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-sky-600 to-sky-700 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-200 z-50 group"
        >
          <Bot className="w-8 h-8 text-white group-hover:animate-pulse" />
        </button>
      )}

      {showAIChat && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 animate-scale-in">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-sky-600 to-sky-700 p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">JIMS AI Assistant</h3>
                <p className="text-sky-100 text-xs">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setShowAIChat(false)}
              className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-professional bg-gray-50">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-sky-600 to-sky-700 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="w-4 h-4 text-sky-600" />
                      <span className="text-xs font-semibold text-sky-600">AI Assistant</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything about the admin panel..."
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="w-12 h-12 bg-gradient-to-r from-sky-600 to-sky-700 text-white rounded-xl flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              AI responses are simulated for demonstration
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
