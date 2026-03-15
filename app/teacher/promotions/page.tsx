"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";

interface Subject {
  id: string;
  name: string;
  code: string;
  semester: number;
  batch: number;
  branchId?: string;
}

interface Student {
  id: string;
  rollNo: string | null;
  name: string;
  semester: number | null;
  batch: number | null;
}

export default function TeacherPromotionsPage() {
  const { user } = useAuthStore();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [localStatus, setLocalStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/subjects?teacherId=${user.id}`)
      .then((res) => res.json())
      .then((data: Subject[]) => {
        const arr = Array.isArray(data) ? data : [];
        setSubjects(arr);
        if (arr.length > 0) {
          setSelectedSubject((prev) => prev || arr[0].id);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  const currentSubject = subjects.find((s) => s.id === selectedSubject);

  useEffect(() => {
    if (!currentSubject) return;
    const params = new URLSearchParams({
      semester: String(currentSubject.semester),
      batch: String(currentSubject.batch),
    });
    if (currentSubject.branchId)
      params.set("branchId", currentSubject.branchId);
    fetch(`/api/students?${params}`)
      .then((res) => res.json())
      .then((data: Student[]) => {
        setStudents(Array.isArray(data) ? data : []);
      })
      .catch(() => setStudents([]));
  }, [currentSubject]);

  const handleApprove = (studentId: string) => {
    setLocalStatus((prev) => ({ ...prev, [studentId]: "approved" }));
  };

  const handleReject = (studentId: string) => {
    setLocalStatus((prev) => ({ ...prev, [studentId]: "rejected" }));
  };

  const getStudentStatus = (studentId: string) => {
    return localStatus[studentId] || "pending";
  };

  const isEligible = () => true;

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
          Semester Promotion
        </h1>
        <p className="text-gray-600">
          Approve or reject students for next semester promotion
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedSubject === subject.id
                    ? "border-sky-600 bg-sky-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <h3 className="font-semibold text-gray-900 mb-1">
                  {subject.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Batch {subject.batch} | Sem {subject.semester}
                </p>
              </button>
            ))}
          </div>
          {subjects.length === 0 && (
            <p className="text-gray-500 py-4">No subjects assigned</p>
          )}
        </CardContent>
      </Card>

      {currentSubject && (
        <Card>
          <CardHeader>
            <CardTitle>
              {currentSubject.name} - Batch {currentSubject.batch} | Semester{" "}
              {currentSubject.semester}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students.length === 0 ? (
                <p className="text-gray-500 py-8 text-center">
                  No students in this class
                </p>
              ) : (
                students.map((student) => {
                  const status = getStudentStatus(student.id);
                  const eligible = isEligible();
                  return (
                    <div
                      key={student.id}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {student.name}
                            </h3>
                            <Badge variant="outline">
                              {student.rollNo || student.id}
                            </Badge>
                            {status === "approved" && (
                              <Badge variant="outline">Approved</Badge>
                            )}
                            {status === "pending" && (
                              <Badge>Pending</Badge>
                            )}
                            {status === "rejected" && (
                              <Badge variant="destructive">Rejected</Badge>
                            )}
                            {!eligible && (
                              <Badge variant="destructive">
                                Not Eligible
                              </Badge>
                            )}
                          </div>
                          {!eligible && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                              <AlertCircle className="w-4 h-4" />
                              <span>Does not meet minimum requirements</span>
                            </div>
                          )}
                        </div>
                        {status === "pending" && (
                          <div className="flex flex-wrap gap-2">
                            {eligible ? (
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
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
