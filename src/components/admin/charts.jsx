// Gráficos del tablero en HTML + Tailwind, sin librerías.
// Una sola serie por gráfico (un color, sin leyenda: el título la nombra), barras delgadas con
// extremo redondeado de 4px, valores con texto en tinta gris y tooltip por barra.
import React from 'react';

const BAR = 'bg-cyan-600';
const CARD = 'bg-white rounded-2xl border border-gray-200 p-5';
const fmt = (n) => Number(n).toLocaleString('es-CO');

export function KpiTile({ label, value, hint }) {
  return (
    <div className={CARD}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{typeof value === 'number' ? fmt(value) : value}</p>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

const Header = ({ title, subtitle }) => (
  <div className="mb-4">
    <h2 className="font-semibold text-gray-900">{title}</h2>
    {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
  </div>
);

// Barras horizontales: embudo, productos, preguntas. La etiqueta y el valor siempre visibles.
export function HBarList({ title, subtitle, rows, empty = 'Sin datos en este periodo' }) {
  const max = Math.max(...rows.map(r => r.value), 0);
  return (
    <section className={CARD}>
      <Header title={title} subtitle={subtitle} />
      {!rows.length || max === 0 ? <p className="text-sm text-gray-400">{empty}</p> : (
        <ul className="space-y-3">
          {rows.map((r, i) => (
            <li key={i} title={r.tooltip} className="group">
              <div className="flex justify-between gap-3 text-sm mb-1">
                <span className="text-gray-700 truncate">{r.label}</span>
                <span className="text-gray-900 font-medium tabular-nums whitespace-nowrap">{fmt(r.value)}{r.note && <span className="text-gray-400 font-normal"> · {r.note}</span>}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded">
                <div className={`h-2 ${BAR} rounded group-hover:opacity-80`} style={{ width: `${max ? (r.value / max) * 100 : 0}%`, minWidth: r.value ? 4 : 0 }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// Columnas por día. Tooltip por columna (área de hover más grande que la barra) y vista de tabla.
export function DayColumns({ title, rows }) {
  const max = Math.max(...rows.map(r => r.count), 0);
  const total = rows.reduce((s, r) => s + r.count, 0);
  const label = (day) => new Date(`${day}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
  const ticks = new Set([0, Math.floor((rows.length - 1) / 2), rows.length - 1]);
  return (
    <section className={CARD}>
      <Header title={title} subtitle={`${fmt(total)} en el periodo · máximo ${fmt(max)} en un día`} />
      {max === 0 ? <p className="text-sm text-gray-400">Sin leads en este periodo</p> : (
        <div className="flex items-end gap-0.5 h-40 border-b border-gray-200" role="img" aria-label={`${title}: ${total} leads`}>
          {rows.map((r) => (
            <div key={r.day} title={`${label(r.day)}: ${r.count} ${r.count === 1 ? 'lead' : 'leads'}`} className="flex-1 h-full flex items-end group cursor-default">
              <div className={`w-full ${BAR} rounded-t group-hover:opacity-80`} style={{ height: `${(r.count / max) * 100}%`, minHeight: r.count ? 4 : 0 }} />
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        {rows.map((r, i) => (ticks.has(i) ? <span key={r.day}>{label(r.day)}</span> : null))}
      </div>
      <details className="mt-3 text-sm">
        <summary className="text-cyan-700 cursor-pointer">Ver como tabla</summary>
        <table className="mt-2 w-full text-left text-gray-700">
          <thead><tr className="text-gray-500"><th className="py-1">Día</th><th className="py-1 text-right">Leads</th></tr></thead>
          <tbody>{rows.filter(r => r.count).map(r => <tr key={r.day} className="border-t border-gray-100"><td className="py-1">{label(r.day)}</td><td className="py-1 text-right tabular-nums">{r.count}</td></tr>)}</tbody>
        </table>
      </details>
    </section>
  );
}

const VERTICAL_LABEL = { cards: 'Tarjeta', credit: 'Crédito' };

export function LeadsTable({ rows }) {
  return (
    <section className={`${CARD} overflow-x-auto`}>
      <Header title="Leads recientes" subtitle="Los 25 más nuevos del periodo. Datos personales: no compartir. Solo se les puede enviar ofertas a quienes dicen Sí en Ofertas." />
      {!rows.length ? <p className="text-sm text-gray-400">Sin leads en este periodo</p> : (
        <table className="w-full text-sm text-left min-w-[780px]">
          <thead className="text-gray-500">
            <tr><th className="py-2">Fecha</th><th>Nombre</th><th>WhatsApp</th><th>Email</th><th>Producto</th><th>Recomendado</th><th className="text-center">Clic</th><th className="text-center">Ofertas</th></tr>
          </thead>
          <tbody className="text-gray-700">
            {rows.map(r => (
              <tr key={r.id} className="border-t border-gray-100">
                <td className="py-2 whitespace-nowrap">{new Date(r.created_at).toLocaleString('es-CO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                <td>{r.user_name || '—'}</td>
                <td className="tabular-nums">{r.user_phone ? <a className="text-cyan-700 hover:underline" href={`https://wa.me/57${r.user_phone}`} target="_blank" rel="noopener noreferrer">{r.user_phone}</a> : '—'}</td>
                <td>{r.user_email || '—'}</td>
                <td>{VERTICAL_LABEL[r.vertical] || r.vertical || '—'}</td>
                <td>{r.top_match_name || '—'}{r.top_match_bank && <span className="text-gray-400"> · {r.top_match_bank}</span>}</td>
                <td className="text-center">{r.clicked ? 'Sí' : '—'}</td>
                <td className="text-center">{r.accepted_marketing ? 'Sí' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
