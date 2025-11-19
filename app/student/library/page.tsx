"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, AlertCircle, CheckCircle } from "lucide-react";

export default function StudentLibraryPage() {
  const issuedBooks = [
    {
      id: "1",
      title: "Database System Concepts",
      author: "Abraham Silberschatz",
      isbn: "978-0073523323",
      issueDate: "2025-01-10",
      dueDate: "2025-02-10",
      status: "active",
    },
    {
      id: "2",
      title: "Operating System Concepts",
      author: "Abraham Silberschatz",
      isbn: "978-1118063330",
      issueDate: "2025-01-15",
      dueDate: "2025-02-15",
      status: "active",
    },
    {
      id: "3",
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen",
      isbn: "978-0262033848",
      issueDate: "2024-12-01",
      dueDate: "2025-01-01",
      status: "overdue",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Library</h1>
        <p className="text-gray-600">Manage your issued books and browse library resources</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Issued Books</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {issuedBooks.map((book) => (
              <div key={book.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>ISBN: {book.isbn}</span>
                      <span>Issued: {new Date(book.issueDate).toLocaleDateString()}</span>
                      <span>Due: {new Date(book.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Badge variant={book.status === "overdue" ? "destructive" : "success"}>
                    {book.status === "overdue" ? "Overdue" : "Active"}
                  </Badge>
                </div>
                {book.status === "active" && (
                  <Button variant="outline" size="sm">Renew Book</Button>
                )}
                {book.status === "overdue" && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>Please return this book immediately</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Browse Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Library catalog and search functionality</p>
            <Button className="mt-4">Browse Books</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

