"use client"
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const formatPhone = (value:string) => {
    const onlyNumbers = value.replace(/\D/g, "").substring(0, 10); // Убираем все нецифровые символы, оставляем до 10 цифр

    const formatted = onlyNumbers.replace(
      /^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/, // Форматируем по группам
      (_, p1, p2, p3, p4) => {
        return [
          p1 ? `(${p1})` : "",
          p2 || "",
          p3 ? `-${p3}` : "",
          p4 ? `-${p4}` : "",
        ]
          .filter(Boolean)
          .join(" ");
      }
    );

    setPhone(formatted);
  };

  const handleBirthDateChange = (value:string) => {
    // Форматируем введённую дату как ДД-ММ-ГГГГ
    const formattedValue = value.replace(/\D/g, "").substring(0, 8);
    const parts = formattedValue.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);

    if (!parts) return;

    const [, day, month, year] = parts;
    const formattedDate = [
      day.padEnd(2, "").slice(0, 2),
      month.padEnd(2, "").slice(0, 2),
      year.padEnd(4, "").slice(0, 4),
    ]
      .filter(Boolean)
      .join("-");

    setBirthDate(formattedDate);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="row-start-1 text-center">
        <h1 className="text-2xl font-bold">Добро пожаловать</h1>
      </header>

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex justify-center items-center gap-4 mb-4">
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${
              isLogin ? "border-blue-500 text-blue-500" : "border-transparent text-gray-500"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Вход
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${
              !isLogin ? "border-blue-500 text-blue-500" : "border-transparent text-gray-500"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Регистрация
          </button>
        </div>

        {isLogin ? (
          <form className="flex flex-col gap-4 w-80 p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Вход</h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="phone">
                Номер телефона
              </label>
              <div className="flex items-center">
                <span className="px-2 py-1 border rounded-l-md bg-gray-200 text-black font-semibold">+7</span>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => formatPhone(e.target.value)}
                  className="p-2 border-t border-r border-b rounded-r-md focus:outline-none focus:ring focus:ring-blue-300 w-full text-black font-semibold"
                  placeholder="(XXX) XXX-XX-XX"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="password">
                Пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-2 border rounded-md w-full focus:outline-none focus:ring focus:ring-blue-300 text-black font-semibold"
                  placeholder="Введите пароль"
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition"
            >
              Войти
            </button>
          </form>
        ) : (
          <form className="flex flex-col gap-4 w-80 p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Регистрация</h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="name">
                Имя
              </label>
              <input
                type="text"
                id="name"
                className="p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 text-black font-semibold"
                placeholder="Введите ваше имя"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="phone">
                Номер телефона
              </label>
              <div className="flex items-center">
                <span className="px-2 py-1 border rounded-l-md bg-gray-200 text-black font-semibold">+7</span>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => formatPhone(e.target.value)}
                  className="p-2 border-t border-r border-b rounded-r-md focus:outline-none focus:ring focus:ring-blue-300 w-full text-black font-semibold"
                  placeholder="(XXX) XXX-XX-XX"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="birthDate">
                Дата рождения
              </label>
              <input
              type="date"
              id="birthDate"
              value={birthDate}
              onChange={(e) => handleBirthDateChange(e.target.value)}
              className="p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 text-black font-semibold"
            />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="password">
                Пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-2 border rounded-md w-full focus:outline-none focus:ring focus:ring-blue-300 text-black font-semibold"
                  placeholder="Введите пароль"
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition"
            >
              Зарегистрироваться
            </button>
          </form>
        )}
      </main>

      <footer className="row-start-3 text-center text-sm text-gray-500">
        &copy; 2025. Все права не защищены.
      </footer>
    </div>
  );
}
