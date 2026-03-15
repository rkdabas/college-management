"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  FileText,
  Trash2,
  Plus,
  X,
  File,
  Image as ImageIcon,
  Video,
  FileSpreadsheet,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";

interface Material {
  id: string;
  title: string;
  description: string | null;
  type: string;
  fileSize: string | null;
  createdAt: string;
  subject: { id: string; name: string; semester: number; batch: number };
}

interface Subject {
  id: string;
  name: string;
  code: string;
  semester: number;
  batch: number;
}

export default function TeacherMaterialsPage() {
  const { user } = useAuthStore();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newMaterial, setNewMaterial] = useState({
    title: "",
    description: "",
    subjectId: "",
    type: "document" as string,
  });

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([
      fetch(`/api/materials?teacherId=${user.id}`).then((r) => r.json()),
      fetch(`/api/subjects?teacherId=${user.id}`).then((r) => r.json()),
    ])
      .then(([mats, subs]) => {
        setMaterials(Array.isArray(mats) ? mats : []);
        setSubjects(Array.isArray(subs) ? subs : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="w-5 h-5" />;
      case "video":
        return <Video className="w-5 h-5" />;
      case "image":
        return <ImageIcon className="w-5 h-5" />;
      case "spreadsheet":
        return <FileSpreadsheet className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !newMaterial.subjectId) return;
    setSaving(true);
    try {
      const res = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newMaterial,
          teacherId: user.id,
        }),
      });
      const created = await res.json();
      if (res.ok) {
        setMaterials((prev) => [created, ...prev]);
        setShowUploadModal(false);
        setNewMaterial({
          title: "",
          description: "",
          subjectId: "",
          type: "document",
        });
        alert("Material uploaded successfully!");
      } else {
        alert(created.error || "Failed to upload material.");
      }
    } catch {
      alert("Failed to upload material.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this material?")) return;
    try {
      const res = await fetch("/api/materials", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setMaterials((prev) => prev.filter((m) => m.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete material.");
      }
    } catch {
      alert("Failed to delete material.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-500">Loading materials...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Course Materials
          </h1>
          <p className="text-gray-600">
            Upload and manage study materials for your classes
          </p>
        </div>
        <Button onClick={() => setShowUploadModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Upload Material
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Materials</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {materials.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Documents</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {materials.filter((m) => m.type === "document").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Videos</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {materials.filter((m) => m.type === "video").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {materials.length === 0 ? (
              <p className="text-gray-500 py-8 text-center">
                No materials uploaded yet
              </p>
            ) : (
              materials.map((material) => (
                <div
                  key={material.id}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 flex-shrink-0">
                        {getFileIcon(material.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="font-bold text-gray-900">
                            {material.title}
                          </h3>
                          <Badge variant="outline">{material.type}</Badge>
                          <Badge variant="outline">
                            Sem {material.subject?.semester ?? "—"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {material.description || "—"}
                        </p>
                        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs text-gray-500">
                          <span>{material.subject?.name ?? "—"}</span>
                          <span>
                            Batch {material.subject?.batch ?? "—"}
                          </span>
                          <span>{material.fileSize ?? "—"}</span>
                          <span>
                            Uploaded:{" "}
                            {new Date(
                              material.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(material.id)}
                      className="text-red-600 hover:text-red-700 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Upload New Material</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowUploadModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <select
                    id="subject"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                    value={newMaterial.subjectId}
                    onChange={(e) =>
                      setNewMaterial({
                        ...newMaterial,
                        subjectId: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} - Sem {s.semester} (Batch {s.batch})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="title">Material Title *</Label>
                  <Input
                    id="title"
                    value={newMaterial.title}
                    onChange={(e) =>
                      setNewMaterial({ ...newMaterial, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                    rows={3}
                    value={newMaterial.description}
                    onChange={(e) =>
                      setNewMaterial({
                        ...newMaterial,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="type">File Type *</Label>
                  <select
                    id="type"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                    value={newMaterial.type}
                    onChange={(e) =>
                      setNewMaterial({
                        ...newMaterial,
                        type: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="document">Document</option>
                    <option value="video">Video</option>
                    <option value="image">Image</option>
                    <option value="spreadsheet">Spreadsheet</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={saving}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Material
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
