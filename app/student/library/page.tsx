"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Calendar, AlertCircle, Search } from "lucide-react";
import { useAuthStore } from "@/lib/store";

interface IssuedBook {
  id: string;
  bookId: string;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  status: string;
  book: { id: string; title: string; author: string; isbn: string };
}

interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  available: number;
}

export default function StudentLibraryPage() {
  const { user } = useAuthStore();
  const [issuedBooks, setIssuedBooks] = useState<IssuedBook[]>([]);
  const [browseBooks, setBrowseBooks] = useState<LibraryBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [browseLoading, setBrowseLoading] = useState(false);
  const [showBrowse, setShowBrowse] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [renewingId, setRenewingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/library/issues?studentId=${user.id}`)
      .then((res) => res.ok ? res.json() : [])
      .then(setIssuedBooks)
      .catch(() => setIssuedBooks([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const fetchBrowseBooks = () => {
    setBrowseLoading(true);
    const url = searchQuery ? `/api/library/books?search=${encodeURIComponent(searchQuery)}` : "/api/library/books";
    fetch(url)
      .then((res) => res.ok ? res.json() : [])
      .then(setBrowseBooks)
      .catch(() => setBrowseBooks([]))
      .finally(() => setBrowseLoading(false));
  };

  const handleRenew = async (id: string) => {
    setRenewingId(id);
    try {
      const res = await fetch("/api/library/issues", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "renew" }),
      });
      if (res.ok) {
        const updated = await res.json();
        setIssuedBooks((prev) =>
          prev.map((b) => (b.id === id ? { ...b, dueDate: updated.dueDate } : b))
        );
      } else {
        const err = await res.json();
        alert(err.error ?? "Failed to renew");
      }
    } catch {
      alert("Failed to renew book");
    } finally {
      setRenewingId(null);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Library</h1>
        <p className="text-gray-600">Manage your issued books and browse library resources</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Issued Books</CardTitle>
        </CardHeader>
        <CardContent>
          {issuedBooks.length > 0 ? (
            <div className="space-y-4">
              {issuedBooks.map((book) => (
                <div key={book.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{book.book?.title ?? "Book"}</h3>
                      <p className="text-sm text-gray-600 mb-2">by {book.book?.author ?? "-"}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>ISBN: {book.book?.isbn ?? "-"}</span>
                        <span>Issued: {new Date(book.issueDate).toLocaleDateString()}</span>
                        <span>Due: {new Date(book.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge variant={book.status === "overdue" ? "destructive" : "success"}>
                      {book.status === "overdue" ? "Overdue" : "Active"}
                    </Badge>
                  </div>
                  {book.status === "active" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRenew(book.id)}
                      disabled={renewingId === book.id}
                    >
                      {renewingId === book.id ? "Renewing..." : "Renew Book"}
                    </Button>
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
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No books currently issued</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Browse Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search by title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={() => {
                  setShowBrowse(true);
                  fetchBrowseBooks();
                }}
              >
                Browse Books
              </Button>
            </div>
            {showBrowse && (
              <div className="mt-4">
                {browseLoading ? (
                  <p className="text-gray-500">Loading...</p>
                ) : browseBooks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {browseBooks.map((book) => (
                      <div key={book.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <h4 className="font-semibold text-gray-900">{book.title}</h4>
                        <p className="text-sm text-gray-600">by {book.author}</p>
                        <p className="text-xs text-gray-500 mt-1">ISBN: {book.isbn}</p>
                        <Badge variant="outline" className="mt-2">
                          {book.available} available
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No books found</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
