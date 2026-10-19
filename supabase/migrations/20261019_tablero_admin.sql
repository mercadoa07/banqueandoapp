-- ============================================================
-- Fase 4 — Tablero interno
-- 1) quiz_events: registro anónimo de cada paso del quiz (para ver dónde abandonan).
-- 2) Lectura de leads, clics y eventos SOLO para el administrador logueado.
-- 3) Guardar sesiones y clics también funciona estando logueado.
-- Idempotente.
-- ============================================================

-- 1) Eventos del quiz (sin datos personales: solo un id de visita aleatorio y el paso)
create table if not exists public.quiz_events (
  id          bigint generated always as identity primary key,
  visit_id    uuid not null,         -- generado en el navegador al abrir el quiz
  event       text not null,         -- quiz_start, vertical_selected, question_view, registration_view, results_view
  vertical    text,
  step        smallint,              -- índice de la pregunta (desde 0) en question_view
  question_id text,
  session_id  uuid,                  -- = quiz_sessions.id en results_view
  created_at  timestamptz not null default now()
);
create index if not exists quiz_events_created_at_idx on public.quiz_events (created_at);
create index if not exists quiz_events_visit_id_idx on public.quiz_events (visit_id);

alter table public.quiz_events enable row level security;
revoke select on public.quiz_events from anon;

drop policy if exists "insert_quiz_events" on public.quiz_events;
create policy "insert_quiz_events" on public.quiz_events
  for insert to anon, authenticated with check (true);

-- 2) Solo el administrador puede leer (Supabase Auth, enlace mágico al correo).
--    Para agregar otro administrador: sumar su correo en la función.
create or replace function public.is_banqueando_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(auth.jwt() ->> 'email', '') in ('apelismercado@gmail.com')
$$;

grant select on public.quiz_sessions, public.apply_clicks, public.quiz_events to authenticated;

drop policy if exists "admin_select_quiz_sessions" on public.quiz_sessions;
create policy "admin_select_quiz_sessions" on public.quiz_sessions
  for select to authenticated using (public.is_banqueando_admin());

drop policy if exists "admin_select_apply_clicks" on public.apply_clicks;
create policy "admin_select_apply_clicks" on public.apply_clicks
  for select to authenticated using (public.is_banqueando_admin());

drop policy if exists "admin_select_quiz_events" on public.quiz_events;
create policy "admin_select_quiz_events" on public.quiz_events
  for select to authenticated using (public.is_banqueando_admin());

-- 3) Insertar también como usuario logueado (antes solo anon: el admin probando el quiz
--    logueado no guardaba nada).
drop policy if exists "authenticated_insert_quiz_sessions" on public.quiz_sessions;
create policy "authenticated_insert_quiz_sessions" on public.quiz_sessions
  for insert to authenticated with check (true);

drop policy if exists "authenticated_insert_apply_clicks" on public.apply_clicks;
create policy "authenticated_insert_apply_clicks" on public.apply_clicks
  for insert to authenticated with check (true);
