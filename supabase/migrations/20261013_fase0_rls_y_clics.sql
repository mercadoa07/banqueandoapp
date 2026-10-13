-- ============================================================
-- Fase 0 — RLS de leads + registro de clics en "Aplicar"
-- Correr en Supabase → SQL Editor ANTES de publicar la rama fase-0-rescate.
-- Es idempotente: se puede correr más de una vez.
-- ============================================================

-- 1) quiz_sessions: id de sesión generado en el navegador
--    (el frontend ya no lee la fila insertada, así que necesita su propio id).
alter table public.quiz_sessions
  add column if not exists session_uuid uuid;

create unique index if not exists quiz_sessions_session_uuid_key
  on public.quiz_sessions (session_uuid);

-- 2) quiz_sessions: la clave pública solo puede INSERTAR, nunca leer.
alter table public.quiz_sessions enable row level security;

drop policy if exists "anon_insert_quiz_sessions" on public.quiz_sessions;
create policy "anon_insert_quiz_sessions"
  on public.quiz_sessions
  for insert
  to anon
  with check (true);

-- IMPORTANTE: revisar si existen otras políticas que den SELECT/UPDATE/DELETE a anon
-- o a public y borrarlas. Para listarlas:
--   select policyname, cmd, roles from pg_policies where tablename = 'quiz_sessions';
-- Para borrar una:
--   drop policy "<nombre>" on public.quiz_sessions;

-- 3) apply_clicks: cada clic en "Solicitar ahora" / "Ver más".
create table if not exists public.apply_clicks (
  id           bigint generated always as identity primary key,
  session_uuid uuid,
  vertical     text,
  product_id   text,
  product_name text,
  entity       text,
  rank         smallint,          -- posición en resultados: 1 = mejor match
  score        numeric,
  apply_url    text,
  created_at   timestamptz not null default now()
);

create index if not exists apply_clicks_session_uuid_idx on public.apply_clicks (session_uuid);
create index if not exists apply_clicks_product_id_idx  on public.apply_clicks (product_id);
create index if not exists apply_clicks_created_at_idx  on public.apply_clicks (created_at);

alter table public.apply_clicks enable row level security;

drop policy if exists "anon_insert_apply_clicks" on public.apply_clicks;
create policy "anon_insert_apply_clicks"
  on public.apply_clicks
  for insert
  to anon
  with check (true);

-- 4) Consulta útil (desde el SQL Editor, no desde la app):
--   select c.product_name, c.entity, count(*) clics,
--          count(distinct c.session_uuid) sesiones
--   from apply_clicks c
--   group by 1, 2 order by clics desc;
