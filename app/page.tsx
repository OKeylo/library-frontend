"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBooks } from "@/http";
import { useAuth } from "@/context/authContext";
import Link from "next/link";
import httpClient from "@/http/index";
import { BookProps, BooksWithParamsProps, TakeBookProps, GenreProps } from "@/http/httpClient";
import { toast } from 'react-toastify';

export default function Library() {
  const [books, setBooks] = useState<BookProps[] | null>(null);
  const [genres, setGenres] = useState<GenreProps[] | null>(null);

  const { push } = useRouter();
  const { user, setUser } = useAuth();
  const [isShow, setIsShow] = useState<boolean>(false);

  const [paramNameContains, setParamNameContains] = useState<string>("");
  const [paramGenre, setParamGenre] = useState<string>("");
  const [paramAgeLimit, setParamAgeLimit] = useState<number | null>(null);
  const [paramRatingFrom, setParamRatingFrom] = useState<number | null>(null);
  const [paramRatingTo, setParamRatingTo] = useState<number | null>(null);
  const [paramPriceFrom, setParamPriceFrom] = useState<number | null>(null);
  const [paramPriceTo, setParamPriceTo] = useState<number | null>(null);
  const [paramSortBy, setParamSortBy] = useState<number | null>(1);

  const [isSticky, setIsSticky] = useState<boolean>(false); // пусть шапка клеится к потолку, чтобы её всегда было видно, но из-за кривого отступа сверху выглядит так себе

  async function takeBook({ library_id, user_id, book_id }: TakeBookProps) {
    const data: TakeBookProps = {
      library_id: library_id,
      user_id: user_id,
      book_id: book_id
    }

    await httpClient.takeBook(data)
      .then((transaction_id) => {
        console.log("Вы успешно взяли книгу! | ID транзакции: ", transaction_id);
        toast.success("Вы успешно взяли книгу!");
      })
      .catch((error) => {
        console.log(error)
        toast.error("Данной книги нет в наличии!");
        return;
      })
  }

  async function fetchBooks() {
    const params: BooksWithParamsProps = {
      name_contains: paramNameContains,
      genre: paramGenre,
      age_limit: paramAgeLimit !== null ? paramAgeLimit : undefined,
      rating_from: paramRatingFrom !== null ? paramRatingFrom : undefined,
      rating_to: paramRatingTo !== null ? paramRatingTo : undefined,
      price_from: paramPriceFrom !== null ? paramPriceFrom : undefined,
      price_to: paramPriceTo !== null ? paramPriceTo : undefined,
      sort_by: paramSortBy !== null ? paramSortBy : undefined,
    }
    await httpClient.getBooksWithParams(params)
      .then((data) => {
        setBooks(data);
      })
      .catch((error) => {
        console.log(error)
        return;
      })
  }

  useEffect(() => {
    async function fetchData() {
      const params: BooksWithParamsProps = {
      }
      await httpClient.getBooksWithParams(params)
        .then((data) => {
          setBooks(data);
        })
        .catch((error) => {
          console.log(error)
          return;
        })

      await httpClient.getGenres()
      .then((data) => {
        setGenres(data);
      })
      .catch((error) => {
        console.log(error)
        return;
      })
    }

    fetchData();

    // следим за шапкой
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
      <header
        className={`w-full flex items-center justify-between px-6 sm:px-20 py-4 bg-white dark:bg-gray-700 shadow-md sticky top-0 z-10 
          ${isSticky ? 'rounded-b-lg' : 'rounded-lg'}`}
      >
        <h1 className="text-2xl font-bold text-gray-700 dark:text-white">Библиотека</h1>
        
        {user?.is_admin && (
          <Link href={"/admin"}>Админ панель</Link>
        )}

        <div className="flex items-center gap-4 relative">
          {user && (
            <div className="flex flex-col items-end text-gray-700 dark:text-white">
              <span className="text-base font-medium">{user.full_name}</span>
              <span className="text-sm font-normal">{user.phone}</span>
            </div>
          )}
          <button
            onClick={() => user ? setIsShow(!isShow): push("/login")}
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

      {/* Поиск */}
      <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto mt-20">
        <input
          type="text"
          placeholder="Поиск по названию книги..."
          value={paramNameContains}
          onChange={(e) => setParamNameContains(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Меню выбора жанра */}
        <select
          className="mt-4 p-3 border border-gray-300 rounded-md text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            const selectedGenre = e.target.value;
            setParamGenre(selectedGenre);
            console.log("Выбранный жанр:", selectedGenre);
          }}
        >
          <option value="">Любой</option>
          {genres?.map((genre) => (
            <option key={genre.id} value={genre.name}>
              {genre.name}
            </option>
          ))}
        </select>

        {/* Меню выбора возрастного ограничения */}
        <select
          className="mt-4 p-3 border border-gray-300 rounded-md text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setParamAgeLimit(Number(e.target.value))}
        >
          <option value="">Любое возрастное ограничение</option>
          <option value="0">0+</option>
          <option value="6">6+</option>
          <option value="12">12+</option>
          <option value="16">16+</option>
          <option value="18">18+</option>
        </select>

        {/* Поля для рейтинга */}
        <div className="flex gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder="Рейтинг от"
            value={paramRatingFrom !== null ? paramRatingFrom : ""}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 0 && value <= 10) {
                // Если значение "Рейтинг от" больше чем "Рейтинг до", устанавливаем его равным "Рейтинг до"
                if (paramRatingTo !== null && value > paramRatingTo) {
                  setParamRatingFrom(paramRatingTo);  // устанавливаем значение "Рейтинг от" равным "Рейтинг до"
                } else {
                  setParamRatingFrom(value);
                }
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-md text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={0}
            max={10}
          />
          <input
            type="number"
            placeholder="Рейтинг до"
            value={paramRatingTo !== null ? paramRatingTo : ""}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 0 && value <= 10) {
                // Если значение "Рейтинг до" меньше чем "Рейтинг от", обновляем "Рейтинг от"
                if (paramRatingFrom !== null && value < paramRatingFrom) {
                  setParamRatingTo(paramRatingFrom);  // устанавливаем значение "Рейтинг до" равным "Рейтинг от"
                } else {
                  setParamRatingTo(value);
                }
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-md text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={0}
            max={10}
          />
        </div>

        {/* Поля для стоимости */}
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Стоимость от"
            value={paramPriceFrom !== null ? paramPriceFrom : ""}
            onChange={(e) => {
              const value = Number(e.target.value);
                if (value >= 0) {  // Проверка на положительное значение
                  if (paramPriceTo !== null && value > paramPriceTo) {
                    // Если значение "Стоимость от" больше "Стоимость до", устанавливаем "Стоимость от" равным "Стоимость до"
                    setParamPriceFrom(paramPriceTo);
                  } else {
                    setParamPriceFrom(value);
                  }
                }
            }}
            className="w-full p-3 border border-gray-300 rounded-md text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={0}
          />
          <input
            type="number"
            placeholder="Стоимость до"
            value={paramPriceTo !== null ? paramPriceTo : ""}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 0) {  // Проверка на положительное значение
                if (paramPriceFrom !== null && value < paramPriceFrom) {
                  // Если значение "Стоимость до" меньше "Стоимость от", устанавливаем "Стоимость до" равным "Стоимость от"
                  setParamPriceTo(paramPriceFrom);
                } else {
                  setParamPriceTo(value);
                }
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-md text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={0}
          />
          
          {/* Поля для сортировки */}
          <select
            className="mt-4 p-3 border border-gray-300 rounded-md text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setParamSortBy(Number(e.target.value))}
          >
            <option value="1">Новые издания</option>
            <option value="0">Старые издания</option>
          </select>
        </div>
        
        <button
          onClick={() => fetchBooks()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition"
        >
          Найти
        </button>
      </div>

      {/* Контент */}
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-4xl mt-8">
        {books && (
          <h2 className="text-lg font-semibold text-gray-700">Найдено книг: {books.length}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {books?.map((book: BookProps, index) => (
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
                Цена: <span className="font-medium">{user?book.book_price - (book.book_price * user?.subscription_value/100):book.book_price}  ₽</span>
              </p>
              <p className="text-gray-600">
                Адрес библиотеки: <span className="font-medium">{book.library_address}</span>
              </p>
              <p className="text-gray-600">
                Телефон библиотеки: <span className="font-medium">{book.library_phone}</span>
              </p>
              {user && (
                <button
                disabled={!user}
                onClick={(e) => user && takeBook({ library_id: book.library_id, user_id: user?.id, book_id: book.book_id })}
                className="mt-4 px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition cursor-pointer"
              >
                Приобрести
              </button>
              )}
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center text-sm text-gray-500 mt-8">
        Aboba
      </footer>
    </div>
  );
}
