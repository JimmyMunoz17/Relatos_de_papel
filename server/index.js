import "dotenv/config";
import cors from "cors";
import express from "express";
import { pool } from "./db.js";

const app = express();
const PORT = process.env.PORT || 3001;
const BOOKS_TABLE = process.env.PG_BOOKS_TABLE || "libros";
const ALLOWED_ORIGIN = process.env.CORS_ORIGIN?.split(",") || [
  "http://localhost:5173",
];
// const ALLOWED_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());

function normalizeBook(row) {
  return {
    id: String(row.id ?? row.isbn ?? ""),
    title: row.title ?? row.titulo ?? "",
    author: row.author ?? row.autor ?? "",
    price: Number(row.price ?? row.precio ?? 0),
    description: row.description ?? row.descripcion ?? "",
    img: row.img ?? row.imagen ?? row.portada ?? "",
    editorial: row.editorial ?? "",
    pages: Number(row.pages ?? row.paginas ?? 0),
    category: row.category ?? row.categoria ?? "",
    language: row.language ?? row.idioma ?? "Español",
    format: row.format ?? row.formato ?? "Libro Físico",
    year:
      row.year ??
      row.anio ??
      (row.fecha_publicacion
        ? new Date(row.fecha_publicacion).getFullYear()
        : ""),
    isbn: row.isbn ?? "",
    valoracion: Number(row.valoracion ?? 0),
    visibilidad: row.visibilidad ?? true,
    stock: Number(row.stock ?? 0),
    fecha_publicacion: row.fecha_publicacion ?? "",
  };
}

function safeIdentifier(identifier) {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier)) {
    throw new Error(`Identificador SQL inválido: ${identifier}`);
  }

  return `"${identifier}"`;
}

const booksTable = safeIdentifier(BOOKS_TABLE);

async function getVisibleBookRows() {
  const { rows } = await pool.query(
    `select * from ${booksTable} where coalesce(visibilidad, true) = true order by id asc`,
  );

  return rows;
}

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

app.get("/api/health", async (_req, res) => {
  const { rows } = await pool.query("select now() as now");
  res.json({ ok: true, databaseTime: rows[0].now });
});

app.get("/api/libros", async (_req, res, next) => {
  try {
    const rows = await getVisibleBookRows();
    res.json(rows.map(normalizeBook));
  } catch (err) {
    next(err);
  }
});

app.get("/api/libros/search", async (req, res, next) => {
  try {
    const query = String(req.query.q ?? "").trim();
    if (!query) {
      res.json([]);
      return;
    }

    const normalizedQuery = normalizeText(query);
    const rows = await getVisibleBookRows();
    const books = rows
      .map(normalizeBook)
      .filter((book) =>
        [book.title, book.author, book.category].some((field) =>
          normalizeText(field).includes(normalizedQuery),
        ),
      );

    res.json(books);
  } catch (err) {
    next(err);
  }
});

app.get("/api/libros/category/:category", async (req, res, next) => {
  try {
    const { category } = req.params;
    const normalizedCategory = normalizeText(category);
    const rows = await getVisibleBookRows();
    const books = rows
      .map(normalizeBook)
      .filter((book) => normalizeText(book.category) === normalizedCategory);

    res.json(books);
  } catch (err) {
    next(err);
  }
});

app.get("/api/libros/:id", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `select * from ${booksTable} where cast(id as text) = $1 limit 1`,
      [req.params.id],
    );

    if (rows.length === 0) {
      res.status(404).json({ message: "Libro no encontrado" });
      return;
    }

    res.json(normalizeBook(rows[0]));
  } catch (err) {
    next(err);
  }
});

app.use((err, _req, res) => {
  console.error(err);
  res.status(500).json({
    message: "Error consultando PostgreSQL",
    detail: process.env.NODE_ENV === "production" ? undefined : err.message,
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API PostgreSQL escuchando en ${PORT}`);
});
