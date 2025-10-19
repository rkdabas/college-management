"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, AlertCircle, ShieldCheck, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate a brief delay for demo purposes
    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = login(username, password);
    
    if (success) {
      router.push("/admin/dashboard");
    } else {
      setError("Invalid username or password");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 p-4 relative overflow-hidden">
      {/* Professional Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(14,116,185,0.05),rgba(255,255,255,0))]"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-sky-600 to-sky-700 rounded-2xl mb-6 shadow-lg shadow-sky-600/20">
            <GraduationCap className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">JIMS ERP Portal</h1>
          <p className="text-gray-600 font-medium">Admin Portal</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-gray-200">
          <CardHeader className="space-y-3 pb-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-sky-600" />
              <CardTitle className="text-2xl">Admin Login</CardTitle>
            </div>
            <CardDescription className="text-base">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-semibold text-gray-700">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12"
                />
              </div>

              {error && (
                <div className="flex items-center gap-3 text-sm text-red-700 bg-red-50 p-4 rounded-xl border border-red-200 animate-fade-in">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-5 bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl border border-sky-200/50">
              <p className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Demo Credentials
              </p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Username:</span>
                  <code className="bg-white px-3 py-1 rounded-lg text-sky-700 font-semibold border border-sky-200">admin</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Password:</span>
                  <code className="bg-white px-3 py-1 rounded-lg text-sky-700 font-semibold border border-sky-200">admin123</code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
