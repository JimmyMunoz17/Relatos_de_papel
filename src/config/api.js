/**
 * Configuración centralizada de endpoints del API.
 *
 * Usa variables de entorno de Vite (VITE_*) para permitir
 * cambiar las URLs sin modificar código fuente.
 * Si no se definen, se usan los valores por defecto (desarrollo local).
 */

// ── Bases ────────────────────────────────────────────────
/** Gateway principal (Spring Boot + ElasticSearch) */
export const API_GATEWAY_BASE =
  import.meta.env.VITE_API_GATEWAY_BASE ||
  "http://localhost:8080/api_rest_buscador";

/** Servicio de facets / categorías */
export const API_FACETS_BASE =
  import.meta.env.VITE_API_FACETS_BASE || "http://localhost:8088";

/** Servicio operador (compras, stock, etc.) */
export const API_OPERATOR_BASE =
  import.meta.env.VITE_API_OPERATOR_BASE ||
  "http://localhost:8080/api_rest_operador";

// ── Imagen por defecto ────────────────────────────────────
export const DEFAULT_BOOK_IMG =
  import.meta.env.VITE_DEFAULT_BOOK_IMG ||
  "https://res.cloudinary.com/ddbtvrcr0/image/upload/v1767207072/Relatos%20de%20papel/img_book_v0lt4v.svg";

// ── Endpoints ────────────────────────────────────────────
export const ENDPOINTS = {
  /** GET  — Todos los libros (facets) */
  ALL_BOOKS: `${API_GATEWAY_BASE}/libros/search/facets`,

  /** GET  — Libro por ID:  /libros/{id} */
  BOOK_BY_ID: (id) => `${API_GATEWAY_BASE}/libros/${id}`,

  /** GET  — Búsqueda fuzzy:  /libros/search/fuzzy?q={query} */
  SEARCH_FUZZY: (query) =>
    `${API_GATEWAY_BASE}/libros/search/fuzzy?q=${encodeURIComponent(query)}`,

  /** GET  — Búsqueda por categoría (facets):  /libros/search/facets?q={cat} */
  SEARCH_CATEGORY: (category) =>
    `${API_GATEWAY_BASE}/libros/search/facets?q=${encodeURIComponent(category)}`,

  /** POST — Registrar compra:  /compras  body: { libroId, cantidad } */
  REGISTER_PURCHASE: `${API_OPERATOR_BASE}/compras`,
};
