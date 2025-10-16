"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Plus,
  Search,
  Filter as FilterIcon,
  Download,
  Upload,
  BookMarked,
  Users,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  FileText,
  Globe,
  Video,
  FileSpreadsheet,
} from "lucide-react";
import {
  demoBooks,
  demoIssuedBooks,
  demoMembers,
  demoDigitalResources,
  bookCategories,
} from "@/lib/library-data";

type ViewMode = "books" | "issued" | "members" | "digital" | "overdue" | "statistics";

export default function LibraryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("books");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Book filters
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

  // Issued books filters
  const [issuedStatus, setIssuedStatus] = useState("");
  
  // Member filters
  const [memberType, setMemberType] = useState("");
  const [memberStatus, setMemberStatus] = useState("");

  // Digital resource filters
  const [resourceType, setResourceType] = useState("");
  const [accessType, setAccessType] = useState("");

  // Get subcategories based on selected category
  const selectedCategoryData = bookCategories.find(c => c.name === selectedCategory);
  const subCategories = selectedCategoryData?.subCategories || [];

  // Statistics
  const totalBooks = demoBooks.reduce((sum, book) => sum + book.totalCopies, 0);
  const availableBooks = demoBooks.reduce((sum, book) => sum + book.availableCopies, 0);
  const issuedBooksCount = demoIssuedBooks.filter(b => b.status === "issued").length;
  const overdueCount = demoIssuedBooks.filter(b => b.status === "overdue").length;
  const totalFines = demoIssuedBooks.reduce((sum, book) => sum + book.fine, 0);
  const activeMembers = demoMembers.filter(m => m.status === "active").length;

  // Filter books
  const filteredBooks = demoBooks.filter((book) => {
    if (searchQuery && !(
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery)
    )) return false;
    if (selectedCategory && book.category !== selectedCategory) return false;
    if (selectedSubCategory && book.subCategory !== selectedSubCategory) return false;
    if (selectedStatus && book.status !== selectedStatus) return false;
    if (selectedLanguage && book.language !== selectedLanguage) return false;
    return true;
  });

  // Filter issued books
  const filteredIssuedBooks = demoIssuedBooks.filter((book) => {
    if (searchQuery && !(
      book.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    )) return false;
    if (issuedStatus && book.status !== issuedStatus) return false;
    return true;
  });

  // Filter members
  const filteredMembers = demoMembers.filter((member) => {
    if (searchQuery && !(
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    )) return false;
    if (memberType && member.type !== memberType) return false;
    if (memberStatus && member.status !== memberStatus) return false;
    return true;
  });

  // Filter digital resources
  const filteredDigitalResources = demoDigitalResources.filter((resource) => {
    if (searchQuery && !resource.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (resourceType && resource.type !== resourceType) return false;
    if (accessType && resource.accessType !== accessType) return false;
    return true;
  });

  // Overdue books
  const overdueBooks = demoIssuedBooks.filter(b => b.status === "overdue");

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSelectedStatus("");
    setSelectedLanguage("");
    setIssuedStatus("");
    setMemberType("");
    setMemberStatus("");
    setResourceType("");
    setAccessType("");
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedSubCategory || selectedStatus || 
                          selectedLanguage || issuedStatus || memberType || memberStatus || resourceType || accessType;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Library Management System</h1>
          <p className="text-gray-600 mt-1">Comprehensive library and resource management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Import Books
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add New Book
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setViewMode("books")}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Books</p>
                <p className="text-2xl font-bold mt-1">{totalBooks}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold mt-1 text-green-600">{availableBooks}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setViewMode("issued")}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Issued</p>
                <p className="text-2xl font-bold mt-1 text-orange-600">{issuedBooksCount}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BookMarked className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setViewMode("overdue")}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold mt-1 text-red-600">{overdueCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setViewMode("members")}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Members</p>
                <p className="text-2xl font-bold mt-1 text-purple-600">{activeMembers}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Fines</p>
                <p className="text-2xl font-bold mt-1 text-indigo-600">₹{totalFines}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Mode Tabs */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={viewMode === "books" ? "default" : "outline"}
              onClick={() => setViewMode("books")}
              className="gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Book Inventory
            </Button>
            <Button
              variant={viewMode === "issued" ? "default" : "outline"}
              onClick={() => setViewMode("issued")}
              className="gap-2"
            >
              <BookMarked className="w-4 h-4" />
              Issued Books
            </Button>
            <Button
              variant={viewMode === "overdue" ? "default" : "outline"}
              onClick={() => setViewMode("overdue")}
              className="gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              Overdue Books
            </Button>
            <Button
              variant={viewMode === "members" ? "default" : "outline"}
              onClick={() => setViewMode("members")}
              className="gap-2"
            >
              <Users className="w-4 h-4" />
              Members
            </Button>
            <Button
              variant={viewMode === "digital" ? "default" : "outline"}
              onClick={() => setViewMode("digital")}
              className="gap-2"
            >
              <Globe className="w-4 h-4" />
              Digital Resources
            </Button>
            <Button
              variant={viewMode === "statistics" ? "default" : "outline"}
              onClick={() => setViewMode("statistics")}
              className="gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Statistics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FilterIcon className="w-5 h-5" />
              Search & Filters
            </CardTitle>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by title, author, ISBN, student name, roll number..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Conditional Filters Based on View Mode */}
          {viewMode === "books" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubCategory("");
                  }}
                >
                  <option value="">All Categories</option>
                  {bookCategories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sub-Category</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  disabled={!selectedCategory}
                >
                  <option value="">All Sub-Categories</option>
                  {subCategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Availability</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="available">Available</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Language</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  <option value="">All Languages</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Regional">Regional</option>
                </select>
              </div>
            </div>
          )}

          {(viewMode === "issued" || viewMode === "overdue") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Issue Status</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={issuedStatus}
                  onChange={(e) => setIssuedStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="issued">Issued</option>
                  <option value="overdue">Overdue</option>
                  <option value="returned">Returned</option>
                </select>
              </div>
            </div>
          )}

          {viewMode === "members" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Member Type</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={memberType}
                  onChange={(e) => setMemberType(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={memberStatus}
                  onChange={(e) => setMemberStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>
          )}

          {viewMode === "digital" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resource Type</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={resourceType}
                  onChange={(e) => setResourceType(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="e-book">E-Book</option>
                  <option value="journal">Journal</option>
                  <option value="research-paper">Research Paper</option>
                  <option value="magazine">Magazine</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Access Type</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={accessType}
                  onChange={(e) => setAccessType(e.target.value)}
                >
                  <option value="">All Access</option>
                  <option value="free">Free</option>
                  <option value="subscribed">Subscribed</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content based on View Mode */}
      {viewMode === "books" && (
        <Card>
          <CardHeader>
            <CardTitle>Book Inventory ({filteredBooks.length} books)</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredBooks.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900">No books found</p>
                <p className="text-sm text-gray-600 mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">ISBN</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Title</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Author</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Edition</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Location</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Copies</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBooks.map((book) => (
                      <tr key={book.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-mono">{book.isbn}</td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-900">{book.title}</p>
                          <p className="text-xs text-gray-500">{book.publisher}, {book.publicationYear}</p>
                        </td>
                        <td className="py-3 px-4 text-sm">{book.author}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{book.subCategory}</Badge>
                        </td>
                        <td className="py-3 px-4 text-sm">{book.edition}</td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <MapPin className="w-3 h-3" />
                            {book.location}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <p className="font-medium text-green-600">{book.availableCopies} available</p>
                            <p className="text-xs text-gray-500">{book.totalCopies} total</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              book.status === "available"
                                ? "success"
                                : book.status === "low-stock"
                                ? "warning"
                                : "destructive"
                            }
                          >
                            {book.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {(viewMode === "issued" || viewMode === "overdue") && (
        <Card>
          <CardHeader>
            <CardTitle>
              {viewMode === "issued" ? "Issued Books" : "Overdue Books"} (
              {viewMode === "issued" ? filteredIssuedBooks.length : overdueBooks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {((viewMode === "issued" && filteredIssuedBooks.length === 0) ||
              (viewMode === "overdue" && overdueBooks.length === 0)) ? (
              <div className="text-center py-12">
                <BookMarked className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900">No {viewMode} books found</p>
                <p className="text-sm text-gray-600 mt-1">
                  {viewMode === "overdue" ? "Great! No overdue books at the moment" : "Try adjusting your filters"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Book Details</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Student</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Degree/Branch</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Issue Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Due Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Renewals</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Fine</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(viewMode === "issued" ? filteredIssuedBooks : overdueBooks).map((issued) => (
                      <tr key={issued.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-900">{issued.bookTitle}</p>
                          <p className="text-xs text-gray-500 font-mono">{issued.isbn}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-900">{issued.studentName}</p>
                          <p className="text-xs text-gray-500">{issued.rollNo}</p>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <p>{issued.degreeName}</p>
                          <p className="text-xs text-gray-500">{issued.branchName}</p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="w-3 h-3" />
                            {new Date(issued.issueDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="w-3 h-3" />
                            {new Date(issued.dueDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-center">{issued.renewalCount}</td>
                        <td className="py-3 px-4">
                          {issued.fine > 0 ? (
                            <span className="text-sm font-semibold text-red-600">₹{issued.fine}</span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              issued.status === "issued"
                                ? "default"
                                : issued.status === "returned"
                                ? "success"
                                : "destructive"
                            }
                          >
                            {issued.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {issued.status === "issued" && (
                              <>
                                <Button variant="outline" size="sm">
                                  Return
                                </Button>
                                <Button variant="outline" size="sm">
                                  Renew
                                </Button>
                              </>
                            )}
                            {issued.status === "overdue" && (
                              <Button variant="destructive" size="sm">
                                Send Reminder
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {viewMode === "members" && (
        <Card>
          <CardHeader>
            <CardTitle>Library Members ({filteredMembers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredMembers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900">No members found</p>
                <p className="text-sm text-gray-600 mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.memberId}</p>
                        <p className="text-sm text-gray-600">{member.rollNo}</p>
                      </div>
                      <Badge variant={member.type === "faculty" ? "default" : "secondary"}>
                        {member.type}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Degree:</span>
                        <span className="font-medium">{member.degreeName}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Books Issued:</span>
                        <span className="font-medium">
                          {member.booksIssued} / {member.booksLimit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Pending Fines:</span>
                        <span className={`font-semibold ${member.finesPending > 0 ? "text-red-600" : "text-green-600"}`}>
                          ₹{member.finesPending}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Member Since:</span>
                        <span className="text-xs">{new Date(member.memberSince).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t">
                      <Badge
                        variant={
                          member.status === "active"
                            ? "success"
                            : member.status === "suspended"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {member.status}
                      </Badge>
                      <div className="ml-auto flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {viewMode === "digital" && (
        <Card>
          <CardHeader>
            <CardTitle>Digital Resources ({filteredDigitalResources.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredDigitalResources.length === 0 ? (
              <div className="text-center py-12">
                <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900">No digital resources found</p>
                <p className="text-sm text-gray-600 mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDigitalResources.map((resource) => {
                  const IconComponent =
                    resource.type === "e-book"
                      ? BookOpen
                      : resource.type === "journal"
                      ? FileText
                      : resource.type === "video"
                      ? Video
                      : FileSpreadsheet;

                  return (
                    <div key={resource.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg mb-1 truncate">{resource.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{resource.author}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="outline">{resource.type}</Badge>
                            <Badge variant="outline">{resource.category}</Badge>
                            <Badge
                              variant={
                                resource.accessType === "free"
                                  ? "success"
                                  : resource.accessType === "subscribed"
                                  ? "default"
                                  : "warning"
                              }
                            >
                              {resource.accessType}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{resource.downloads} downloads</span>
                            <Button variant="outline" size="sm" className="gap-2">
                              <Eye className="w-3 h-3" />
                              Access
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {viewMode === "statistics" && (
        <div className="space-y-6">
          {/* Category-wise Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Category-wise Book Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {bookCategories.map((category) => {
                  const categoryBooks = demoBooks.filter((b) => b.category === category.name);
                  const totalCopies = categoryBooks.reduce((sum, book) => sum + book.totalCopies, 0);
                  return (
                    <div key={category.id} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">{category.name}</h4>
                      <p className="text-2xl font-bold text-primary">{totalCopies}</p>
                      <p className="text-sm text-gray-600">{categoryBooks.length} unique titles</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Library Activity Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-gray-600 text-sm mb-2">Books Issued (This Month)</p>
                  <p className="text-3xl font-bold text-blue-600">142</p>
                  <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-gray-600 text-sm mb-2">Books Returned</p>
                  <p className="text-3xl font-bold text-green-600">128</p>
                  <p className="text-xs text-green-600 mt-1">↑ 8% from last month</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-gray-600 text-sm mb-2">New Registrations</p>
                  <p className="text-3xl font-bold text-purple-600">45</p>
                  <p className="text-xs text-red-600 mt-1">↓ 5% from last month</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-gray-600 text-sm mb-2">Fines Collected</p>
                  <p className="text-3xl font-bold text-orange-600">₹8,450</p>
                  <p className="text-xs text-red-600 mt-1">↓ 15% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popular Books */}
          <Card>
            <CardHeader>
              <CardTitle>Most Issued Books</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoBooks.slice(0, 5).map((book, index) => (
                  <div key={book.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{book.title}</p>
                      <p className="text-sm text-gray-600">{book.author}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{book.issuedCopies}</p>
                      <p className="text-xs text-gray-600">times issued</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
