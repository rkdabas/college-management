"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function TeacherPromotionsPage() {
  const [selectedSubject, setSelectedSubject] = useState("1");

  const subjects = [
    { id: "1", name: "Database Management Systems", batch: 2021, semester: 6 },
    { id: "2", name: "Operating Systems", batch: 2021, semester: 6 },
  ];

  const students = [
    {
      id: "1",
      rollNo: "21CSE001",
      name: "Rahul Sharma",
      attendance: 88,
      grade: 85,
      assignments: 5,
      status: "pending",
      eligible: true,
    },
    {
      id: "2",
      rollNo: "21CSE002",
      name: "Priya Verma",
      attendance: 82,
      grade: 78,
      assignments: 5,
      status: "approved",
      eligible: true,
    },
    {
      id: "3",
      rollNo: "21CSE003",
      name: "Amit Kumar",
      attendance: 70,
      grade: 65,
      assignments: 4,
      status: "pending",
      eligible: false,
    },
  ];

  const currentSubject = subjects.find(s => s.id === selectedSubject);

  const handleApprove = (studentId: string) => {
    // Handle approval logic
    console.log("Approved student:", studentId);
  };

  const handleReject = (studentId: string) => {
    // Handle rejection logic
    console.log("Rejected student:", studentId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Semester Promotion</h1>
        <p className="text-gray-600">Approve or reject students for next semester promotion</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedSubject === subject.id
                    ? "border-sky-600 bg-sky-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <h3 className="font-semibold text-gray-900 mb-1">{subject.name}</h3>
                <p className="text-sm text-gray-600">Batch {subject.batch} | Sem {subject.semester}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {currentSubject && (
        <Card>
          <CardHeader>
            <CardTitle>
              {currentSubject.name} - Batch {currentSubject.batch} | Semester {currentSubject.semester}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students.map((student) => (
                <div key={student.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{student.name}</h3>
                        <Badge variant="outline">{student.rollNo}</Badge>
                        {student.status === "approved" && (
                          <Badge variant="success">Approved</Badge>
                        )}
                        {student.status === "pending" && (
                          <Badge>Pending</Badge>
                        )}
                        {!student.eligible && (
                          <Badge variant="destructive">Not Eligible</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Attendance</p>
                          <p className="font-semibold text-gray-900">{student.attendance}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Grade</p>
                          <p className="font-semibold text-gray-900">{student.grade}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Assignments</p>
                          <p className="font-semibold text-gray-900">{student.assignments}/5</p>
                        </div>
                      </div>
                      {!student.eligible && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                          <AlertCircle className="w-4 h-4" />
                          <span>Does not meet minimum requirements</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {student.status === "pending" && (
                    <div className="flex gap-2">
                      {student.eligible ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(student.id)}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(student.id)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(student.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

