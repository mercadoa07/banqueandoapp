-- ============================================================
-- La clave pública (anon) y usuarios logueados (authenticated) solo pueden INSERTAR.
-- Sin SELECT tampoco ven la estructura de las tablas en GraphQL.
-- Probado el 2026-10-13: insert OK en ambas tablas, select bloqueado.
-- Nota: el frontend inserta sin .select() (return=minimal), así que no necesita SELECT.
-- ============================================================

revoke select on public.quiz_sessions, public.apply_clicks from anon, authenticated;
