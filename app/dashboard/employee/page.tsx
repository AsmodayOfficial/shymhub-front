"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "EMPLOYEE") {
      router.push("/auth"); // Если не сотрудник — на страницу входа
    } else {
      setIsAuthorized(true);
    }
  }, []);

  if (!isAuthorized) {
    return <div className="text-center mt-10">Перенаправление...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Кабинет сотрудника</h1>
      {/* Контент для сотрудников */}
    </div>
  );
}
