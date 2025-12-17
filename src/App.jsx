import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, CreditCard, TrendingUp, Heart, DollarSign, Smartphone, Mail, User, Info, X } from 'lucide-react';

// Importar configuraciones
import cardsData from '../config/cards.json';
import questionsData from '../config/questions.json';
import matchingConfig from '../config/matchingConfig.json';

// Importar engine
import { createMatchingEngine } from './engine/matchingEngine.js';

// Importar auth y analytics
import { 
  saveQuizSession, 
  signInWithGoogle, 
  getSession, 
  saveQuizState, 
  getQuizState 
} from './lib/supabase.js';

// Importar constantes legales
import { LEGAL_TEXTS, SAVINGS_CONFIG, LEGAL_URLS } from './constants/legal.js';

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
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Para tracking de tiempo
  const quizStartTime = useRef(null);

  // Estados para formularios y modales
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneCollected, setPhoneCollected] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showSavingsBreakdown, setShowSavingsBreakdown] = useState(false);
  const [showApplyPopup, setShowApplyPopup] = useState(false);
  const [selectedCardForApply, setSelectedCardForApply] = useState(null);

  // Filtrar preguntas visibles según condiciones
  const visibleQuestions = questionsData.questions.filter(q => {
    if (!q.showIf) return true;
    const { question, includes } = q.showIf;
    const answer = answers[question];
    return Array.isArray(answer) ? answer.includes(includes) : answer === includes;
  });

  // Inicialización
  useEffect(() => {
    const init = async () => {
      const matchingEngine = createMatchingEngine(cardsData, matchingConfig);
      setEngine(matchingEngine);
      
      const { user: currentUser } = await getSession();
      if (currentUser) {
        setUser(currentUser);
        
        const savedState = getQuizState();
        if (savedState) {
          setAnswers(savedState.answers || {});
          setCurrentQuestion(savedState.currentQuestion || 0);
          quizStartTime.current = savedState.startTime || Date.now();
          
          if (savedState.quizCompleted) {
            setStep('calculating');
            setTimeout(() => {
              calculateResultsWithUser(savedState.answers, currentUser, matchingEngine);
            }, 500);
          } else {
            setStep('quiz');
          }
        }
      }
      
      setIsLoading(false);
    };
    
    init();
  }, []);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const startQuiz = () => {
    quizStartTime.current = Date.now();
    setStep('quiz');
  };

  const nextQuestion = () => {
    if (currentQuestion < visibleQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      goToLogin();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const goToLogin = () => {
    saveQuizState({
      answers,
      currentQuestion,
      startTime: quizStartTime.current,
      quizCompleted: true
    });
    setStep('login');
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!phoneInput || !termsAccepted) return;
    setPhoneCollected(true);
  };

  const handleGoogleLogin = async () => {
    sessionStorage.setItem('banqueando_phone', phoneInput);
    sessionStorage.setItem('banqueando_terms_accepted', 'true');
    sessionStorage.setItem('banqueando_terms_accepted_at', new Date().toISOString());
    setIsLoading(true);
    await signInWithGoogle();
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!emailInput) return;
    
    const tempUser = {
      id: null,
      email: emailInput,
      phone: phoneInput,
      user_metadata: { name: nameInput, phone: phoneInput },
      termsAccepted: true,
      termsAcceptedAt: new Date().toISOString()
    };
    
    setUser(tempUser);
    setStep('calculating');
    
    setTimeout(() => {
      calculateResultsWithUser(answers, tempUser, engine);
    }, 500);
  };

  const calculateResultsWithUser = async (quizAnswers, currentUser, matchingEngine) => {
    const engineToUse = matchingEngine || engine;
    if (!engineToUse) return;
    
    const answersToUse = quizAnswers || answers;
    const matchResults = engineToUse.getTopResults(answersToUse);
    setResults(matchResults);
    setStep('results');
    
    const timeToComplete = quizStartTime.current 
      ? Math.round((Date.now() - quizStartTime.current) / 1000)
      : null;
    
    const targetScore = matchResults.topMatch.score;
    let count = 0;
    const interval = setInterval(() => {
      count += 2;
      setMatchScore(Math.min(count, targetScore));
      if (count >= targetScore) clearInterval(interval);
    }, 20);

    try {
      await saveQuizSession({
        answers: answersToUse,
        topMatch: matchResults.topMatch,
        alternatives: matchResults.alternatives,
        timeToComplete,
        user: {
          ...currentUser,
          termsAccepted: true,
          termsAcceptedAt: currentUser.termsAcceptedAt || sessionStorage.getItem('banqueando_terms_accepted_at')
        }
      });
    } catch (error) {
      console.error('[App] Error guardando analytics:', error);
    }
  };

  const handleApplyClick = (card) => {
    setSelectedCardForApply(card);
    setShowApplyPopup(true);
  };

  const confirmApply = () => {
    if (selectedCardForApply?.applyUrl) {
      window.open(selectedCardForApply.applyUrl, '_blank');
    }
    setShowApplyPopup(false);
  };

  // Calcular desglose de ahorro
  const calculateSavingsBreakdown = (card) => {
    const monthlySpend = answers.monthly_spend || 1500000;
    const breakdown = [];
    
    // Ahorro en cuota de manejo
    const cardFee = card.fees?.monthlyFee || 0;
    const feeSavings = (SAVINGS_CONFIG.averageMonthlyFee - cardFee) * 12;
    if (feeSavings > 0) {
      breakdown.push({
        concept: `Cuota de manejo ($0 vs promedio $${SAVINGS_CONFIG.averageMonthlyFee.toLocaleString()}/mes)`,
        amount: feeSavings
      });
    }
    
    // Cashback
    if (card.rewards?.cashbackPercent) {
      const cashback = monthlySpend * (card.rewards.cashbackPercent / 100) * 12;
      breakdown.push({
        concept: `Cashback (${card.rewards.cashbackPercent}% de tu gasto)`,
        amount: Math.round(cashback)
      });
    }
    
    // Millas
    if (card.rewards?.milesPerCOP) {
      const milesPerMonth = monthlySpend / card.rewards.milesPerCOP;
      const milesPerYear = milesPerMonth * 12;
      const mileValue = SAVINGS_CONFIG.mileValues[card.rewards.mileProgram] || SAVINGS_CONFIG.mileValues.generic;
      const milesValue = milesPerYear * mileValue * SAVINGS_CONFIG.trm;
      breakdown.push({
        concept: `Millas (${Math.round(milesPerYear).toLocaleString()} millas/año)`,
        amount: Math.round(milesValue)
      });
    }
    
    return breakdown;
  };

  const resetQuiz = () => {
    setStep('landing');
    setCurrentQuestion(0);
    setAnswers({});
    setResults(null);
    setMatchScore(0);
    quizStartTime.current = null;
    setShowEmailForm(false);
    setEmailInput('');
    setNameInput('');
    setPhoneInput('');
    setPhoneCollected(false);
    setTermsAccepted(false);
  };

  const progress = ((currentQuestion + 1) / visibleQuestions.length) * 100;
  const currentQ = visibleQuestions[currentQuestion];

  // ============================================================
  // COMPONENTE: Footer Legal
  // ============================================================
  const LegalFooter = ({ variant = 'general' }) => (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="text-xs text-gray-400 space-y-1 text-center">
        {variant === 'landing' ? (
          <p>{LEGAL_TEXTS.landingFooter}</p>
        ) : (
          <>
            <p>• {LEGAL_TEXTS.generalFooter.line1}</p>
            <p>• {LEGAL_TEXTS.generalFooter.line2}</p>
            <p>• {LEGAL_TEXTS.generalFooter.line3}</p>
          </>
        )}
        <p className="mt-3 font-medium">{LEGAL_TEXTS.generalFooter.copyright}</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href={LEGAL_URLS.privacy} className="text-violet-500 hover:text-violet-700">Política de Privacidad</a>
          <a href={LEGAL_URLS.terms} className="text-violet-500 hover:text-violet-700">Términos y Condiciones</a>
        </div>
      </div>
    </div>
  );

  // ============================================================
  // COMPONENTE: Modal Desglose de Ahorro
  // ============================================================
  const SavingsBreakdownModal = ({ card, onClose }) => {
    const breakdown = calculateSavingsBreakdown(card);
    const total = breakdown.reduce((sum, item) => sum + item.amount, 0);
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">{LEGAL_TEXTS.savingsBreakdown.title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-3 mb-4">
            {breakdown.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">{item.concept}</span>
                <span className="font-semibold text-green-600">+${item.amount.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between items-center py-2 bg-green-50 px-3 rounded-lg">
              <span className="font-bold text-gray-800">Total estimado</span>
              <span className="font-bold text-green-600 text-lg">${total.toLocaleString()}/año</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-400 italic">{LEGAL_TEXTS.savingsBreakdown.footer}</p>
          
          <button 
            onClick={onClose}
            className="w-full mt-4 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    );
  };

  // ============================================================
  // COMPONENTE: Modal Confirmar Aplicación
  // ============================================================
  const ApplyPopup = ({ card, onConfirm, onClose }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{LEGAL_TEXTS.applyPopup.title}</h3>
        
        <div className="space-y-2 mb-6">
          {LEGAL_TEXTS.applyPopup.items.map((item, idx) => (
            <div key={idx} className="flex items-start">
              <span className="text-violet-500 mr-2">•</span>
              <span className="text-sm text-gray-600">
                {item.replace('{bankName}', card?.bank || 'la entidad')}
              </span>
            </div>
          ))}
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-violet-600 to-cyan-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Continuar →
          </button>
        </div>
      </div>
    </div>
  );

  // ============================================================
  // LOADING
  // ============================================================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-stone-100 flex items-center justify-center">
        <div className="text-gray-600 text-xl">Cargando...</div>
      </div>
    );
  }

  // ============================================================
  // LANDING PAGE
  // ============================================================
  if (step === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-stone-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center" style={{ boxShadow: '0 0 40px rgba(124, 58, 237, 0.1)' }}>
            
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <div className="bg-gradient-to-br from-violet-600 to-cyan-500 p-4 rounded-2xl shadow-lg">
                <CreditCard className="w-10 h-10 text-white" />
              </div>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
              Banqueando
            </h1>
            <p className="text-gray-500 font-medium mb-1">Encuentra Tu Tarjeta Ideal</p>
            <p className="text-gray-400 text-sm mb-6">
              En 2 minutos analizamos tu perfil y te recomendamos la tarjeta perfecta
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-gradient-to-br from-violet-50 to-violet-100/50 p-3 rounded-xl border border-violet-100">
                <Sparkles className="w-6 h-6 text-violet-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-700">Personal</p>
                <p className="text-xs text-gray-400">Para ti</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100/50 p-3 rounded-xl border border-cyan-100">
                <TrendingUp className="w-6 h-6 text-cyan-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-700">Ahorra</p>
                <p className="text-xs text-gray-400">Dinero</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-3 rounded-xl border border-emerald-100">
                <Heart className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-700">Gratis</p>
                <p className="text-xs text-gray-400">100%</p>
              </div>
            </div>
            
            {/* CTA */}
            <button
              onClick={startQuiz}
              className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white py-4 rounded-2xl font-semibold text-base transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            >
              Empezar Quiz →
            </button>
            
            <p className="text-xs text-gray-400 mt-4">🔒 Tus datos son privados</p>
          </div>
          
          <LegalFooter variant="landing" />
        </div>
      </div>
    );
  }

  // ============================================================
  // LOGIN PAGE
  // ============================================================
  if (step === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-stone-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center" style={{ boxShadow: '0 0 40px rgba(124, 58, 237, 0.1)' }}>
          
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-4 rounded-2xl shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Tu resultado está listo! 🎉</h2>
          
          {/* PASO 1: Pedir teléfono + aceptar términos */}
          {!phoneCollected ? (
            <>
              <p className="text-gray-500 text-sm mb-6">
                Ingresa tu WhatsApp para ver tu tarjeta ideal
              </p>
              
              <form onSubmit={handlePhoneSubmit} className="text-left">
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    📱 Tu WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="Ej: 3001234567"
                    required
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none text-center text-lg transition-colors"
                  />
                </div>
                
                {/* Checkbox de autorización */}
                <div className="mb-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 w-5 h-5 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                    />
                    <span className="text-xs text-gray-600">
                      Autorizo el tratamiento de mis datos personales conforme a la{' '}
                      <a href={LEGAL_URLS.privacy} className="text-violet-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        Política de Privacidad
                      </a>{' '}
                      y acepto los{' '}
                      <a href={LEGAL_URLS.terms} className="text-violet-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        Términos y Condiciones
                      </a>
                      . Mis datos serán utilizados para enviarme resultados, recomendaciones y ofertas relacionadas con productos financieros.
                    </span>
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={!phoneInput || !termsAccepted}
                  className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white py-4 rounded-2xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                >
                  Continuar →
                </button>
              </form>
            </>
          ) : !showEmailForm ? (
            /* PASO 2: Elegir método de login */
            <>
              <p className="text-gray-500 text-sm mb-6">
                Ahora elige cómo quieres continuar
              </p>
              
              {/* Botón Google */}
              <button
                onClick={handleGoogleLogin}
                className="w-full bg-white border-2 border-gray-200 text-gray-700 px-6 py-4 rounded-xl font-semibold hover:border-gray-300 hover:shadow-lg transition-all flex items-center justify-center mb-4"
              >
                <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar con Google
              </button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">o</span>
                </div>
              </div>
              
              {/* Opción email */}
              <button
                onClick={() => setShowEmailForm(true)}
                className="w-full bg-gray-100 text-gray-700 px-6 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center"
              >
                <Mail className="w-5 h-5 mr-3" />
                Continuar con email
              </button>
              
              <button
                onClick={() => setPhoneCollected(false)}
                className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
              >
                ← Cambiar número
              </button>
            </>
          ) : (
            /* PASO 3: Formulario de email */
            <form onSubmit={handleEmailSubmit} className="text-left">
              <p className="text-gray-500 text-sm mb-6 text-center">
                Completa tus datos para ver tu resultado
              </p>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  <User className="w-4 h-4 inline mr-2" />
                  Tu nombre
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Tu email *
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none"
                />
              </div>
              
              <div className="mb-6 bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                  📱 WhatsApp: <strong>{phoneInput}</strong>
                </p>
              </div>
              
              <button
                type="submit"
                disabled={!emailInput}
                className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white py-4 rounded-2xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              >
                Ver mi resultado →
              </button>
              
              <button
                type="button"
                onClick={() => setShowEmailForm(false)}
                className="w-full mt-3 text-gray-500 hover:text-gray-700"
              >
                ← Volver
              </button>
            </form>
          )}
          
          <p className="text-xs text-gray-400 mt-6">
            🔒 Tus datos están protegidos
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // CALCULATING PAGE
  // ============================================================
  if (step === 'calculating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-stone-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-6">
            <div className="bg-gradient-to-br from-violet-600 to-cyan-500 p-4 rounded-2xl shadow-lg inline-block">
              <Sparkles className="w-12 h-12 text-white animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Analizando tu perfil...</h2>
          <p className="text-gray-500">Encontrando tu tarjeta ideal</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // RESULTS PAGE
  // ============================================================
  if (step === 'results' && results) {
    const { topMatch, alternatives } = results;
    
    // Combinar todas las tarjetas para mostrar
    const allCards = [topMatch, ...(alternatives || [])].slice(0, 3);

    // Componente de tarjeta individual
    const CardResult = ({ card, rank, isTop }) => {
      const rankLabels = ['🏆 MEJOR MATCH', '🥈 ALTERNATIVA', '🥉 OPCIÓN'];
      const rankColors = [
        'border-violet-400 bg-gradient-to-br from-violet-50/50 to-cyan-50/50',
        'border-gray-200 bg-white',
        'border-gray-200 bg-white'
      ];
      
      return (
        <div className={`rounded-2xl p-5 shadow-lg border-2 ${rankColors[rank]} flex flex-col h-full`}>
          
          {/* Header: Badge + Score */}
          <div className="flex justify-between items-start mb-3">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              isTop 
                ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {rankLabels[rank]}
            </span>
            <div className="text-right">
              <p className={`text-2xl font-bold ${isTop ? 'bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent' : 'text-gray-700'}`}>
                {Math.round(card.score)}%
              </p>
              <p className="text-xs text-gray-400">Match</p>
            </div>
          </div>

          {/* Card Info */}
          <div className="flex items-center mb-3">
            <div className="text-4xl mr-3">{card.image}</div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg leading-tight">{card.name}</h3>
              <p className="text-gray-500 text-sm">{card.bank}</p>
            </div>
          </div>

          {/* Por qué es el MEJOR MATCH (solo para el ganador) */}
          {isTop && card.whyWinner && card.whyWinner.length > 0 && (
            <div className="bg-gradient-to-r from-violet-100 to-cyan-100 rounded-xl p-3 mb-3 border border-violet-200">
              <h4 className="font-semibold text-violet-800 text-sm mb-2">🏆 Le gana a las demás porque:</h4>
              <div className="space-y-1">
                {card.whyWinner.map((reason, idx) => (
                  <p key={idx} className="text-xs text-violet-700 flex items-start">
                    <span className="mr-1 text-green-600">✓</span> {reason}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Por qué considerar esta alternativa */}
          {!isTop && card.whyConsider && card.whyConsider.length > 0 && (
            <div className="bg-amber-50 rounded-xl p-3 mb-3 border border-amber-200">
              <h4 className="font-semibold text-amber-800 text-sm mb-2">💡 Podría ser mejor si:</h4>
              <div className="space-y-1">
                {card.whyConsider.map((reason, idx) => (
                  <p key={idx} className="text-xs text-amber-700 flex items-start">
                    <span className="mr-1">→</span> {reason}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Beneficios principales */}
          {card.benefits && card.benefits.length > 0 && (
            <div className="mb-3">
              <h4 className="font-semibold text-gray-700 text-sm mb-2">✨ Beneficios</h4>
              <div className="space-y-1">
                {card.benefits.slice(0, 3).map((benefit, idx) => (
                  <div key={idx} className="flex items-center bg-green-50 p-2 rounded-lg">
                    <span className="text-xs text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aspectos principales */}
          <div className="bg-gray-50 rounded-xl p-3 mb-3 mt-auto">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <p className="text-xs text-gray-500">Cuota*</p>
                <p className="font-bold text-gray-800 text-sm">
                  {card.fees?.annualFee === 0 || card.fees?.monthlyFee === 0
                    ? '✨ GRATIS*' 
                    : `$${(card.fees?.monthlyFee || 0).toLocaleString()}/mes*`}
                </p>
                {/* Mostrar condición para $0 si existe */}
                {card.fees?.feeWaiverCondition && (
                  <p className="text-[10px] text-amber-600 mt-1 leading-tight">
                    {card.fees.feeWaiverCondition}
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500">Tasa*</p>
                <p className="font-bold text-gray-800 text-sm">{card.rates?.interestRateEA || 'N/A'}% EA*</p>
                <p className="text-[10px] text-gray-400 mt-1">Puede variar</p>
              </div>
            </div>
            {card.requirements?.minIncome && card.requirements.minIncome > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-500">Ingreso mínimo*</p>
                <p className="font-semibold text-gray-700 text-sm">
                  ${(card.requirements.minIncome / 1000000).toFixed(1)}M
                </p>
                <p className="text-[10px] text-gray-400">Sujeto a estudio</p>
              </div>
            )}
          </div>

          {/* Ahorro estimado */}
          <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 p-3 rounded-xl mb-3 border border-emerald-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">💰 Ahorro anual</p>
                <p className="text-xl font-bold text-emerald-600">
                  ${(card.personalizedSavings || 0).toLocaleString()}
                </p>
              </div>
              {isTop && (
                <button 
                  onClick={() => setShowSavingsBreakdown(true)}
                  className="text-emerald-600 hover:text-emerald-800 p-1"
                  title="Ver desglose"
                >
                  <Info className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* A considerar (solo si hay) */}
          {card.cons && card.cons.length > 0 && (
            <div className="mb-3">
              <h4 className="font-semibold text-amber-700 text-sm mb-1">⚠️ A considerar</h4>
              <div className="space-y-1">
                {card.cons.slice(0, 2).map((con, idx) => (
                  <p key={idx} className="text-xs text-amber-700 flex items-start">
                    <span className="mr-1">•</span> {con.text || con}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <button 
            onClick={() => handleApplyClick(card)}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${
              isTop 
                ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:shadow-lg hover:scale-[1.02]' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isTop ? 'Solicitar Ahora →' : 'Ver más →'}
          </button>
        </div>
      );
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-stone-100 p-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* User greeting */}
          {user && (
            <div className="bg-gradient-to-r from-violet-600 to-cyan-500 rounded-2xl p-4 mb-6 text-white text-center shadow-lg max-w-md mx-auto">
              <p>👋 Hola, <strong>{user.user_metadata?.name || user.email}</strong></p>
            </div>
          )}

          {/* Header */}
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center mb-8 max-w-md mx-auto" style={{ boxShadow: '0 0 40px rgba(124, 58, 237, 0.1)' }}>
            <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              ¡Encontramos tu match!
            </h1>
            <p className="text-gray-500 text-sm">
              Analizamos {cardsData.cards.length} tarjetas para ti
            </p>
          </div>

          {/* Cards Grid - 3 columnas en desktop, 1 en móvil */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {allCards.map((card, idx) => (
              <CardResult 
                key={card.id} 
                card={card} 
                rank={idx} 
                isTop={idx === 0}
              />
            ))}
          </div>

          {/* Disclaimer */}
          <div className="bg-white rounded-xl p-4 shadow-md max-w-2xl mx-auto mb-6">
            <p className="text-xs text-gray-400 text-center italic">
              {LEGAL_TEXTS.savingsDisclaimer}
            </p>
          </div>

          {/* Disclaimer de datos de bancos - AGRESIVO */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 max-w-2xl mx-auto mb-6">
            <h4 className="font-bold text-amber-800 text-sm mb-2">⚠️ IMPORTANTE - Lee antes de solicitar:</h4>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>• <strong>Tasas de interés:</strong> Varían mensualmente. Consulta el tarifario vigente del banco.</li>
              <li>• <strong>Cuota de manejo $0:</strong> Casi siempre requiere cumplir condiciones (# de compras, monto mínimo, nómina, etc).</li>
              <li>• <strong>Beneficios:</strong> Pueden cambiar sin previo aviso. Verifica términos y condiciones.</li>
              <li>• <strong>Aprobación:</strong> Sujeta a estudio de crédito del banco.</li>
            </ul>
            <p className="text-[10px] text-amber-600 mt-2 italic">
              Datos obtenidos de sitios web oficiales (Dic 2025). Banqueando no es responsable de cambios en las condiciones de los bancos.
            </p>
          </div>

          <div className="text-center mb-6">
            <button onClick={resetQuiz} className="text-violet-600 hover:text-violet-800 font-medium">
              ← Volver a empezar
            </button>
          </div>
          
          <LegalFooter />
        </div>

        {/* Modales */}
        {showSavingsBreakdown && (
          <SavingsBreakdownModal 
            card={topMatch} 
            onClose={() => setShowSavingsBreakdown(false)} 
          />
        )}
        
        {showApplyPopup && (
          <ApplyPopup 
            card={selectedCardForApply}
            onConfirm={confirmApply}
            onClose={() => setShowApplyPopup(false)}
          />
        )}
      </div>
    );
  }

  // ============================================================
  // QUIZ PAGE
  // ============================================================
  if (!currentQ) return null;

  const IconComponent = iconMap[questionsData.sections.find(s => s.id === currentQ.section)?.icon] || CreditCard;
  const sectionName = questionsData.sections.find(s => s.id === currentQ.section)?.name || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-stone-100 p-4 py-8">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden" style={{ boxShadow: '0 0 40px rgba(124, 58, 237, 0.1)' }}>
          
          {/* Progress Header */}
          <div className="bg-gradient-to-r from-violet-600 to-cyan-500 p-5">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <IconComponent className="w-5 h-5 text-white mr-2" />
                <span className="text-white font-medium text-sm">{sectionName}</span>
              </div>
              <span className="text-white/70 text-sm bg-white/20 px-3 py-1 rounded-full">
                {currentQuestion + 1} / {visibleQuestions.length}
              </span>
            </div>
            <div className="bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Content */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {currentQ.question}
            </h3>
            {currentQ.subtitle && (
              <p className="text-gray-500 text-sm mb-5">{currentQ.subtitle}</p>
            )}

            {/* Single Choice */}
            {currentQ.type === 'single' && (
              <div className="space-y-3">
                {currentQ.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(currentQ.id, option.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      answers[currentQ.id] === option.value
                        ? 'border-violet-500 bg-gradient-to-r from-violet-50 to-cyan-50 shadow-md'
                        : 'border-gray-100 hover:border-violet-300 hover:bg-violet-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        {option.emoji && <span className="text-xl mr-3">{option.emoji}</span>}
                        <div>
                          <span className="font-medium text-gray-700 block">{option.label}</span>
                          {option.tip && answers[currentQ.id] === option.value && (
                            <span className="text-xs text-violet-600 mt-1 block">💡 {option.tip}</span>
                          )}
                        </div>
                      </div>
                      {answers[currentQ.id] === option.value && (
                        <div className="bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full p-1 ml-3">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
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
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-violet-500 bg-gradient-to-r from-violet-50 to-cyan-50 shadow-md'
                          : 'border-gray-100 hover:border-violet-300 hover:bg-violet-50/50'
                      } ${!canSelect && !isSelected ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-xl mr-3">{option.emoji}</span>
                          <span className="font-medium text-gray-700">{option.label}</span>
                        </div>
                        {isSelected && (
                          <div className="bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full p-1">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
                <p className="text-sm text-gray-400 text-center mt-3">
                  Seleccionadas: <span className="font-semibold text-violet-600">{(answers[currentQ.id] || []).length}</span> / {currentQ.max}
                </p>
              </div>
            )}

            {/* Multiple with Categories */}
            {currentQ.type === 'multiple' && currentQ.categories && (
              <div className="space-y-5">
                {currentQ.categories.map((category, catIdx) => (
                  <div key={catIdx}>
                    <h4 className="font-semibold text-gray-600 mb-2 text-sm">{category.name}</h4>
                    <div className="grid grid-cols-2 gap-2">
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
                            className={`p-3 rounded-lg border-2 text-center transition-all text-sm font-medium ${
                              isSelected
                                ? 'border-violet-500 bg-violet-50 text-violet-700'
                                : 'border-gray-200 hover:border-violet-300 text-gray-600'
                            } ${!canSelect && !isSelected ? 'opacity-40' : ''}`}
                          >
                            {option.label}
                            {isSelected && <span className="ml-1">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <p className="text-sm text-gray-400 text-center bg-violet-50 p-2 rounded-lg">
                  Seleccionadas: <span className="font-semibold text-violet-600">{(answers[currentQ.id] || []).length}</span> / {currentQ.max}
                </p>
              </div>
            )}

            {/* Slider */}
            {currentQ.type === 'slider' && (
              <div className="space-y-5">
                <div className="bg-gradient-to-r from-violet-50 to-cyan-50 p-5 rounded-xl text-center border border-violet-100">
                  <p className="text-sm text-gray-500 mb-1">Tu gasto mensual</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
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
                    background: `linear-gradient(to right, rgb(124 58 237) 0%, rgb(6 182 212) ${((answers[currentQ.id] || currentQ.defaultValue) - currentQ.min) / (currentQ.max - currentQ.min) * 100}%, rgb(229 231 235) ${((answers[currentQ.id] || currentQ.defaultValue) - currentQ.min) / (currentQ.max - currentQ.min) * 100}%, rgb(229 231 235) 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>$200K</span>
                  <span>$10M+</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="p-5 bg-gray-50 flex justify-between items-center">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                currentQuestion === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Anterior
            </button>

            <button
              onClick={nextQuestion}
              className="flex items-center px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-violet-600 to-cyan-500 text-white transition-all hover:shadow-lg hover:scale-[1.02]"
            >
              {currentQuestion === visibleQuestions.length - 1 ? '✨ Ver Resultados' : 'Siguiente'}
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
