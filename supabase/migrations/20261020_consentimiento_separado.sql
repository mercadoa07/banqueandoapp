-- Fase 4 · Legal: autorizaciones separadas (Ley 1581 de 2012).
-- La del servicio sigue en accepted_terms / accepted_privacy; la de ofertas es opcional.
-- consent_version guarda la fecha de la política que aceptó la persona.
-- Debe aplicarse ANTES de publicar el código que envía estas columnas:
-- si no, el insert falla y no se guarda el lead.

alter table public.quiz_sessions
  add column if not exists accepted_marketing boolean not null default false,
  add column if not exists consent_version text;

comment on column public.quiz_sessions.accepted_marketing is
  'Casilla opcional: acepta recibir ofertas por WhatsApp o correo.';
comment on column public.quiz_sessions.consent_version is
  'Versión (fecha) de la política y los términos aceptados.';
