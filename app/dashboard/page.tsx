"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "STUDENT") {
      router.push("/dashboard/student");
    } else if (role === "TEACHER") {
      router.push("/dashboard/teacher");
    } else if (role === "EMPLOYEE") {
      router.push("/dashboard/employee");
    } else {
      router.push("/auth");
    }
  }, []);

  return <div className="text-center mt-10">Перенаправление...</div>;
}
