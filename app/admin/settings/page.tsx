"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Bell, Lock, Globe, Mail, Database } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600 mt-1">Configure system preferences and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="collegeName">College Name</Label>
                <Input id="collegeName" defaultValue="Institute of Technology" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input id="email" type="email" defaultValue="admin@college.edu" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Phone</Label>
                  <Input id="phone" type="tel" defaultValue="+91 9876543210" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <textarea
                  id="address"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue="123 College Street, City, State - 123456"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Academic Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentYear">Current Academic Year</Label>
                  <Input id="currentYear" defaultValue="2025-2026" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentSemester">Current Semester</Label>
                  <select
                    id="currentSemester"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="semesterStart">Semester Start Date</Label>
                <Input id="semesterStart" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semesterEnd">Semester End Date</Label>
                <Input id="semesterEnd" type="date" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input id="smtpHost" placeholder="smtp.gmail.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input id="smtpPort" placeholder="587" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input id="smtpUser" placeholder="your-email@gmail.com" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotif">Email Notifications</Label>
                <input type="checkbox" id="emailNotif" className="w-4 h-4" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="smsNotif">SMS Notifications</Label>
                <input type="checkbox" id="smsNotif" className="w-4 h-4" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pushNotif">Push Notifications</Label>
                <input type="checkbox" id="pushNotif" className="w-4 h-4" defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                <input type="checkbox" id="twoFactor" className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sessionTimeout">Auto Logout (30 min)</Label>
                <input type="checkbox" id="sessionTimeout" className="w-4 h-4" defaultChecked />
              </div>
              <Button variant="outline" className="w-full mt-4">
                Change Password
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">
                Backup Database
              </Button>
              <Button variant="outline" className="w-full">
                Export All Data
              </Button>
              <Button variant="destructive" className="w-full">
                Clear Cache
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}

