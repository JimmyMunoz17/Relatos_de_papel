import localBooks from "../data/booksMock";
import { ENDPOINTS, DEFAULT_BOOK_IMG } from "../config/api";

/**
 * Normaliza un texto para comparación: quita acentos, minúsculas, espacios extra.
 */
function normalize(text) {
  return (text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar acentos
    .toLowerCase()
    .trim();
}

/**
 * Mapa de alias: títulos en Elastic que difieren del título en español de booksMock.
 * Clave: título normalizado de Elastic → Valor: título normalizado de booksMock.
 */
const TITLE_ALIASES = {
  "wuthering heights": "cumbres borrascosas",
};

/**
 * Busca un libro local (booksMock) que coincida por título normalizado,
 * incluyendo alias para títulos que están en otro idioma.
 */
function findLocalBook(titulo) {
  const normalized = normalize(titulo);
  // Buscar primero por coincidencia directa
  const direct = localBooks.find((b) => normalize(b.title) === normalized);
  if (direct) return direct;

  // Buscar por alias
  const aliasTitle = TITLE_ALIASES[normalized];
  if (aliasTitle) {
    return localBooks.find((b) => normalize(b.title) === aliasTitle);
  }

  return undefined;
}

/** Imagen por defecto (desde config/api.js) */
const DEFAULT_IMG = DEFAULT_BOOK_IMG;

/**
 * Enriquece un libro crudo de ElasticSearch.
 * PRIORIZA los datos de ElasticSearch y solo usa booksMock como fallback.
 */
function enrichBook(book) {
  // Datos de ElasticSearch (fuente principal)
  const elasticId = String(book.id ?? book.isbn ?? "");
  const elasticTitulo = book.titulo ?? book.title ?? "";
  const elasticAutor = book.autor ?? book.author ?? "";
  const elasticPrecio = book.precio ?? book.price ?? 0;
  const elasticDescripcion = book.descripcion ?? book.description ?? "";
  const elasticPortada = book.portada ?? book.imagen ?? book.img ?? "";
  const elasticEditorial = book.editorial ?? "";
  const elasticPaginas = book.paginas ?? book.pages ?? 0;
  const elasticCategoria = book.categoria ?? book.category ?? "";
  const elasticIdioma = book.idioma ?? book.language ?? "Español";
  const elasticFormato = book.formato ?? book.format ?? "Libro Físico";
  const elasticAnio =
    book.anio ??
    book.year ??
    (book.fecha_publicacion
      ? new Date(book.fecha_publicacion).getFullYear()
      : "");

  // Buscar datos locales solo como fallback
  const local = findLocalBook(elasticTitulo);

  return {
    // ID siempre de ElasticSearch
    id: elasticId,
    // Datos principales de ElasticSearch, fallback a local
    title: elasticTitulo || local?.title || "",
    author: elasticAutor || local?.author || "",
    price: elasticPrecio || local?.price || 0,
    description: elasticDescripcion || local?.description || "",
    // Imagen: priorizar ElasticSearch (portada), luego local, luego default
    img: elasticPortada || local?.img || DEFAULT_IMG,
    editorial: elasticEditorial || local?.editorial || "",
    pages: elasticPaginas || local?.pages || 0,
    category: elasticCategoria || local?.category || "",
    language: elasticIdioma || local?.language || "Español",
    format: elasticFormato || local?.format || "Libro Físico",
    year: elasticAnio || local?.year || "",
    // Campos exclusivos de ElasticSearch
    isbn: book.isbn ?? "",
    valoracion: book.valoracion ?? 0,
    visibilidad: book.visibilidad ?? true,
    stock: book.stock ?? 0,
    fecha_publicacion: book.fecha_publicacion ?? "",
  };
}

/**
 * Extrae el array de libros de distintas posibles estructuras de respuesta.
 */
function extractBooksArray(data) {
  return Array.isArray(data)
    ? data
    : Array.isArray(data.libros)
      ? data.libros
      : Array.isArray(data.content)
        ? data.content
        : Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.results)
            ? data.results
            : [];
}

/**
 * Obtiene TODOS los libros desde el gateway (ElasticSearch).
 * GET /libros/search/facets
 * Enriquece cada libro con datos locales de booksMock.
 */
export async function getAllBooks(signal) {
  const res = await fetch(ENDPOINTS.ALL_BOOKS, { signal });

  if (!res.ok) {
    throw new Error(`Error cargando libros: ${res.status}`);
  }

  const data = await res.json();
  const rawBooks = extractBooksArray(data);

  return rawBooks.map(enrichBook).filter((b) => b.visibilidad !== false);
}

/**
 * Obtiene un libro por ID desde el gateway.
 * GET /libros/{id}
 * Enriquece con datos locales de booksMock.
 */
export async function getBookById(id, signal) {
  const res = await fetch(ENDPOINTS.BOOK_BY_ID(id), { signal });

  if (!res.ok) {
    throw new Error(`Error cargando libro: ${res.status}`);
  }

  const data = await res.json();
  return enrichBook(data);
}

/**
 * Búsqueda fuzzy de libros desde el gateway.
 * GET /libros/search/fuzzy?q=<term>
 *
 * Busca en ElasticSearch por título Y también filtra por autor
 * en todos los libros disponibles para garantizar resultados completos.
 */
export async function searchBooksFuzzy(query, signal) {
  if (!query || query.trim().length === 0) return [];

  const normalizedQuery = normalize(query);

  // 1. Resultados del API (fuzzy por título)
  let apiResults = [];
  try {
    const res = await fetch(ENDPOINTS.SEARCH_FUZZY(query.trim()), { signal });
    if (res.ok) {
      const data = await res.json();
      apiResults = extractBooksArray(data).map(enrichBook);
    }
  } catch (err) {
    if (err.name === "AbortError") throw err;
    console.error("Error en búsqueda fuzzy API:", err);
  }

  // 2. Obtener TODOS los libros de ElasticSearch para buscar por autor
  let allBooksFromApi = [];
  try {
    const res = await fetch(ENDPOINTS.ALL_BOOKS, { signal });
    if (res.ok) {
      const data = await res.json();
      allBooksFromApi = extractBooksArray(data).map(enrichBook);
    }
  } catch (err) {
    if (err.name === "AbortError") throw err;
    console.error("Error obteniendo todos los libros:", err);
  }

  // 3. Filtrar por autor en los libros de ElasticSearch
  const byAuthorFromApi = allBooksFromApi.filter((b) =>
    normalize(b.author).includes(normalizedQuery),
  );

  // 4. Búsqueda local por autor (fallback si API falla)
  const localByAuthor = localBooks
    .filter((b) => normalize(b.author).includes(normalizedQuery))
    .map((b) => enrichBook(b));

  // 5. Merge: API fuzzy primero, luego API por autor, luego locales sin duplicados
  const seenIds = new Set();
  const merged = [];

  // Agregar resultados fuzzy del API
  for (const book of apiResults) {
    if (!seenIds.has(book.id)) {
      seenIds.add(book.id);
      merged.push(book);
    }
  }

  // Agregar resultados por autor del API (tienen datos completos de ElasticSearch)
  for (const book of byAuthorFromApi) {
    if (!seenIds.has(book.id)) {
      seenIds.add(book.id);
      merged.push(book);
    }
  }

  // Agregar resultados locales solo si no hay duplicados
  for (const book of localByAuthor) {
    if (!seenIds.has(book.id)) {
      seenIds.add(book.id);
      merged.push(book);
    }
  }

  return merged;
}

/**
 * Búsqueda de libros por categoría usando el servicio de facets.
 * Endpoint configurado en config/api.js → ENDPOINTS.SEARCH_CATEGORY
 * Si falla, usa la búsqueda fuzzy como fallback.
 */
export async function searchByCategory(category, signal) {
  if (!category || category.trim().length === 0) return [];

  // Intentar endpoint de facets por categoría
  try {
    const res = await fetch(ENDPOINTS.SEARCH_CATEGORY(category.trim()), {
      signal,
    });

    if (res.ok) {
      const data = await res.json();
      const rawBooks = extractBooksArray(data);
      return rawBooks.map(enrichBook);
    }
  } catch (err) {
    if (err.name === "AbortError") throw err;
    // Si falla, usamos fuzzy como fallback
  }

  // Fallback: búsqueda fuzzy con la categoría como término
  return searchBooksFuzzy(category, signal);
}

/**
 * Obtiene las categorías únicas de todos los libros disponibles.
 * Combina categorías del API (si están cargadas) con las locales.
 */
export function getLocalCategories() {
  const cats = new Set();
  localBooks.forEach((b) => {
    if (b.category) cats.add(b.category);
  });
  return [...cats].sort();
}

/**
 * Registra la compra de un libro en el servicio operador.
 * POST /compras  →  { libroId: number, cantidad: number }
 */
export async function registerPurchase(libroId, cantidad, signal) {
  const res = await fetch(ENDPOINTS.REGISTER_PURCHASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ libroId: Number(libroId), cantidad }),
    signal,
  });

  if (!res.ok) {
    throw new Error(`Error registrando compra: ${res.status}`);
  }

  return res.json();
}

/**
 * Registra las compras de todos los artículos del carrito.
 * Envía un POST por cada libro y devuelve un resumen.
 */
export async function registerCartPurchases(cartItems, signal) {
  const results = await Promise.allSettled(
    cartItems.map((item) => registerPurchase(item.id, item.quantity, signal)),
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return { succeeded, failed, total: cartItems.length };
}
