import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, CreditCard, TrendingUp, Heart, DollarSign, Smartphone } from 'lucide-react';

// Importar configuraciones
import cardsData from '../config/cards.json';
import questionsData from '../config/questions.json';
import matchingConfig from '../config/matchingConfig.json';

// Importar engine
import { createMatchingEngine } from './engine/matchingEngine.js';

// Mapeo de iconos
const iconMap = {
  TrendingUp,
  DollarSign,
  Heart,
  Smartphone,
  CreditCard,
  Sparkles
};

function App() {
  const [step, setStep] = useState('landing');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [matchScore, setMatchScore] = useState(0);
  const [engine, setEngine] = useState(null);

  // Filtrar preguntas visibles según condiciones
  const visibleQuestions = questionsData.questions.filter(q => {
    if (!q.showIf) return true;
    const { question, includes } = q.showIf;
    const answer = answers[question];
    return Array.isArray(answer) ? answer.includes(includes) : answer === includes;
  });

  useEffect(() => {
    // Inicializar engine
    const matchingEngine = createMatchingEngine(cardsData, matchingConfig);
    setEngine(matchingEngine);
  }, []);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestion < visibleQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    if (!engine) return;
    
    const matchResults = engine.getTopResults(answers);
    setResults(matchResults);
    setStep('results');
    
    // Animar score
    const targetScore = matchResults.topMatch.score;
    let count = 0;
    const interval = setInterval(() => {
      count += 2;
      setMatchScore(Math.min(count, targetScore));
      if (count >= targetScore) clearInterval(interval);
    }, 20);
  };

  const resetQuiz = () => {
    setStep('landing');
    setCurrentQuestion(0);
    setAnswers({});
    setResults(null);
    setMatchScore(0);
  };

  const progress = ((currentQuestion + 1) / visibleQuestions.length) * 100;
  const currentQ = visibleQuestions[currentQuestion];

  // LANDING PAGE
  if (step === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-gradient-to-br from-purple-500 to-cyan-500 p-4 rounded-full animate-pulse">
              <CreditCard className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Banqueando
          </h1>
          <p className="text-xl text-gray-500 mb-2">Encuentra Tu Tarjeta Ideal</p>
          
          <p className="text-lg text-gray-600 mb-8">
            En 2 minutos analizamos tu perfil y te recomendamos LA tarjeta perfecta para ti
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-8 text-left">
            <div className="bg-purple-50 p-4 rounded-xl">
              <Sparkles className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-bold text-gray-800">Personalizado</h3>
              <p className="text-sm text-gray-600">Match basado en tu estilo de vida</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl">
              <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-bold text-gray-800">Ahorra dinero</h3>
              <p className="text-sm text-gray-600">Te mostramos cuánto ahorrarás</p>
            </div>
            <div className="bg-cyan-50 p-4 rounded-xl">
              <Heart className="w-8 h-8 text-cyan-600 mb-2" />
              <h3 className="font-bold text-gray-800">100% gratis</h3>
              <p className="text-sm text-gray-600">Sin costo, sin compromiso</p>
            </div>
          </div>
          
          <button
            onClick={() => setStep('quiz')}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center mx-auto"
          >
            Empezar Quiz
            <ChevronRight className="ml-2 w-6 h-6" />
          </button>
          
          <p className="text-xs text-gray-500 mt-6">
            🔒 Tus datos son privados y nunca se comparten
          </p>
        </div>
      </div>
    );
  }

  // RESULTS PAGE
  if (step === 'results' && results) {
    const { topMatch, alternatives } = results;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 p-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 text-center">
            <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              ¡Encontramos tu match perfecto!
            </h1>
            <p className="text-gray-600">
              Analizamos {cardsData.cards.length} tarjetas basado en tu perfil
            </p>
          </div>

          {/* Top Match */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 border-4 border-yellow-400">
            <div className="flex items-center justify-between mb-6">
              <span className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold">
                🏆 TU MEJOR MATCH
              </span>
              <div className="text-right">
                <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text">
                  {matchScore}%
                </div>
                <div className="text-sm text-gray-500">Compatibilidad</div>
              </div>
            </div>

            <div className="flex items-center mb-6">
              <div className="text-7xl mr-4">{topMatch.image}</div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">{topMatch.name}</h2>
                <p className="text-gray-600 text-lg">{topMatch.bank}</p>
              </div>
            </div>

            {/* Savings */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">💰 Ahorro anual estimado para TI</p>
                <p className="text-5xl font-bold text-green-600 mb-2">
                  ${topMatch.personalizedSavings?.toLocaleString() || 0}
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-3 mb-6">
              <h3 className="font-bold text-gray-800 text-lg">✨ BENEFICIOS:</h3>
              {topMatch.benefits?.slice(0, 4).map((benefit, idx) => (
                <div key={idx} className="flex items-start bg-purple-50 p-3 rounded-lg">
                  <div className="bg-purple-600 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}

              {/* Reasons */}
              {topMatch.reasons?.length > 0 && (
                <>
                  <h3 className="font-bold text-gray-800 text-lg mt-6">🎯 POR QUÉ ES PARA TI:</h3>
                  {topMatch.reasons.slice(0, 3).map((reason, idx) => (
                    <div key={idx} className="flex items-start bg-cyan-50 p-3 rounded-lg">
                      <Sparkles className="w-5 h-5 text-cyan-600 mr-3 mt-0.5" />
                      <span className="text-gray-700">{reason}</span>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Fees */}
            <div className="bg-gray-50 p-5 rounded-xl mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600 text-sm">Cuota de manejo</span>
                  <p className="font-bold text-gray-800 text-lg">
                    {topMatch.fees?.annualFee === 0 
                      ? '✨ GRATIS' 
                      : `$${(topMatch.fees?.monthlyFee || 0).toLocaleString()}/mes`}
                  </p>
                  {topMatch.fees?.feeWaiverCondition && (
                    <p className="text-xs text-gray-500">{topMatch.fees.feeWaiverCondition}</p>
                  )}
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Tasa de interés</span>
                  <p className="font-bold text-gray-800 text-lg">{topMatch.rates?.interestRateEA}% EA</p>
                </div>
              </div>
            </div>

            <a 
              href={topMatch.applyUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-5 rounded-2xl font-bold text-xl text-center hover:shadow-2xl transition-all"
            >
              Aplicar Ahora →
            </a>
          </div>

          {/* Alternatives */}
          {alternatives?.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">💡 Otras opciones para ti:</h3>
              <div className="space-y-4">
                {alternatives.map((alt, idx) => (
                  <div key={idx} className="border-2 border-gray-200 rounded-xl p-4 hover:border-purple-400 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <div className="text-4xl mr-4">{alt.image}</div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-lg">{alt.name}</h4>
                          <p className="text-sm text-gray-500">{alt.bank}</p>
                          <p className="text-sm text-green-600 font-semibold">
                            Ahorras ${alt.personalizedSavings?.toLocaleString() || 0}/año
                          </p>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-3xl font-bold text-purple-600">{alt.score}%</div>
                        <div className="text-xs text-gray-500">Match</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center">
            <button onClick={resetQuiz} className="text-white hover:underline font-medium">
              ← Volver a empezar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // QUIZ PAGE
  if (!currentQ) return null;

  const IconComponent = iconMap[questionsData.sections.find(s => s.id === currentQ.section)?.icon] || CreditCard;
  const sectionName = questionsData.sections.find(s => s.id === currentQ.section)?.name || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 p-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Progress Header */}
          <div className="bg-gradient-to-r from-purple-600 to-cyan-600 p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <IconComponent className="w-6 h-6 text-white mr-2" />
                <h2 className="text-white font-bold text-lg">{sectionName}</h2>
              </div>
              <span className="text-white text-sm font-semibold bg-white bg-opacity-20 px-3 py-1 rounded-full">
                {currentQuestion + 1} / {visibleQuestions.length}
              </span>
            </div>
            <div className="bg-white bg-opacity-30 rounded-full h-3">
              <div
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Content */}
          <div className="p-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              {currentQ.question}
            </h3>
            {currentQ.subtitle && (
              <p className="text-gray-600 mb-6 text-lg">{currentQ.subtitle}</p>
            )}

            {/* Single Choice */}
            {currentQ.type === 'single' && (
              <div className="space-y-3">
                {currentQ.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(currentQ.id, option.value)}
                    className={`w-full p-5 rounded-xl border-2 text-left transition-all hover:border-purple-400 ${
                      answers[currentQ.id] === option.value
                        ? 'border-purple-600 bg-purple-50 shadow-md'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        {option.emoji && <span className="text-2xl mr-3">{option.emoji}</span>}
                        <div>
                          <span className="font-semibold text-gray-800 block">{option.label}</span>
                          {option.tip && answers[currentQ.id] === option.value && (
                            <span className="text-sm text-purple-600 mt-1 block">💡 {option.tip}</span>
                          )}
                        </div>
                      </div>
                      {answers[currentQ.id] === option.value && (
                        <div className="bg-purple-600 rounded-full p-2 ml-3">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Multiple Choice */}
            {currentQ.type === 'multiple' && !currentQ.categories && (
              <div className="space-y-3">
                {currentQ.options.map((option) => {
                  const selected = answers[currentQ.id] || [];
                  const isSelected = selected.includes(option.value);
                  const canSelect = selected.length < (currentQ.max || 999);

                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        if (isSelected) {
                          handleAnswer(currentQ.id, selected.filter(v => v !== option.value));
                        } else if (canSelect) {
                          handleAnswer(currentQ.id, [...selected, option.value]);
                        }
                      }}
                      disabled={!canSelect && !isSelected}
                      className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50 shadow-md'
                          : 'border-gray-200 hover:bg-gray-50 hover:border-purple-300'
                      } ${!canSelect && !isSelected ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{option.emoji}</span>
                          <span className="font-semibold text-gray-800">{option.label}</span>
                        </div>
                        {isSelected && (
                          <div className="bg-purple-600 rounded-full p-2">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Seleccionadas: <span className="font-bold text-purple-600">{(answers[currentQ.id] || []).length}</span> / {currentQ.max}
                </p>
              </div>
            )}

            {/* Multiple with Categories */}
            {currentQ.type === 'multiple' && currentQ.categories && (
              <div className="space-y-6">
                {currentQ.categories.map((category, catIdx) => (
                  <div key={catIdx}>
                    <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase">{category.name}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {category.options.map((option) => {
                        const selected = answers[currentQ.id] || [];
                        const isSelected = selected.includes(option.value);
                        const canSelect = selected.length < (currentQ.max || 999);

                        return (
                          <button
                            key={option.value}
                            onClick={() => {
                              if (isSelected) {
                                handleAnswer(currentQ.id, selected.filter(v => v !== option.value));
                              } else if (canSelect) {
                                handleAnswer(currentQ.id, [...selected, option.value]);
                              }
                            }}
                            disabled={!canSelect && !isSelected}
                            className={`p-4 rounded-lg border-2 text-center transition-all font-medium ${
                              isSelected
                                ? 'border-purple-600 bg-purple-50'
                                : 'border-gray-200 hover:border-purple-300'
                            } ${!canSelect && !isSelected ? 'opacity-40' : ''}`}
                          >
                            {option.label}
                            {isSelected && <span className="ml-2">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <p className="text-sm text-gray-500 text-center bg-purple-50 p-3 rounded-lg">
                  Seleccionadas: <span className="font-bold text-purple-600">{(answers[currentQ.id] || []).length}</span> / {currentQ.max}
                </p>
              </div>
            )}

            {/* Slider */}
            {currentQ.type === 'slider' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-cyan-50 p-6 rounded-2xl text-center">
                  <p className="text-sm text-gray-600 mb-2">Tu gasto mensual</p>
                  <p className="text-5xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text">
                    ${((answers[currentQ.id] || currentQ.defaultValue) / 1000000).toFixed(1)}M
                  </p>
                </div>
                <input
                  type="range"
                  min={currentQ.min}
                  max={currentQ.max}
                  step={currentQ.step}
                  value={answers[currentQ.id] || currentQ.defaultValue}
                  onChange={(e) => handleAnswer(currentQ.id, parseInt(e.target.value))}
                  className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, rgb(147 51 234) 0%, rgb(6 182 212) ${((answers[currentQ.id] || currentQ.defaultValue) - currentQ.min) / (currentQ.max - currentQ.min) * 100}%, rgb(229 231 235) ${((answers[currentQ.id] || currentQ.defaultValue) - currentQ.min) / (currentQ.max - currentQ.min) * 100}%, rgb(229 231 235) 100%)`
                  }}
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>$200K</span>
                  <span>$10M+</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="p-6 bg-gray-50 flex justify-between items-center">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all ${
                currentQuestion === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-purple-600 hover:bg-purple-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Anterior
            </button>

            <button
              onClick={nextQuestion}
              className="flex items-center px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:shadow-2xl transition-all transform hover:scale-105"
            >
              {currentQuestion === visibleQuestions.length - 1 ? '✨ Ver Resultados' : 'Siguiente'}
              <ChevronRight className="w-6 h-6 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
