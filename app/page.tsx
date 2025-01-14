"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBooks } from "@/http";

interface Book {
  id: number;
  name: string;
  language: string;
  price: number;
  rating: number;
  age_limit: number;
  author_full_name: string;
  genre_name: string;
}

export default function Library() {
  const [books, setBooks] = useState<Book[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchBooks() {
      const booksData = await getBooks();
      setBooks(booksData);
    }
    fetchBooks();
  }, []);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-100">
      {/* Шапка */}
      <header className="row-start-1 w-full flex items-center justify-between px-6 sm:px-20 py-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">Библиотека</h1>
        <button
          onClick={() => router.push("/profile")}
          className="w-10 h-10 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 transition"
          title="Профиль"
        >
          П
        </button>
      </header>

      {/* Контент */}
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-4xl">
        {books && (
          <h2 className="text-lg font-semibold text-gray-700">Всего книг: {books.length}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {books?.map((book: Book) => (
            <div
              key={book.id}
              className="bg-white border border-gray-300 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-800">{book.name}</h3>
              <p className="text-gray-600">
                Автор: <span className="font-medium">{book.author_full_name}</span>
              </p>
              <p className="text-gray-600">
                Жанр: <span className="font-medium">{book.genre_name}</span>
              </p>
              <p className="text-gray-600">
                Язык: <span className="font-medium">{book.language}</span>
              </p>
              <p className="text-gray-600">
                Рейтинг: <span className="font-medium">{book.rating.toFixed(1)}</span>
              </p>
              <p className="text-gray-600">
                Возрастное ограничение:{" "}
                <span className="font-medium">{book.age_limit}+</span>
              </p>
              <p className="text-gray-600">
                Цена: <span className="font-medium">{book.price} ₽</span>
              </p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition">
                Подробнее
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Подвал */}
      <footer className="row-start-3 text-center text-sm text-gray-500">
       Aboba
      </footer>
    </div>
  );
}
