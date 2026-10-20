import React from 'react';
import { Sparkles, Award, Smartphone, Mail, User, Lock } from 'lucide-react';
import { CARD_SHADOW, PAGE_BG } from './shared.jsx';
import { LEGAL_URLS } from '../../constants/legal.js';

const LegalLink = ({ to, children }) => <a href={to} className="text-cyan-600 hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>;
const CHECKBOX_CLASS = 'mt-0.5 w-5 h-5 shrink-0 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500';

const AGES = [['18-25', '18-25 años'], ['26-35', '26-35 años'], ['36-45', '36-45 años'], ['46-55', '46-55 años'], ['56+', '56+ años']];
const GENDERS = [['masculino', 'Masculino'], ['femenino', 'Femenino'], ['otro', 'Otro'], ['no_responde', 'Prefiero no decir']];
const CITIES = [['bogota', 'Bogotá'], ['medellin', 'Medellín'], ['cali', 'Cali'], ['barranquilla', 'Barranquilla'], ['cartagena', 'Cartagena'], ['bucaramanga', 'Bucaramanga'], ['pereira', 'Pereira'], ['manizales', 'Manizales'], ['santa_marta', 'Santa Marta'], ['cucuta', 'Cúcuta'], ['ibague', 'Ibagué'], ['villavicencio', 'Villavicencio'], ['otra', 'Otra ciudad']];

const SELECT_CLASS = 'w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none text-gray-700';
const INPUT_CLASS = 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none';

const Select = ({ value, onChange, placeholder, options }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} className={SELECT_CLASS}>
    <option value="">{placeholder}</option>
    {options.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
  </select>
);

export default function RegistrationStep({ vertical, form, setFormField, phoneIsValid, canSubmit, onSubmit, onBack }) {
  return (
    <div className={`${PAGE_BG} flex items-center justify-center p-4`}>
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8" style={CARD_SHADOW}>
        <div className="text-center mb-6">
          <div className="bg-gradient-to-br from-amber-400 to-amber-500 p-4 rounded-2xl shadow-lg inline-block mb-4"><Sparkles className="w-10 h-10 text-white" /></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center"><Award className="w-6 h-6 mr-2 text-amber-500" />¡Tu resultado está listo!</h2>
          <p className="text-gray-500 text-sm">{vertical === 'credit' ? 'Completa tus datos para ver tus opciones de crédito' : 'Completa tus datos para ver tu tarjeta ideal'}</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center"><Smartphone className="w-4 h-4 mr-2" />Tu WhatsApp *</label>
            <input type="tel" inputMode="numeric" autoComplete="tel" value={form.phone} onChange={(e) => setFormField('phone', e.target.value)} placeholder="Ej: 3001234567" required className={`${INPUT_CLASS} text-lg`} />
            {form.phone && !phoneIsValid && <p className="text-xs text-red-500 mt-1">Escribe un celular de 10 dígitos que empiece por 3.</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm"><Mail className="w-4 h-4 inline mr-2" />Tu email *</label>
            <input type="email" autoComplete="email" value={form.email} onChange={(e) => setFormField('email', e.target.value)} placeholder="tu@email.com" required className={INPUT_CLASS} />
          </div>
          <p className="text-xs text-gray-400 pt-1">Opcional: nos ayuda a mejorar las recomendaciones</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">Edad</label>
              <Select value={form.age} onChange={(v) => setFormField('age', v)} placeholder="Selecciona" options={AGES} />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">Género</label>
              <Select value={form.gender} onChange={(v) => setFormField('gender', v)} placeholder="Selecciona" options={GENDERS} />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">Ciudad</label>
            <Select value={form.city} onChange={(v) => setFormField('city', v)} placeholder="Selecciona tu ciudad" options={CITIES} />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm"><User className="w-4 h-4 inline mr-2" />Tu nombre</label>
            <input type="text" autoComplete="name" value={form.name} onChange={(e) => setFormField('name', e.target.value)} placeholder="Ej: Juan Pérez" className={INPUT_CLASS} />
          </div>
          {vertical === 'credit' && (
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">¿Para qué vas a usar el dinero? <span className="text-gray-400 font-normal">(opcional)</span></label>
              <textarea value={form.detail} onChange={(e) => setFormField('detail', e.target.value)} maxLength={280} rows={2} placeholder="Ej: comprar mercancía para diciembre" className={`${INPUT_CLASS} resize-none`} />
            </div>
          )}
          <div className="space-y-3">
            {/* Dos autorizaciones separadas (Ley 1581): la del servicio es obligatoria; la de ofertas, opcional. */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.termsAccepted} onChange={(e) => setFormField('termsAccepted', e.target.checked)} className={CHECKBOX_CLASS} />
              <span className="text-xs text-gray-600">Acepto los <LegalLink to={LEGAL_URLS.terms}>Términos</LegalLink> y autorizo el tratamiento de mis datos para ver mi resultado y que Banqueando me contacte sobre él, según la <LegalLink to={LEGAL_URLS.privacy}>Política de datos</LegalLink>. *</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.marketingAccepted} onChange={(e) => setFormField('marketingAccepted', e.target.checked)} className={CHECKBOX_CLASS} />
              <span className="text-xs text-gray-600">Quiero recibir ofertas y novedades de tarjetas y créditos por WhatsApp o correo. (Opcional)</span>
            </label>
          </div>
          <button type="submit" disabled={!canSubmit} className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-4 rounded-2xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyan-500/25">Ver mi resultado →</button>
          <button type="button" onClick={onBack} className="w-full text-gray-500 hover:text-gray-700 text-sm">← Volver al quiz</button>
        </form>
        <p className="text-xs text-gray-400 mt-6 flex items-center justify-center"><Lock className="w-3 h-3 mr-1" />No compartimos tus datos con bancos ni terceros</p>
      </div>
    </div>
  );
}
