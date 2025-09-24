"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// ✨ İlk şagirdləri localStorage-a atmaq üçün fake data
function getInitialStudents() {
  return [
    { id: 1, email: "student1", pass: "12345", name: "Əli Məmmədov", group: "9A", status: "active" },
    { id: 2, email: "student2", pass: "12345", name: "Aysel Əliyeva", group: "9B", status: "active" },
    { id: 3, email: "student3", pass: "12345", name: "Rəşad Hüseynov", group: "9A", status: "disabled" },
  ];
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // İlk dəfə açıldıqda şagirdlər localStorage-a yazılır
  useEffect(() => {
    if (typeof window !== "undefined") {
      const students = localStorage.getItem("students");
      if (!students) {
        localStorage.setItem("students", JSON.stringify(getInitialStudents()));
      }
    }
  }, []);

  // Login funksiyası
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      // Müəllim yoxlaması
      if (email === "Anar" && pass === "Anar2025") {
        toast({
          title: "Giriş uğurludur!",
          description: "Xoş gəldiniz, müəllim!",
        });
        router.push("/teacher/dashboard");
        setIsLoading(false);
        return;
      }

      // Şagird yoxlaması
      const students = JSON.parse(localStorage.getItem("students") || "[]");
      const student = students.find((s: any) => s.email === email && s.pass === pass);

      if (!student) {
        toast({
          title: "Xəta!",
          description: "İstifadəçi adı və ya şifrə yanlışdır.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (student.status === "disabled") {
        toast({
          title: "Hesab deaktivdir!",
          description: "Hesabınız deaktiv edilib.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      localStorage.setItem("currentStudent", JSON.stringify(student));
      toast({
        title: "Giriş uğurludur!",
        description: `Xoş gəlmisiniz, ${student.name}!`,
      });
      router.push("/student/dashboard");
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* 🔹 Background */}
      <Image
        src="https://picsum.photos/seed/mathformulas/1200/800"
        alt="Background"
        fill
        className="object-cover opacity-10 -z-10"
      />

      {/* 🔹 Login Card */}
      <Card className="max-w-sm w-full bg-card/80 backdrop-blur-sm z-10 p-6">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Calculator className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Riyaziyyat İmtahanı Giriş</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sistemə daxil olmaq üçün məlumatlarınızı daxil edin.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* İstifadəçi adı */}
            <div>
              <Label>İstifadəçi adı</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="İstifadəçi adı"
                required
              />
            </div>

            {/* Şifrə */}
            <div>
              <Label>Şifrə</Label>
              <Input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Şifrə"
                required
              />
            </div>

            {/* Giriş düyməsi */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Daxil olunur..." : "Giriş"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
