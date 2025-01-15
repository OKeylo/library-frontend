"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getBooks } from "@/http";
import { useAuth } from "@/context/authContext";
import Link from "next/link";
import httpClient from "@/http/index";
import { BookProps, UserTransactionBookProps, BookTransactionsDeleteProps } from "@/http/httpClient";
import { toast } from 'react-toastify';


export default function Library() {
  const [books, setBooks] = useState<UserTransactionBookProps[] | null>(null);
  const { push } = useRouter();
  const { user, setUser } = useAuth();
  const [isShow, setIsShow] = useState<boolean>(false);

  async function returnBook({id, library_id, book_id}: BookTransactionsDeleteProps) {
    const data: BookTransactionsDeleteProps = {
        id: id,
        library_id: library_id,
        book_id: book_id
    }

    await httpClient.returnBook(data)
    .then((transaction_id) => {
      console.log("Вы успешно вернули книгу! | ID транзакции: ", transaction_id);
      toast.success("Вы успешно вернули книгу!");

      setBooks((prevBooks) => {
        if (prevBooks) {
            return prevBooks.filter(book => book.id !== transaction_id);
        }
        return prevBooks;
    });
    })
    .catch((error) => {
      console.log(error)
      toast.error("У вас нет такой книги!");
      return;
    })
  }

  useEffect(() => {
    async function fetchData() {
    }

    fetchData();
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-100">
      {/* Шапка */}
      <header className="row-start-1 w-full flex items-center justify-between px-6 sm:px-20 py-4 bg-white dark:bg-gray-700 shadow-md">
        <h1 className="text-2xl font-bold text-gray-700 dark:text-white">Библиотека</h1>

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
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-4xl">
        {user && (
            <React.Fragment>
                <div className="text-black">
                    <h2>Данные пользователя</h2>
                    <p>Полное имя: {user.full_name}</p>
                    <p>Телефон: {user.phone}</p>
                    <p>Дата рождения: {new Date(user.birth_date).toLocaleDateString('ru-RU')}</p>
                    <p>Подписка: {user.subscription}</p>
                    <p>Уровень подписки: {user.sub_level}</p>
                    <p>Величина скидки подписки: {user.subscription_value}%</p>
                </div>

                <div className="text-black">
                    <h2>Приобрести подписку</h2>
                    <p>Полное имя: {user.full_name}</p>
                    <p>Телефон: {user.phone}</p>
                    <p>Дата рождения: {new Date(user.birth_date).toLocaleDateString('ru-RU')}</p>
                    <p>Подписка: {user.subscription}</p>
                    <p>Уровень подписки: {user.sub_level}</p>
                    <p>Величина скидки подписки: {user.subscription_value}%</p>
                </div>
            </React.Fragment>
        )}
      </main>

      <footer className="row-start-3 text-center text-sm text-gray-500">
       Aboba
      </footer>
    </div>
  );
}
