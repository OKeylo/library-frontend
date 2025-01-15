"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [isSticky, setIsSticky] = useState<boolean>(false); // Для изменения стилей шапки
  // Обработчик возврата книги
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

  // Получение книг пользователя
  useEffect(() => {
    async function fetchData() {
        if (user) {
            await httpClient.getUserBooks(user?.id)
            .then((data) => {
                setBooks(data);
            })
            .catch((error) => {
                console.log(error)
                return;
            })
        }
    }

    fetchData();
  }, [user?.id]);

  // Следим за прокруткой
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-4xl">
        {books && (
          <h2 className="text-lg font-semibold text-gray-700">Найдено книг: {books.length}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {books?.map((book: UserTransactionBookProps, index) => (
            <div
              key={index}
              className="bg-white border border-gray-300 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-800">{book.book_name}</h3>
              <p className="text-gray-600">
                Автор: <span className="font-medium">{book.author_full_name}</span>
              </p>
              <p className="text-gray-600">
                Жанр: <span className="font-medium">{book.genre_name}</span>
              </p>
              <p className="text-gray-600">
                Язык: <span className="font-medium">{book.book_language}</span>
              </p>
              <p className="text-gray-600">
                Количество страниц: <span className="font-medium">{book.book_page_number}</span>
              </p>
              <p className="text-gray-600">
                Рейтинг: <span className="font-medium">{book.book_rating}</span>
              </p>
              <p className="text-gray-600">
                Возрастное ограничение:{" "}
                <span className="font-medium">{book.book_age_limit}+</span>
              </p>
              <p className="text-gray-600">
                Цена: <span className="font-medium">{book.book_price} ₽</span>
              </p>
              <p className="text-gray-600">
                Адрес библиотеки: <span className="font-medium">{book.library_address}</span>
              </p>
              <p className="text-gray-600">
                Телефон библиотеки: <span className="font-medium">{book.library_phone}</span>
              </p>
              <button
                disabled={!user}
                onClick={(e) => user && returnBook({id: book.id, library_id: book.library_id, book_id: book.book_id})}
                className="mt-4 px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition cursor-pointer"
              >
                Вернуть
              </button>
            </div>
          ))}
        </div>
      </main>

      <footer className="row-start-3 text-center text-sm text-gray-500">
       Aboba
      </footer>
    </div>
  );
}
