"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Eye, X, Mail, Phone, Calendar, MapPin, User } from "lucide-react";

interface Student {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  phone: string;
  attendance: number;
  semester: number;
  batch: number;
  address?: string;
  dateOfBirth?: string;
  guardianName?: string;
  guardianPhone?: string;
}

export default function TeacherStudentsPage() {
  const [selectedClass, setSelectedClass] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const classes = [
    { id: "1", subject: "Database Management Systems", batch: 2021, semester: 6, students: 45 },
    { id: "2", subject: "Database Management Systems", batch: 2022, semester: 4, students: 48 },
    { id: "3", subject: "Operating Systems", batch: 2022, semester: 4, students: 42 },
  ];

  const students: Student[] = [
    { id: "1", rollNo: "21CSE001", name: "Rahul Sharma", email: "rahul@student.college.edu", phone: "+91 9876543210", attendance: 88, semester: 6, batch: 2021, address: "123 Main St, City", dateOfBirth: "2003-05-15", guardianName: "Rajesh Sharma", guardianPhone: "+91 9876543211" },
    { id: "2", rollNo: "21CSE002", name: "Priya Verma", email: "priya@student.college.edu", phone: "+91 9876543212", attendance: 82, semester: 6, batch: 2021, address: "456 Park Ave, City", dateOfBirth: "2003-08-20", guardianName: "Sunita Verma", guardianPhone: "+91 9876543213" },
    { id: "3", rollNo: "21CSE003", name: "Amit Kumar", email: "amit@student.college.edu", phone: "+91 9876543214", attendance: 75, semester: 6, batch: 2021, address: "789 Oak Rd, City", dateOfBirth: "2003-03-10", guardianName: "Vikash Kumar", guardianPhone: "+91 9876543215" },
    { id: "4", rollNo: "21CSE004", name: "Sneha Patel", email: "sneha@student.college.edu", phone: "+91 9876543216", attendance: 90, semester: 6, batch: 2021, address: "321 Elm St, City", dateOfBirth: "2003-11-25", guardianName: "Ramesh Patel", guardianPhone: "+91 9876543217" },
    { id: "5", rollNo: "21CSE005", name: "Arjun Singh", email: "arjun@student.college.edu", phone: "+91 9876543218", attendance: 85, semester: 6, batch: 2021, address: "654 Pine Ave, City", dateOfBirth: "2003-07-12", guardianName: "Suresh Singh", guardianPhone: "+91 9876543219" },
  ];

  const currentClass = classes.find(c => c.id === selectedClass);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewProfile = (student: Student) => {
    setSelectedStudent(student);
    setShowProfileModal(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Students</h1>
        <p className="text-gray-600">View and manage students in your classes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Classes</p>
              <p className="text-3xl font-bold text-gray-900">{classes.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">
                {classes.reduce((sum, c) => sum + c.students, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Current Class</p>
              <p className="text-3xl font-bold text-gray-900">
                {currentClass?.students || 0}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Avg Attendance</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / students.length)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Class</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {classes.map((classItem) => (
              <button
                key={classItem.id}
                onClick={() => setSelectedClass(classItem.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedClass === classItem.id
                    ? "border-sky-600 bg-sky-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <h3 className="font-semibold text-gray-900 mb-1">{classItem.subject}</h3>
                <p className="text-sm text-gray-600">Batch {classItem.batch} | Sem {classItem.semester}</p>
                <p className="text-sm text-gray-500 mt-1">{classItem.students} students</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {currentClass && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {currentClass.subject} - {currentClass.students} Students
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-600 to-sky-700 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.rollNo}</p>
                      <p className="text-xs text-gray-500">{student.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={student.attendance >= 75 ? "success" : "destructive"}>
                      Attendance: {student.attendance}%
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleViewProfile(student)}>
                      <Eye className="w-4 h-4 mr-1" />
                      View Profile
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Modal */}
      {showProfileModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Student Profile</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => {
                  setShowProfileModal(false);
                  setSelectedStudent(null);
                }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                  <div className="w-20 h-20 bg-gradient-to-br from-sky-600 to-sky-700 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h3>
                    <p className="text-gray-600">{selectedStudent.rollNo}</p>
                    <Badge variant={selectedStudent.attendance >= 75 ? "success" : "destructive"} className="mt-2">
                      Attendance: {selectedStudent.attendance}%
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900">{selectedStudent.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{selectedStudent.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Date of Birth</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedStudent.dateOfBirth ? new Date(selectedStudent.dateOfBirth).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Semester</p>
                      <p className="text-sm font-medium text-gray-900">Sem {selectedStudent.semester} | Batch {selectedStudent.batch}</p>
                    </div>
                  </div>
                </div>

                {selectedStudent.address && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Address</p>
                        <p className="text-sm font-medium text-gray-900">{selectedStudent.address}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedStudent.guardianName && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-semibold text-blue-900 mb-3">Guardian Information</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-blue-700 mb-1">Guardian Name</p>
                        <p className="text-sm font-medium text-blue-900">{selectedStudent.guardianName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-700 mb-1">Guardian Phone</p>
                        <p className="text-sm font-medium text-blue-900">{selectedStudent.guardianPhone}</p>
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
