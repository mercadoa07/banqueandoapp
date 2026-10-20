-- Mantener la base activa: el plan gratis de Supabase pausa el proyecto tras días sin uso
-- y la app sigue cargando sin guardar leads. El workflow .github/workflows/mantener-base-activa.yml
-- llama esta función una vez al día con la clave pública.
-- Solo devuelve la hora del servidor: no lee ni escribe ninguna tabla.

create or replace function public.keepalive()
returns timestamptz
language sql
stable
set search_path = ''
as $$ select now() $$;

revoke all on function public.keepalive() from public;
grant execute on function public.keepalive() to anon, authenticated;

comment on function public.keepalive() is
  'Toque diario para que el plan gratis no pause el proyecto. No toca datos.';
