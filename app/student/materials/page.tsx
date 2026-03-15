"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, Search, File, Image as ImageIcon, Video, FileSpreadsheet, Filter } from "lucide-react";
import { useAuthStore } from "@/lib/store";

interface Material {
  id: string;
  title: string;
  description: string | null;
  subject: { id: string; name: string; code: string };
  type: string;
  fileSize: string | null;
  createdAt: string;
  teacher: { id: string; name: string; employeeId: string | null };
}

export default function StudentMaterialsPage() {
  const { user } = useAuthStore();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    if (user?.semester == null || user?.batch == null) {
      setLoading(false);
      return;
    }
    fetch(`/api/materials?semester=${user.semester}&batch=${user.batch}`)
      .then((res) => res.ok ? res.json() : [])
      .then(setMaterials)
      .catch(() => setMaterials([]))
      .finally(() => setLoading(false));
  }, [user?.semester, user?.batch]);

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (material.description ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.subject.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = !selectedSubject || material.subject.name === selectedSubject;
    const matchesType = !selectedType || material.type === selectedType;
    return matchesSearch && matchesSubject && matchesType;
  });

  const uniqueSubjects = Array.from(new Set(materials.map((m) => m.subject.name)));

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

  const handleDownload = (material: Material) => {
    alert(`Downloading ${material.title}... (Files are not stored in this demo)`);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Materials</h1>
        <p className="text-gray-600">Access study materials uploaded by your teachers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">All Subjects</option>
                {uniqueSubjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="document">Document</option>
                <option value="video">Video</option>
                <option value="image">Image</option>
                <option value="spreadsheet">Spreadsheet</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <Card key={material.id}>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600">
                    {getFileIcon(material.type)}
                  </div>
                  <Badge variant="outline">{material.type}</Badge>
                </div>
                <CardTitle className="text-lg">{material.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{material.description ?? "No description"}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Subject</span>
                    <span className="font-medium text-gray-700">{material.subject.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Teacher</span>
                    <span className="font-medium text-gray-700">{material.teacher?.name ?? "-"}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Size</span>
                    <span className="font-medium text-gray-700">{material.fileSize ?? "-"}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Uploaded</span>
                    <span className="font-medium text-gray-700">
                      {new Date(material.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button className="w-full" onClick={() => handleDownload(material)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No materials found</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
