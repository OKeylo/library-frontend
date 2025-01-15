"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import Link from "next/link";
import httpClient from "@/http/index";
import { UserDiscountUpdateProps, DiscountProps, UserUpdateProps } from "@/http/httpClient";
import { toast } from 'react-toastify';

export default function Library() {
  const [discounts, setDiscounts] = useState<DiscountProps[] | null>(null);
  const { push } = useRouter();
  const { user, setUser } = useAuth();
  const [isShow, setIsShow] = useState<boolean>(false);

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState("");

  const [isSticky, setIsSticky] = useState<boolean>(false); // Для изменения стилей шапки

  async function buyDiscount(subscription: string, sub_level: number, subscription_value: number) {
    if (!user) {
      return;
    }

    const data: UserUpdateProps = {
      subscription: subscription,
      sub_level: sub_level,
    };
    console.log("Change data: ", data);
    await httpClient.updateUser(user?.id, data)
      .then((response) => {
        console.log(`Вы успешно приобрели подписку ${subscription} уровень ${sub_level}!`, response);
        toast.success(`Вы успешно приобрели подписку ${subscription} уровень ${sub_level}!`);
        setUser({ ...user, subscription: subscription, sub_level: sub_level, subscription_value: subscription_value });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Не удалось получить подписку!");
        return;
      });
  }

  async function changeUser() {
    if (!user) {
      return;
    }

    const data: UserUpdateProps = {};

    if (name) {
      data.full_name = name;
    }
    if (birthDate) {
      data.birth_date = birthDate;
    }

    console.log("Change data: ", data);
    await httpClient.updateUser(user?.id, data)
      .then((response) => {
        console.log(`Вы успешно изменили свои данные !`, response);
        toast.success(`Вы успешно изменили свои данные !`);
        if (name) {
          setUser({ ...user, full_name: name });
        }
        if (birthDate) {
          setUser({ ...user, birth_date: new Date(birthDate) });
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Не удалось изменить данные!");
        return;
      });
  }

  useEffect(() => {
    async function fetchData() {
      if (user) {
        await httpClient.getDiscounts()
          .then((data) => {
            setDiscounts(data);
          })
          .catch((error) => {
            console.log(error);
            return;
          });
      }
    }

    fetchData();

    // Следим за прокруткой страницы
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-100">
      {/* Шапка */}
      <header className={`w-full flex items-center justify-between px-6 sm:px-20 py-4 bg-white dark:bg-gray-700 shadow-md sticky top-0 z-10 
        ${isSticky ? 'rounded-b-lg' : 'rounded-lg'}`}
      >
        <h1
          onClick={() => push('/')}
          className="text-2xl font-bold text-gray-700 dark:text-white cursor-pointer transition-colors duration-300 hover:text-blue-500"
        >
          Библиотека
        </h1>

        <div className="flex items-center gap-4 relative">
          {user && (
            <div className="flex flex-col items-end text-gray-700 dark:text-white">
              <span className="text-base font-medium">{user.full_name}</span>
              <span className="text-sm font-normal">{user.phone}</span>
            </div>
          )}
          <button
            onClick={() => setIsShow(!isShow)}
            className="w-10 h-10 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 transition flex items-center justify-center"
            title="Профиль"
          >
            {user?.full_name?.[0]?.toUpperCase() || "?"}
          </button>
          {user && isShow && (
            <div
              className="absolute z-10 flex flex-col bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 w-64 mt-2"
              style={{
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
              }}
              onMouseLeave={() => setIsShow(false)}
            >
              <Link
                className="px-3 py-2 text-center bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition"
                href="/profile"
              >
                Мой профиль
              </Link>

              <Link
                className="mt-4 px-3 py-2 text-center bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition"
                href="/mybooks"
              >
                Мои книги
              </Link>

              <button
                onClick={() => {
                  localStorage.removeItem("access_token");
                  setUser(undefined);
                  push("/login");
                }}
                className="mt-4 flex items-center justify-center gap-2 px-3 py-2 text-center bg-red-500 text-white font-medium rounded-md hover:bg-red-600 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-9A2.25 2.25 0 002.25 5.25v13.5A2.25 2.25 0 004.5 21h9a2.25 2.25 0 002.25-2.25V15m0-6h5.25m0 0l-3-3m3 3l-3 3"
                  />
                </svg>
                Выйти
              </button>

            </div>
          )}
        </div>
      </header>

      {/* Контент */}
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-4xl mt-8">
        {user && (
          <div className="text-black w-full space-y-4">
            <h2 className="text-lg font-semibold">Данные пользователя</h2>
            <p><strong>Полное имя:</strong> {user.full_name}</p>
            <p><strong>Телефон:</strong> {user.phone}</p>
            <p><strong>Дата рождения:</strong> {new Date(user.birth_date).toLocaleDateString('ru-RU')}</p>
            <p><strong>Подписка:</strong> {user.subscription}</p>
            <p><strong>Уровень подписки:</strong> {user.sub_level}</p>
            <p><strong>Величина скидки подписки:</strong> {user.subscription_value}%</p>
          </div>
        )}

        {/* Приобрести подписку */}
        <div className="text-black w-full">
          <h2 className="text-lg font-semibold">Приобрести подписку</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {discounts?.map((discount, index) => (
              <div
                key={index}
                className="bg-white border border-gray-300 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <p><strong>Подписка:</strong> {discount.subscription}</p>
                <p><strong>Уровень подписки:</strong> {discount.sub_level}</p>
                <p><strong>Величина скидки подписки:</strong> {discount.discount_value}%</p>
                <button
                  disabled={!user}
                  onClick={() => buyDiscount(discount.subscription, discount.sub_level, discount.discount_value)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition cursor-pointer"
                >
                  Приобрести
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Изменить данные пользователя */}
        <form
          className="flex flex-col gap-4 text-black w-full"
          onSubmit={(e) => { e.preventDefault(); changeUser(); }}
        >
          <h2 className="text-lg font-semibold">Сменить данные пользователя</h2>

          {user && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" htmlFor="name">Полное имя</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 text-black font-semibold"
                  placeholder="Введите новое имя"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" htmlFor="birthDate">Дата рождения</label>
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

            </div>
          )}

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition"
          >
            Изменить
          </button>
        </form>
      </main>

      <footer className="text-center text-sm text-gray-500 mt-8">
        Aboba
      </footer>
    </div>
  );
}
