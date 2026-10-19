// Un componente por tipo de pregunta de config/questions.json: single, multiple, multiple con categorías, slider y text.
import React from 'react';
import { CheckCircle2, Info, Smartphone, Plane, ShoppingBag, TrendingDown } from 'lucide-react';

const SelectedCheck = ({ className = 'rounded-full p-1' }) => (
  <div className={`bg-gradient-to-r from-cyan-500 to-purple-600 ${className}`}><CheckCircle2 className="w-4 h-4 text-white" /></div>
);

const optionIconFor = (value) => {
  if (value === 'digital') return Smartphone;
  if (value === 'travel') return Plane;
  if (value === 'shopping') return ShoppingBag;
  if (value.includes('full')) return CheckCircle2;
  if (value.includes('finance')) return TrendingDown;
  return null;
};

// Alterna una opción en una selección múltiple respetando el máximo.
const toggleOption = (selected, value, max) => {
  if (selected.includes(value)) return selected.filter(v => v !== value);
  return selected.length < (max || 999) ? [...selected, value] : selected;
};

export function SingleChoice({ question, value, onAnswer }) {
  return (
    <div className="space-y-3">
      {question.options.map((option) => {
        const OptionIcon = optionIconFor(option.value);
        const isSelected = value === option.value;
        return (
          <button key={option.value} onClick={() => onAnswer(option.value)} className={`w-full p-4 rounded-xl border-2 text-left transition-all ${isSelected ? 'border-cyan-500 bg-gradient-to-r from-cyan-50 to-purple-50 shadow-md' : 'border-gray-100 hover:border-cyan-300 hover:bg-cyan-50/50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                {OptionIcon && <OptionIcon className="w-5 h-5 mr-3 text-gray-600" />}
                {!OptionIcon && option.emoji && <span className="text-xl mr-3">{option.emoji}</span>}
                <div><span className="font-medium text-gray-700 block">{option.label}</span>{option.tip && isSelected && <span className="text-xs text-cyan-600 mt-1 block flex items-center"><Info className="w-3 h-3 mr-1" />{option.tip}</span>}</div>
              </div>
              {isSelected && <SelectedCheck className="rounded-full p-1 ml-3" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function MultipleChoice({ question, value = [], onAnswer }) {
  const canSelect = value.length < (question.max || 999);
  return (
    <div className="space-y-3">
      {question.options.map((option) => {
        const isSelected = value.includes(option.value);
        return (
          <button key={option.value} onClick={() => onAnswer(toggleOption(value, option.value, question.max))} disabled={!canSelect && !isSelected} className={`w-full p-4 rounded-xl border-2 text-left transition-all ${isSelected ? 'border-cyan-500 bg-gradient-to-r from-cyan-50 to-purple-50 shadow-md' : 'border-gray-100 hover:border-cyan-300 hover:bg-cyan-50/50'} ${!canSelect && !isSelected ? 'opacity-40 cursor-not-allowed' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center"><span className="text-xl mr-3">{option.emoji || option.icon}</span><span className="font-medium text-gray-700">{option.label}</span></div>
              {isSelected && <SelectedCheck />}
            </div>
          </button>
        );
      })}
      <p className="text-sm text-gray-400 text-center mt-3">Seleccionadas: <span className="font-semibold text-cyan-600">{value.length}</span> / {question.max}</p>
    </div>
  );
}

export function CategorizedChoice({ question, value = [], onAnswer }) {
  const canSelect = value.length < (question.max || 999);
  return (
    <div className="space-y-5">
      {question.categories.map((category, catIdx) => (
        <div key={catIdx}>
          <h4 className="font-semibold text-gray-600 mb-2 text-sm">{category.name}</h4>
          <div className="grid grid-cols-2 gap-2">
            {category.options.map((option) => {
              const isSelected = value.includes(option.value);
              return (
                <button key={option.value} onClick={() => onAnswer(toggleOption(value, option.value, question.max))} disabled={!canSelect && !isSelected} className={`p-3 rounded-lg border-2 text-center transition-all text-sm font-medium ${isSelected ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-gray-200 hover:border-cyan-300 text-gray-600'} ${!canSelect && !isSelected ? 'opacity-40' : ''}`}>
                  {option.label}{isSelected && <CheckCircle2 className="w-3 h-3 inline ml-1" />}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <p className="text-sm text-gray-400 text-center bg-cyan-50 p-2 rounded-lg">Seleccionadas: <span className="font-semibold text-cyan-600">{value.length}</span> / {question.max}</p>
    </div>
  );
}

export function SliderQuestion({ question, value, onAnswer }) {
  const current = value || question.defaultValue;
  const pct = ((current - question.min) / (question.max - question.min)) * 100;
  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-cyan-50 to-purple-50 p-5 rounded-xl text-center border border-cyan-100">
        <p className="text-sm text-gray-500 mb-1">{question.id === 'monthly_debt_payment' ? 'Tu pago mensual en deudas' : 'Tu gasto mensual'}</p>
        <p className="text-4xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">${(current / 1000000).toFixed(1)}M</p>
      </div>
      <input type="range" min={question.min} max={question.max} step={question.step} value={current} onChange={(e) => onAnswer(parseInt(e.target.value))} className="w-full h-3 rounded-lg appearance-none cursor-pointer" style={{ background: `linear-gradient(to right, #0891B2 0%, #5B21B6 ${pct}%, rgb(229 231 235) ${pct}%, rgb(229 231 235) 100%)` }} />
      <div className="flex justify-between text-xs text-gray-400"><span>{question.labels?.min || '$0'}</span><span>{question.labels?.max || '$10M+'}</span></div>
    </div>
  );
}

export function TextQuestion({ question, value = '', onAnswer }) {
  const maxLength = question.maxLength || 500;
  return (
    <div className="space-y-3">
      <textarea value={value} onChange={(e) => onAnswer(e.target.value)} placeholder={question.placeholder || 'Escribe tu respuesta aquí...'} maxLength={maxLength} rows={4} className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all resize-none text-gray-700 placeholder-gray-400" />
      <div className="flex justify-between text-xs text-gray-400"><span>{question.required ? 'Requerido' : 'Opcional'}</span><span>{value.length} / {maxLength}</span></div>
    </div>
  );
}

export function QuestionInput({ question, value, onAnswer }) {
  if (question.type === 'single') return <SingleChoice question={question} value={value} onAnswer={onAnswer} />;
  if (question.type === 'multiple') return question.categories
    ? <CategorizedChoice question={question} value={value} onAnswer={onAnswer} />
    : <MultipleChoice question={question} value={value} onAnswer={onAnswer} />;
  if (question.type === 'slider') return <SliderQuestion question={question} value={value} onAnswer={onAnswer} />;
  if (question.type === 'text') return <TextQuestion question={question} value={value} onAnswer={onAnswer} />;
  return null;
}
