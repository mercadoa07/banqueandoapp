-- ============================================================
-- Elimina la notificación a Telegram por cada lead nuevo.
-- Estaba creada directo en Supabase (no en el repo) y:
--   - llamaba a Telegram dentro del insert: si Telegram fallaba, el lead no se guardaba;
--   - tenía el token del bot escrito en la función.
-- Si se vuelve a necesitar: hacerlo asíncrono (pg_net o Edge Function) y con el token en Vault.
-- ============================================================

drop trigger if exists trigger_notify_telegram on public.quiz_sessions;
drop function if exists public.notify_telegram_new_quiz();
