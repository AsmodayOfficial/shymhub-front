"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());

  interface Course {
  id: string;
  title: string;
  description: string;
  }

  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "STUDENT") {
      router.push("/auth"); // Если не студент — на страницу входа
    } else {
      setIsAuthorized(true);
    }

    fetch("http://localhost:4000/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error("Ошибка загрузки курсов", error));
  }, []);

  if (!isAuthorized) {
    return <div className="text-center mt-10">Перенаправление...</div>;
  }

  const handleEnroll = async (courseId: string) => {
    try {
      const studentId = localStorage.getItem("studentId");
      console.log("Отправка:", { courseId, studentId });
      const response = await fetch("http://localhost:4000/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId, userId: studentId || "" }), 
      });

      if (response.ok) {
        setEnrolledCourses(new Set([...enrolledCourses, courseId]));
      }
    } catch (error) {
      console.error("Ошибка при записи на курс", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Шапка */}
      <header className="bg-blue-600 text-white p-4 text-center text-xl font-bold">
        Студенческий кабинет
        <div>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/auth"; // Перенаправление на страницу входа
            }}
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 transition mt-4"
          >
            Выйти
          </button>

        </div>
      </header>

      {/* Контент */}
      <main className="flex-1 container mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course: Course) => (
          <div key={course.id} className="p-4 border rounded-lg shadow-md">
            <h3 className="text-lg font-bold">{course.title}</h3>
            <p className="text-gray-600">{course.description}</p>
            {enrolledCourses.has(course.id) ? (
              <p className="text-green-600 font-bold">Вы записаны</p>
            ) : (
              <button
                onClick={() => handleEnroll(course.id)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Записаться на курс
              </button>
            )}
          </div>
        ))}
      </main>

      {/* Футер */}
      <footer className="bg-gray-800 text-white text-center p-4">
        © 2025 ShymkentHub
      </footer>
    </div>
  );
}
