# Catalogo con PostgreSQL

1. Crear una base de datos PostgreSQL llamada `relatos_de_papel`.
2. Ejecutar el esquema de `database/schema.sql` en esa base de datos.
3. Ajustar las variables `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER` y `PGPASSWORD` en `.env`.
4. Cargar el catalogo inicial con:

```bash
npm run db:seed
```

5. Levantar la API y el frontend juntos con:

```bash
npm run dev:full
```

La API local queda disponible en `http://localhost:3001/api` y el frontend carga el catalogo desde PostgreSQL al iniciar. Si la API no responde, la aplicacion conserva el catalogo local como respaldo.

