import "dotenv/config";
import books from "../src/data/booksMock.js";
import { pool } from "./db.js";

const sql = `
  insert into libros (
    id, title, author, price, description, img, editorial, pages,
    category, language, format, year, stock, visibilidad
  )
  values (
    $1, $2, $3, $4, $5, $6, $7, $8,
    $9, $10, $11, $12, $13, $14
  )
  on conflict (id) do update set
    title = excluded.title,
    author = excluded.author,
    price = excluded.price,
    description = excluded.description,
    img = excluded.img,
    editorial = excluded.editorial,
    pages = excluded.pages,
    category = excluded.category,
    language = excluded.language,
    format = excluded.format,
    year = excluded.year,
    stock = excluded.stock,
    visibilidad = excluded.visibilidad
`;

try {
  for (const book of books) {
    await pool.query(sql, [
      Number(book.id),
      book.title,
      book.author,
      book.price,
      book.description,
      book.img,
      book.editorial,
      book.pages,
      book.category,
      book.language,
      book.format,
      book.year,
      book.stock ?? 10,
      true,
    ]);
  }

  console.log(`${books.length} libros cargados en PostgreSQL.`);
} catch (err) {
  console.error("No se pudo cargar el catálogo en PostgreSQL:", err);
  process.exitCode = 1;
} finally {
  await pool.end();
}
