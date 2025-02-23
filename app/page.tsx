import React from "react";
import Link from "next/link";
import { ServiceCard } from "../components/ServiceCard";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">

      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">ShymkentHub</h1>
        <nav>
          <Link href="/auth">
            <span className="bg-white text-blue-600 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-200 transition">
              Авторизация
            </span>
          </Link>
        </nav>
      </header>

      <main className="flex-1 container mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <ServiceCard title="Курсы по программированию" description="Изучите современные технологии от экспертов." />
        <ServiceCard title="UI/UX Дизайн" description="Создавайте красивые и удобные интерфейсы." />
        <ServiceCard title="Разработка ПО" description="Мы создаем мощные веб- и мобильные приложения." />
      </main>

      <footer className="bg-gray-800 text-white text-center p-4">
        © 2025 ShymkentHub. Все права защищены.
      </footer>
    </div>
  );
}


