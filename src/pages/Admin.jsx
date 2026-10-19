// Tablero interno (/admin). Entrada con enlace mágico al correo (Supabase Auth).
// La seguridad real está en la base: solo el correo administrador puede leer (RLS, is_banqueando_admin()).
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { computeDashboard } from '../lib/metrics.js';
import questionsData from '../../config/questions.json';
import { ADMIN_EMAILS } from '../constants/admin.js';
import { KpiTile, HBarList, DayColumns, LeadsTable } from '../components/admin/charts.jsx';

const PAGE = 'min-h-screen bg-gray-50';
const DAYS_OPTIONS = [7, 30, 90];
const VERTICALS = [['all', 'Todo'], ['cards', 'Tarjetas'], ['credit', 'Crédito']];
const MAX_ROWS = 10000;

const questionText = Object.fromEntries(
  Object.values(questionsData.questions).flat().map(q => [q.id, q.question])
);

function Login() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');
  const send = async (e) => {
    e.preventDefault();
    setStatus('sending');
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/admin` }
    });
    if (err) { setError(err.message); setStatus('error'); } else setStatus('sent');
  };
  return (
    <div className={`${PAGE} flex items-center justify-center p-4`}>
      <form onSubmit={send} className="bg-white rounded-2xl shadow p-8 w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold text-gray-800">Tablero Banqueando</h1>
        {status === 'sent' ? (
          <p className="text-sm text-gray-600">Te enviamos un enlace a <strong>{email}</strong>. Ábrelo desde este mismo navegador para entrar.</p>
        ) : (
          <>
            <p className="text-sm text-gray-500">Escribe tu correo y te llega un enlace para entrar (sin contraseña).</p>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none" />
            <button type="submit" disabled={status === 'sending'} className="w-full bg-cyan-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50">{status === 'sending' ? 'Enviando…' : 'Enviarme el enlace'}</button>
            {status === 'error' && <p className="text-sm text-red-600">No se pudo enviar: {error}</p>}
          </>
        )}
      </form>
    </div>
  );
}

function useDashboardData(enabled) {
  const [raw, setRaw] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const load = useCallback(async () => {
    setLoading(true); setError('');
    const since = new Date(Date.now() - 90 * 86400000).toISOString();
    const [ev, se, cl] = await Promise.all([
      supabase.from('quiz_events').select('visit_id,event,vertical,step,question_id,session_id,created_at').gte('created_at', since).limit(MAX_ROWS),
      supabase.from('quiz_sessions').select('id,created_at,vertical,user_name,user_phone,user_email,user_city,top_match_name,top_match_bank,time_to_complete_seconds').gte('created_at', since).limit(MAX_ROWS),
      supabase.from('apply_clicks').select('session_id,vertical,product_id,product_name,entity,rank,created_at').gte('created_at', since).limit(MAX_ROWS)
    ]);
    const err = ev.error || se.error || cl.error;
    if (err) setError(err.message);
    else setRaw({ events: ev.data, sessions: se.data, clicks: cl.data });
    setLoading(false);
  }, []);
  useEffect(() => { if (enabled) load(); }, [enabled, load]);
  return { raw, error, loading, reload: load };
}

function Dashboard({ email }) {
  const [days, setDays] = useState(30);
  const [vertical, setVertical] = useState('all');
  const { raw, error, loading, reload } = useDashboardData(true);
  const data = useMemo(() => (raw ? computeDashboard(raw, { days, vertical }) : null), [raw, days, vertical]);

  const pill = (active) => `px-3 py-1.5 rounded-lg text-sm font-medium ${active ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`;

  return (
    <div className={`${PAGE} p-4 md:p-8`}>
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tablero Banqueando</h1>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={reload} disabled={loading} className={pill(false)}>{loading ? 'Cargando…' : 'Actualizar'}</button>
            <button onClick={() => supabase.auth.signOut()} className={pill(false)}>Salir</button>
          </div>
        </header>

        <div className="flex flex-wrap gap-2" role="toolbar" aria-label="Filtros">
          {DAYS_OPTIONS.map(d => <button key={d} onClick={() => setDays(d)} className={pill(days === d)}>Últimos {d} días</button>)}
          <span className="w-px bg-gray-200 mx-1" />
          {VERTICALS.map(([v, label]) => <button key={v} onClick={() => setVertical(v)} className={pill(vertical === v)}>{label}</button>)}
        </div>

        {error && <p className="bg-red-50 text-red-700 p-4 rounded-xl text-sm">No se pudieron leer los datos: {error}</p>}
        {!data && !error && <p className="text-gray-500">Cargando datos…</p>}

        {data && (
          <>
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KpiTile label="Visitas al quiz" value={data.kpis.visits} hint="Personas que tocaron «Empezar quiz»" />
              <KpiTile label="Leads" value={data.kpis.leads} hint={`${data.kpis.conversion}% de las visitas`} />
              <KpiTile label="Clics en Solicitar" value={data.kpis.clicks} hint="Total de clics hacia las entidades" />
              <KpiTile label="Leads que dieron clic" value={`${data.kpis.clickRate}%`} hint={`${data.kpis.leadsWithClick} de ${data.kpis.leads}`} />
            </section>

            <section className="grid md:grid-cols-2 gap-6">
              <HBarList
                title="Embudo del quiz"
                subtitle="Visitas únicas que llegaron a cada paso"
                rows={data.funnel.map(s => ({ label: s.label, value: s.count, note: `${s.ofStart}% del inicio` , tooltip: `${s.count} visitas · ${s.ofStart}% del inicio · ${s.fromPrevious}% del paso anterior` }))}
              />
              <HBarList
                title="Productos con más clics en Solicitar"
                subtitle="Base para negociar comisiones"
                empty="Todavía no hay clics en este periodo"
                rows={data.products.map(p => ({ label: p.name, value: p.clicks, note: p.entity, tooltip: `${p.clicks} clics · ${p.entity || ''}` }))}
              />
            </section>

            <DayColumns title="Leads por día" rows={data.perDay} />

            <HBarList
              title="¿En qué pregunta se van?"
              subtitle="Visitas únicas que vieron cada pregunta, en el orden del quiz"
              empty={vertical === 'all' ? 'Elige «Tarjetas» o «Crédito» arriba: cada quiz tiene sus propias preguntas' : 'Todavía no hay datos de preguntas en este periodo'}
              rows={vertical === 'all' ? [] : data.questions.map(q => ({ label: `${q.step + 1}. ${questionText[q.questionId] || q.questionId}`, value: q.count, note: q.lost ? `−${q.lost} vs la anterior` : '', tooltip: `${q.count} visitas${q.lost ? ` · se fueron ${q.lost} desde la pregunta anterior` : ''}` }))}
            />

            <LeadsTable rows={data.recent} />
          </>
        )}
      </div>
    </div>
  );
}

export default function Admin() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!supabase) return <div className={`${PAGE} p-8 text-gray-600`}>Faltan las variables de Supabase en este entorno.</div>;
  if (session === undefined) return <div className={`${PAGE} p-8 text-gray-500`}>Cargando…</div>;
  if (!session) return <Login />;

  const email = session.user?.email || '';
  if (!ADMIN_EMAILS.includes(email.toLowerCase())) return (
    <div className={`${PAGE} flex items-center justify-center p-4`}>
      <div className="bg-white rounded-2xl shadow p-8 max-w-sm text-center space-y-4">
        <p className="text-gray-700">La cuenta <strong>{email}</strong> no tiene acceso al tablero.</p>
        <button onClick={() => supabase.auth.signOut()} className="text-cyan-600 font-medium">Entrar con otro correo</button>
      </div>
    </div>
  );
  return <Dashboard email={email} />;
}
