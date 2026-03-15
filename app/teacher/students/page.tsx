"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Eye,
  X,
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";

interface Student {
  id: string;
  rollNo: string | null;
  name: string;
  email: string;
  phone: string | null;
  semester: number | null;
  batch: number | null;
  address?: string | null;
  dateOfBirth?: string | null;
  guardianName?: string | null;
  guardianPhone?: string | null;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  semester: number;
  batch: number;
  branchId?: string;
}

export default function TeacherStudentsPage() {
  const { user } = useAuthStore();
  const [classes, setClasses] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/subjects?teacherId=${user.id}`)
      .then((res) => res.json())
      .then((subjects: Subject[]) => {
        const arr = Array.isArray(subjects) ? subjects : [];
        setClasses(arr);
        if (arr.length > 0) {
          setSelectedClass((prev) => prev || arr[0].id);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  const currentClass = classes.find((c) => c.id === selectedClass);

  useEffect(() => {
    if (!currentClass) return;
    const params = new URLSearchParams({
      semester: String(currentClass.semester),
      batch: String(currentClass.batch),
    });
    if (currentClass.branchId) params.set("branchId", currentClass.branchId);
    fetch(`/api/students?${params}`)
      .then((res) => res.json())
      .then((data: Student[]) => {
        setStudents(Array.isArray(data) ? data : []);
      })
      .catch(() => setStudents([]));
  }, [currentClass]);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.rollNo || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.email || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const handleViewProfile = (student: Student) => {
    setSelectedStudent(student);
    setShowProfileModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          My Students
        </h1>
        <p className="text-gray-600">
          View and manage students in your classes
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Classes</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {classes.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Students</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {students.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Current Class</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {currentClass ? filteredStudents.length : 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Class</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {classes.map((classItem) => (
              <button
                key={classItem.id}
                onClick={() => setSelectedClass(classItem.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedClass === classItem.id
                    ? "border-sky-600 bg-sky-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <h3 className="font-semibold text-gray-900 mb-1">
                  {classItem.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Batch {classItem.batch} | Sem {classItem.semester}
                </p>
              </button>
            ))}
          </div>
          {classes.length === 0 && (
            <p className="text-gray-500 py-4">No classes assigned</p>
          )}
        </CardContent>
      </Card>

      {currentClass && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>
                {currentClass.name} - {students.length} Students
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredStudents.length === 0 ? (
                <p className="text-gray-500 py-8 text-center">
                  No students in this class
                </p>
              ) : (
                filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow gap-3"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-sky-600 to-sky-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {student.rollNo || student.id}
                        </p>
                        <p className="text-xs text-gray-500">
                          {student.email || "—"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewProfile(student)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Profile
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {showProfileModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Student Profile</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowProfileModal(false);
                    setSelectedStudent(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                  <div className="w-20 h-20 bg-gradient-to-br from-sky-600 to-sky-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedStudent.name}
                    </h3>
                    <p className="text-gray-600">
                      {selectedStudent.rollNo || selectedStudent.id}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedStudent.email || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedStudent.phone || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Date of Birth</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedStudent.dateOfBirth
                          ? new Date(
                              selectedStudent.dateOfBirth
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Semester</p>
                      <p className="text-sm font-medium text-gray-900">
                        Sem {selectedStudent.semester ?? "—"} | Batch{" "}
                        {selectedStudent.batch ?? "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedStudent.address && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Address</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedStudent.address}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedStudent.guardianName && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-semibold text-blue-900 mb-3">
                      Guardian Information
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-blue-700 mb-1">
                          Guardian Name
                        </p>
                        <p className="text-sm font-medium text-blue-900">
                          {selectedStudent.guardianName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-700 mb-1">
                          Guardian Phone
                        </p>
                        <p className="text-sm font-medium text-blue-900">
                          {selectedStudent.guardianPhone || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
