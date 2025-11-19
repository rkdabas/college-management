"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Download, Trash2, Plus, X, File, Image, Video, FileSpreadsheet } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { demoTeachers } from "@/lib/demo-data-v2";

interface Material {
  id: string;
  title: string;
  description: string;
  subject: string;
  type: "document" | "video" | "image" | "spreadsheet" | "other";
  fileSize: string;
  uploadDate: string;
  downloadCount: number;
  semester: number;
  batch: number;
}

export default function TeacherMaterialsPage() {
  const { user } = useAuthStore();
  const teacher = demoTeachers.find(t => t.id === user?.id);

  const [materials, setMaterials] = useState<Material[]>([
    {
      id: "1",
      title: "Database Systems Lecture Notes",
      description: "Complete lecture notes for Unit 1-3",
      subject: "Database Management Systems",
      type: "document",
      fileSize: "2.5 MB",
      uploadDate: "2025-01-15",
      downloadCount: 45,
      semester: 6,
      batch: 2021,
    },
    {
      id: "2",
      title: "SQL Practice Problems",
      description: "Assignment problems with solutions",
      subject: "Database Management Systems",
      type: "document",
      fileSize: "1.2 MB",
      uploadDate: "2025-01-20",
      downloadCount: 38,
      semester: 6,
      batch: 2021,
    },
    {
      id: "3",
      title: "Operating Systems Video Tutorial",
      description: "Process scheduling explained",
      subject: "Operating Systems",
      type: "video",
      fileSize: "125 MB",
      uploadDate: "2025-01-18",
      downloadCount: 52,
      semester: 4,
      batch: 2022,
    },
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    description: "",
    subject: "",
    type: "document" as Material["type"],
    semester: "",
    batch: "",
  });

  const subjects = [
    { id: "1", name: "Database Management Systems", semester: 6, batch: 2021 },
    { id: "2", name: "Database Management Systems", semester: 4, batch: 2022 },
    { id: "3", name: "Operating Systems", semester: 4, batch: 2022 },
  ];

  const getFileIcon = (type: Material["type"]) => {
    switch (type) {
      case "document":
        return <FileText className="w-5 h-5" />;
      case "video":
        return <Video className="w-5 h-5" />;
      case "image":
        return <Image className="w-5 h-5" />;
      case "spreadsheet":
        return <FileSpreadsheet className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const material: Material = {
      id: String(materials.length + 1),
      title: newMaterial.title,
      description: newMaterial.description,
      subject: newMaterial.subject,
      type: newMaterial.type,
      fileSize: "0 MB", // Would be calculated from actual file
      uploadDate: new Date().toISOString().split("T")[0],
      downloadCount: 0,
      semester: parseInt(newMaterial.semester),
      batch: parseInt(newMaterial.batch),
    };
    setMaterials([...materials, material]);
    setShowUploadModal(false);
    setNewMaterial({
      title: "",
      description: "",
      subject: "",
      type: "document",
      semester: "",
      batch: "",
    });
    alert("Material uploaded successfully!");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this material?")) {
      setMaterials(materials.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Materials</h1>
          <p className="text-gray-600">Upload and manage study materials for your classes</p>
        </div>
        <Button onClick={() => setShowUploadModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Upload Material
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Materials</p>
              <p className="text-3xl font-bold text-gray-900">{materials.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Downloads</p>
              <p className="text-3xl font-bold text-gray-900">
                {materials.reduce((sum, m) => sum + m.downloadCount, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Documents</p>
              <p className="text-3xl font-bold text-gray-900">
                {materials.filter((m) => m.type === "document").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Videos</p>
              <p className="text-3xl font-bold text-gray-900">
                {materials.filter((m) => m.type === "video").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Materials List */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {materials.map((material) => (
              <div key={material.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600">
                      {getFileIcon(material.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900">{material.title}</h3>
                        <Badge variant="outline">{material.type}</Badge>
                        <Badge variant="outline">Sem {material.semester}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{material.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{material.subject}</span>
                        <span>Batch {material.batch}</span>
                        <span>{material.fileSize}</span>
                        <span>Uploaded: {new Date(material.uploadDate).toLocaleDateString()}</span>
                        <span>{material.downloadCount} downloads</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(material.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Upload New Material</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowUploadModal(false)}>
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
                    value={selectedSubject}
                    onChange={(e) => {
                      setSelectedSubject(e.target.value);
                      const subject = subjects.find((s) => s.id === e.target.value);
                      if (subject) {
                        setNewMaterial({
                          ...newMaterial,
                          subject: subject.name,
                          semester: String(subject.semester),
                          batch: String(subject.batch),
                        });
                      }
                    }}
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name} - Sem {subject.semester} (Batch {subject.batch})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="title">Material Title *</Label>
                  <Input
                    id="title"
                    value={newMaterial.title}
                    onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                    rows={3}
                    value={newMaterial.description}
                    onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">File Type *</Label>
                    <select
                      id="type"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                      value={newMaterial.type}
                      onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value as Material["type"] })}
                      required
                    >
                      <option value="document">Document</option>
                      <option value="video">Video</option>
                      <option value="image">Image</option>
                      <option value="spreadsheet">Spreadsheet</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="file">Select File *</Label>
                    <Input
                      id="file"
                      type="file"
                      className="cursor-pointer"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Material
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowUploadModal(false)}>
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

