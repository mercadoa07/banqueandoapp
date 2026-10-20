// Estado y acciones del quiz, separados de la presentación.
// Pasos: landing → prequiz → quiz → login → calculating → results
import { useEffect, useMemo, useRef, useState } from 'react';
import cardsData from '../../config/cards.json';
import creditProductsData from '../../config/creditProducts.json';
import questionsData from '../../config/questions.json';
import matchingConfig from '../../config/matchingConfig.json';
import { createMatchingEngine, createCreditMatchingEngine } from '../engine/matchingEngine.js';
import { saveQuizSession, trackApplyClick, createSessionId } from '../lib/supabase.js';
import { getVisibleQuestions } from '../lib/questions.js';
import { normalizePhone, isValidEmail } from '../lib/validation.js';
import { trackEvent } from '../lib/analytics.js';

const CALCULATING_DELAY_MS = 1500;
const EMPTY_FORM = { phone: '', email: '', name: '', age: '', gender: '', city: '', termsAccepted: false, marketingAccepted: false };

export function useQuiz() {
  const engines = useMemo(() => ({
    cards: createMatchingEngine(cardsData, matchingConfig),
    credit: createCreditMatchingEngine(creditProductsData, matchingConfig)
  }), []);

  // Quien llega desde "Tarjetas" o "Créditos" en la página de inicio (/quiz?tipo=...) no vuelve a elegir:
  // crédito arranca en la primera pregunta; tarjeta, en "nueva o cambiar".
  const [entry] = useState(() => (typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('tipo')));
  const [step, setStep] = useState(() => (entry === 'credito' ? 'quiz' : entry === 'tarjeta' ? 'prequiz' : 'landing'));
  const [vertical, setVertical] = useState(() => (entry === 'credito' ? 'credit' : null));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(() => (entry === 'credito' ? { product_selection: 'necesito_credito' } : {}));
  const [results, setResults] = useState(null);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [applyTarget, setApplyTarget] = useState(null); // { card, rank } del popup "Solicitar"
  const quizStartTime = useRef(null);
  const sessionIdRef = useRef(null);
  const [visitId] = useState(() => createSessionId()); // id anónimo de esta visita (tabla quiz_events)
  const track = (event, data) => trackEvent(visitId, event, { vertical, ...data });

  const visibleQuestions = getVisibleQuestions(questionsData, vertical, answers);
  const currentQ = visibleQuestions[currentQuestion];

  // Registrar cada pregunta vista y la llegada al formulario (para el embudo del tablero).
  const currentQuestionId = currentQ?.id;
  useEffect(() => {
    if (step === 'quiz' && currentQuestionId) trackEvent(visitId, 'question_view', { vertical, step: currentQuestion, questionId: currentQuestionId });
    if (step === 'login') trackEvent(visitId, 'registration_view', { vertical });
  }, [step, currentQuestion, currentQuestionId, vertical, visitId]);

  // Entrada directa: registrar el inicio (y la vertical, si ya viene elegida) una sola vez.
  useEffect(() => {
    if (!entry) return;
    quizStartTime.current = Date.now();
    trackEvent(visitId, 'quiz_start', { vertical: entry === 'credito' ? 'credit' : null });
    if (entry === 'credito') trackEvent(visitId, 'vertical_selected', { vertical: 'credit' });
  }, [entry, visitId]);

  const setFormField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const phoneIsValid = normalizePhone(form.phone) !== null;
  const canSubmitForm = phoneIsValid && isValidEmail(form.email) && form.termsAccepted;

  const handleAnswer = (questionId, value) => setAnswers(prev => ({ ...prev, [questionId]: value }));

  const startQuiz = () => { quizStartTime.current = Date.now(); track('quiz_start'); setStep('prequiz'); };

  const choosePreQuizOption = (option) => {
    trackEvent(visitId, 'vertical_selected', { vertical: option.vertical });
    setVertical(option.vertical);
    setAnswers({ product_selection: option.value });
    quizStartTime.current = Date.now();
    setStep('quiz');
  };

  const nextQuestion = () => (currentQuestion < visibleQuestions.length - 1 ? setCurrentQuestion(prev => prev + 1) : setStep('login'));
  const prevQuestion = () => currentQuestion > 0 && setCurrentQuestion(prev => prev - 1);

  const calculateResults = async (quizAnswers, currentUser) => {
    const matchResults = (vertical === 'credit' ? engines.credit : engines.cards).getTopResults(quizAnswers);
    if (!matchResults?.topMatch) {
      setResults({ topMatch: null, alternatives: [] });
      setStep('results');
      return;
    }
    setResults(matchResults);
    setStep('results');
    const timeToComplete = quizStartTime.current ? Math.round((Date.now() - quizStartTime.current) / 1000) : null;
    sessionIdRef.current = createSessionId();
    track('results_view', { sessionId: sessionIdRef.current });
    try {
      await saveQuizSession({ sessionId: sessionIdRef.current, answers: quizAnswers, topMatch: matchResults.topMatch, alternatives: matchResults.alternatives, timeToComplete, vertical, user: currentUser });
    } catch (error) { console.error('[Quiz] Error guardando sesión:', error); }
  };

  const submitRegistration = (e) => {
    e.preventDefault();
    if (!canSubmitForm) return;
    const phone = normalizePhone(form.phone);
    const email = form.email.trim();
    const age = form.age || null, gender = form.gender || null, city = form.city || null;
    const newUser = {
      id: null, email, phone, age, gender, city,
      user_metadata: { name: form.name.trim() || null, phone, age, gender, city },
      termsAccepted: true, termsAcceptedAt: new Date().toISOString(),
      marketingAccepted: form.marketingAccepted === true
    };
    setUser(newUser);
    setStep('calculating');
    setTimeout(() => calculateResults(answers, newUser), CALCULATING_DELAY_MS);
  };

  const openApply = (card, rank) => setApplyTarget({ card, rank });
  const closeApply = () => setApplyTarget(null);
  const confirmApply = () => {
    const { card, rank } = applyTarget || {};
    if (card) {
      // No se espera la respuesta: el registro no debe frenar la salida hacia la entidad.
      trackApplyClick({ sessionId: sessionIdRef.current, product: card, rank, vertical }).catch(() => {});
    }
    if (card?.applyUrl) window.open(card.applyUrl, '_blank', 'noopener');
    closeApply();
  };

  const resetQuiz = () => {
    setStep('landing'); setCurrentQuestion(0); setAnswers({}); setResults(null);
    setVertical(null); setUser(null); setForm(EMPTY_FORM); setApplyTarget(null);
    quizStartTime.current = null; sessionIdRef.current = null;
  };

  return {
    step, setStep, vertical, answers, results, user,
    questionsData, visibleQuestions, currentQuestion, currentQ,
    form, setFormField, phoneIsValid, canSubmitForm,
    applyTarget,
    activeCount: {
      cards: cardsData.cards.filter(c => c.active !== false).length,
      credit: creditProductsData.creditProducts.filter(p => p.active !== false).length
    },
    actions: { startQuiz, choosePreQuizOption, handleAnswer, nextQuestion, prevQuestion, submitRegistration, openApply, closeApply, confirmApply, resetQuiz }
  };
}
