create table if not exists libros (
  id serial primary key,
  title text not null,
  author text not null,
  price numeric(10, 2) default 0,
  description text default '',
  img text default '',
  editorial text default '',
  pages integer default 0,
  category text default '',
  language text default 'Español',
  format text default 'Libro Físico',
  year integer,
  isbn text,
  valoracion integer default 0,
  visibilidad boolean default true,
  stock integer default 0,
  fecha_publicacion date
);

create index if not exists idx_libros_title on libros using gin (to_tsvector('spanish', title));
create index if not exists idx_libros_author on libros (author);
create index if not exists idx_libros_category on libros (category);

