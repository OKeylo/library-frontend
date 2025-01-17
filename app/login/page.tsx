"use client";
import { useState } from "react";
import httpClient from "@/http/index";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { push } = useRouter();
  const { setUser } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [passwordLengthError, setPasswordLengthError] = useState(""); 

  const formatPhone = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, "").substring(0, 10);
    const formatted = onlyNumbers.replace(
      /^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPasswordLengthError(""); 

    if (!name.trim() && !isLogin) {
      setError("Введите имя.");
      return;
    }

    if (!birthDate && !isLogin) {
      setError("Выберите дату рождения.");
      return;
    }

    if (!password) {
      setError("Введите пароль");
      return;
    }

    if (password.length < 8 && !isLogin) { 
      setPasswordLengthError("В пароле должно быть не меньше 8 символов");
      return;
    }

    if (!phone) {
      setError("Введите номер телефона");
      return;
    }

    let access_token = "";

    if (isLogin) {
      const data = {
        phone: `+7${phone.replace(/\D/g, "")}`,
        password: password,
      };

      await httpClient.login(data)
      .then((response) => {
        access_token = response.access_token;
        console.log("LOGIN | access_token: ", response.access_token);
      })
      .catch((error) => {
        setError(error.response.data.detail);
        console.log(error);
        return;
      });
    } else {
      const data = {
        phone: `+7${phone.replace(/\D/g, "")}`,
        password: password,
        full_name: name,
        birth_date: birthDate
      };

      await httpClient.register(data)
      .then((response) => {
        access_token = response.access_token;
        console.log("REGISTER | access_token: ", response.access_token);
      })
      .catch((error) => {
        setError(error.response.data.detail);
        console.log(error);
        return;
      });
    }

    localStorage.setItem("access_token", access_token);
    httpClient.token = access_token;

    const user = await httpClient.getCurrentUser();

    setUser(user);
    push("/");
  };

  const today = new Date().toISOString().split("T")[0]; 

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

        <form
          className="flex flex-col gap-4 w-80 p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          <h2 className="text-lg font-semibold">{isLogin ? "Вход" : "Регистрация"}</h2>

          {!isLogin && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="name">
                Имя
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 text-black font-semibold"
                placeholder="Введите ваше имя"
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="phone">
              Номер телефона
            </label>
            <div className="flex">
              <span className="flex items-center px-2 py-1 border rounded-l-md bg-gray-200 text-black font-semibold">+7</span>
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

          {!isLogin && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="birthDate">
                Дата рождения
              </label>
              <input
                type="date"
                id="birthDate"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 text-black font-semibold"
                max="2018-01-01"
                min="1900-01-01"
              />
            </div>
          )}

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

          {passwordLengthError && <div className="text-red-500 text-sm">{passwordLengthError}</div>} {/* Ошибка длины пароля */}

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition"
          >
            {isLogin ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>
      </main>

      <footer className="row-start-3 text-center text-sm text-gray-500">
        &copy; 2025. Все права не защищены.
      </footer>
    </div>
  );
}
