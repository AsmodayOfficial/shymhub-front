"use client";

import { useState } from "react";

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "STUDENT" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isRegister ? "http://localhost:4000/auth/register" : "http://localhost:4000/auth/login";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Ошибка при авторизации");

      alert(isRegister ? "Регистрация успешна! Теперь войдите." : "Вход выполнен!");
      if (!isRegister) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("studentId", data.user.id);
        localStorage.setItem("teacherId", data.user.id);
        localStorage.setItem("employeeId", data.user.id);
        localStorage.setItem("role", data.role);

        if (data.role === "STUDENT") {
            window.location.href = "/dashboard/student";
        } else if (data.role === "TEACHER") {
            window.location.href = "/dashboard/teacher";
        } else if (data.role === "EMPLOYEE") {
            window.location.href = "/dashboard/employee";
        }
      } else {
        setIsRegister(false);
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">{isRegister ? "Регистрация" : "Вход"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <input
              type="text"
              name="fullName"
              placeholder="ФИО"
              value={form.fullName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          {isRegister && (
            <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="STUDENT">Студент</option>
              <option value="TEACHER">Преподаватель</option>
              <option value="EMPLOYEE">Сотрудник</option>
            </select>
          )}
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
            {isRegister ? "Зарегистрироваться" : "Войти"}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          {isRegister ? "Уже есть аккаунт?" : "Нет аккаунта?"}{" "}
          <span className="text-blue-600 cursor-pointer" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Войти" : "Зарегистрироваться"}
          </span>
        </p>
      </div>
    </div>
  );
}
