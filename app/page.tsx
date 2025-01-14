import Image from "next/image";
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
};

export default async function Home() {
  const books: Book[] = await getBooks();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start">
        {books && (
          <h2 className="text-lg">Книг: {books.length}</h2>
        )}
        <div className="flex flex-col gap-y-2">
          {books?.map((book: Book) => (
            <div
              key={book.id}
              className="border-2 border-black p-1"
            >
              <p>Название: {book.name}</p>
              <p>{book.author_full_name}</p>
            </div>
          ))}
        </div>
        
      </main>
    </div>
  );
}
