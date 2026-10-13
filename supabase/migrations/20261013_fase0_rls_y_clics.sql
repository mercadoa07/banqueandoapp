-- ============================================================
-- Fase 0 — Cerrar lectura pública de leads + registro de clics
-- Proyecto: banqueandoapp (aaofldffwmqbkykyupii)
-- Idempotente: se puede correr más de una vez.
-- ============================================================

-- 1) Leads: la clave pública ya NO puede leer quiz_sessions.
--    (Se conserva "Allow anonymous inserts": la app sigue pudiendo guardar.)
drop policy if exists "Allow anonymous reads" on public.quiz_sessions;

-- 2) Leads: columna que el código guarda y no existía.
alter table public.quiz_sessions
  add column if not exists top_match_bank text;

-- 3) Clics en "Solicitar" / "Ver más".
create table if not exists public.apply_clicks (
  id           bigint generated always as identity primary key,
  session_id   uuid,              -- = quiz_sessions.id (sin FK: el clic se guarda aunque la sesión fallara)
  vertical     text,
  product_id   text,
  product_name text,
  entity       text,
  rank         smallint,          -- posición en resultados: 1 = mejor match
  score        numeric,
  apply_url    text,
  created_at   timestamptz not null default now()
);

create index if not exists apply_clicks_session_id_idx on public.apply_clicks (session_id);
create index if not exists apply_clicks_product_id_idx on public.apply_clicks (product_id);
create index if not exists apply_clicks_created_at_idx on public.apply_clicks (created_at);

alter table public.apply_clicks enable row level security;

drop policy if exists "anon_insert_apply_clicks" on public.apply_clicks;
create policy "anon_insert_apply_clicks"
  on public.apply_clicks
  for insert
  to anon
  with check (true);

-- Reporte útil (desde el SQL Editor, no desde la app):
--   select product_name, entity, count(*) clics, count(distinct session_id) sesiones
--   from apply_clicks group by 1, 2 order by clics desc;
