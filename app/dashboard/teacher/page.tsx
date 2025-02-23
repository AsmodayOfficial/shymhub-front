"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TeacherDashboard() {
  const router = useRouter();
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  type Course = {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    teacherId: string;
    enrollments: { user: { id: string; fullName: string; email: string } }[];
  };

  useEffect(() => {
    // Проверяем роль перед запросом
    const storedRole = localStorage.getItem("role");
    if (storedRole !== "TEACHER") {
      router.push("/auth");
      return;
    }
    setIsAuthorized(true);

    console.log(courses)
    // Получаем teacherId и загружаем курсы
    const storedTeacherId = localStorage.getItem("teacherId");
    if (!storedTeacherId) {
      console.error("Ошибка: teacherId не найден в localStorage");
      return;
    }
    setTeacherId(storedTeacherId);
  }, []);

  useEffect(() => {
    if (!teacherId) return;

    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Токен не найден");

        const response = await fetch(`http://localhost:4000/courses/teacher/${teacherId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Ответ сервера, статус:", response.status);
        const text = await response.text();
        console.log("Ответ сервера, текст:", text);

        if (!response.ok) throw new Error(`Ошибка: ${response.statusText}`);

        const data = text ? JSON.parse(text) : [];
        setCourses(data);
      } catch (err) {
        console.error("Ошибка загрузки курсов:", err);
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [teacherId]);

  if (!isAuthorized) {
    return <div className="text-center mt-10">Перенаправление...</div>;
  }

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p className="text-red-500">Ошибка: {error}</p>;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleCreateCourse = async () => {
    if (!newCourseTitle.trim() || !selectedFile) {
      alert("Заполните все поля и выберите изображение");
      return;
    }

    try {
      // 1. Загружаем изображение
      const formData = new FormData();
      formData.append("image", selectedFile);

      const uploadResponse = await fetch("http://localhost:4000/courses/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) throw new Error("Ошибка загрузки изображения");

      const { imageUrl } = await uploadResponse.json();

      // 2. Создаём курс
      const response = await fetch("http://localhost:4000/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newCourseTitle,
          description: newCourseDescription,
          imageUrl,
          teacherId,
        }),
      });

      if (!response.ok) throw new Error("Ошибка создания курса");
      const data = await response.json();
      console.log("Загруженный курс:", data);

      setCourses([...courses, data]);
      setNewCourseTitle("");
      setNewCourseDescription("");
      setSelectedFile(null);
    } catch (err) {
      console.error("Ошибка:", err);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/auth";
          }}
          className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 transition mt-4"
        >
          Выйти
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4">Панель преподавателя</h1>

      <div className="mb-4">
        <input
          type="text"
          value={newCourseTitle}
          onChange={(e) => setNewCourseTitle(e.target.value)}
          placeholder="Название курса"
          className="border p-2 rounded mr-2"
        />
        <input
          type="text"
          value={newCourseDescription}
          onChange={(e) => setNewCourseDescription(e.target.value)}
          placeholder="Описание курса"
          className="border p-2 rounded mr-2"
        />
        <input type="file" onChange={handleFileChange} className="border p-2 rounded mr-2" />
        <button
          onClick={handleCreateCourse}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Создать курс
        </button>
      </div>

      <ul>
        {courses.map((course) => (
          <li key={course.id} className="border p-4 mb-2 rounded">
            <h2 className="text-lg font-semibold">{course.title}</h2>
            <p className="text-gray-600">{course.description}</p>
            {course.imageUrl && <img src={`http://localhost:4000${course.imageUrl}`} alt="Изображение курса" className="w-32 h-32 mt-2" />}
            {course.enrollments && course.enrollments.length > 0 ? (
              <div className="mt-4">
                <h3 className="font-semibold">Студенты:</h3>
                <ul className="list-disc pl-5">
                  {course.enrollments.map((enrollment) => (
                    <li key={enrollment.user.id} className="text-sm text-gray-700">
                      {enrollment.user.fullName} ({enrollment.user.email})
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">Нет записанных студентов</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
