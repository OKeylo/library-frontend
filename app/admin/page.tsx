"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import Link from "next/link";
import httpClient from "@/http/index";
import { UserDiscountUpdateProps, DiscountProps, UserUpdateProps, GenreProps, GenreUpdateProps } from "@/http/httpClient";
import { toast } from 'react-toastify';

const GenreCard: React.FC<GenreProps> = (genre) => {
  const [name, setName] = useState(genre.name);
  const [description, setDescription] = useState(genre.description);

  const handleUpdate = async () => {
    if (!name || !description) {
      toast.error("Заполните все поля!");
      return;
    }

    const data: GenreUpdateProps = {
      name: name,
      description: description,
    };
    console.log("Change data: ", data);
    await httpClient.updateGenre(genre.id, data)
    .then((response) => {
      console.log(`Вы успешно обновили жанр!`, response);
      toast.success(`Вы успешно обновили жанр!`);
    })
    .catch((error) => {
      console.log(error);
      toast.error("Не удалось обновить жанр!");
      return;
    });
  };

  const handleDelete = async () => {
    await httpClient.deleteGenre(genre.id)
    .then((response) => {
      console.log(`Вы успешно удалили жанр!`, response);
      toast.success(`Вы успешно удалили жанр!`);
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
      toast.error("Не удалось удалить жанр!");
      return;
    });
  };

  return (
    <div className="flex flex-col gap-4 bg-white border border-gray-300 rounded-lg shadow-md p-4">
      <div>
        <label className="text-sm font-medium">Название жанра</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded-md"
          maxLength={50}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Описание жанра</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 border rounded-md"
          maxLength={100}
        />
      </div>
      <button
        onClick={handleUpdate}
        className="bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition"
      >
        Обновить
      </button>

      <button
        onClick={handleDelete}
        className="bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition"
      >
        Удалить
      </button>
    </div>
  );
};

export default function Library() {
  const [discounts, setDiscounts] = useState<DiscountProps[] | null>(null);
  const [genres, setGenres] = useState<GenreProps[] | null>(null);

  const { push } = useRouter();
  const { user, setUser } = useAuth();
  const [isShow, setIsShow] = useState<boolean>(false);

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState("");

  const [isSticky, setIsSticky] = useState<boolean>(false); // Для изменения стилей шапки

  const [newGenreName, setNewGenreName] = useState("");
  const [newGenreDescription, setNewGenreDescription] = useState("");



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

  const handleAddGenre = async () => {
      if (!newGenreName || !newGenreDescription) {
        toast.error("Заполните все поля!");
        return;
      };

      const data = {
        name: newGenreName,
        description: newGenreDescription,
      };

      await httpClient.addGenre(data)
      .then((response) => {
        console.log(`Вы успешно добавили свои жанр!`, response);
        toast.success(`Вы успешно добавили жанр!`);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Не удалось добавить жанр!");
        return;
      });
  }

  useEffect(() => {
    async function fetchData() {
      if (user) {
        await httpClient.getGenres()
        .then((data) => {
          setGenres(data);
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

  if (!user?.is_admin) {
    return <p>У вас нет прав к данной странице</p>
  }

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
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-4xl mt-8 text-black">
        <div className="text-black w-full space-y-4">
            <h2 className="text-lg font-semibold">Жанры</h2>
            <div className="space-y-4">
              {/* Список жанров */}
              {genres?.map((genre) => (
                <GenreCard key={genre.id} id={genre.id} name={genre.name} description={genre.description}></GenreCard>
              ))}
            </div>
          </div>

        {/* Добавить новый жанр */}
        <h3 className="text-lg font-semibold mt-8">Добавить новый жанр</h3>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Название жанра"
            value={newGenreName}
            onChange={(e) => setNewGenreName(e.target.value)}
            className="p-2 border rounded-md"
            maxLength={50}
          />
          <input
            type="text"
            placeholder="Описание жанра"
            value={newGenreDescription}
            onChange={(e) => setNewGenreDescription(e.target.value)}
            className="p-2 border rounded-md"
            maxLength={100}
          />
          <button
            onClick={handleAddGenre}
            className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition"
          >
            Добавить жанр
          </button>
        </div>
      </main>
    </div>
  )
}

