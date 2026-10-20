import React from 'react';
import { useQuiz } from '../hooks/useQuiz.js';
import WelcomeStep from '../components/quiz/WelcomeStep.jsx';
import PreQuizStep from '../components/quiz/PreQuizStep.jsx';
import QuestionStep from '../components/quiz/QuestionStep.jsx';
import RegistrationStep from '../components/quiz/RegistrationStep.jsx';
import CalculatingStep from '../components/quiz/CalculatingStep.jsx';
import ResultsStep from '../components/quiz/ResultsStep.jsx';

// Orquesta los pasos del quiz. El estado y las acciones viven en useQuiz.
export default function Quiz() {
  const quiz = useQuiz();
  const { step, setStep, vertical, answers, actions } = quiz;

  switch (step) {
    case 'landing':
      return <WelcomeStep onStart={actions.startQuiz} />;
    case 'prequiz':
      return <PreQuizStep preQuiz={quiz.questionsData.preQuiz} onChoose={actions.choosePreQuizOption} onBack={() => setStep('landing')} />;
    case 'login':
      return (
        <RegistrationStep
          vertical={vertical}
          form={quiz.form}
          setFormField={quiz.setFormField}
          phoneIsValid={quiz.phoneIsValid}
          canSubmit={quiz.canSubmitForm}
          onSubmit={actions.submitRegistration}
          onBack={() => setStep('quiz')}
        />
      );
    case 'calculating':
      return <CalculatingStep vertical={vertical} />;
    case 'results':
      if (quiz.results) return (
        <ResultsStep
          results={quiz.results}
          vertical={vertical}
          user={quiz.user}
          answers={answers}
          activeCount={quiz.activeCount}
          applyTarget={quiz.applyTarget}
          onApply={actions.openApply}
          onConfirmApply={actions.confirmApply}
          onCloseApply={actions.closeApply}
          onReset={actions.resetQuiz}
        />
      );
      break;
    default:
      break;
  }

  const question = quiz.currentQ;
  return (
    <QuestionStep
      question={question}
      index={quiz.currentQuestion}
      total={quiz.displayTotal}
      sections={quiz.questionsData.sections?.[vertical] || []}
      value={question ? answers[question.id] : undefined}
      onAnswer={(value) => actions.handleAnswer(question.id, value)}
      onNext={actions.nextQuestion}
      onPrev={actions.prevQuestion}
    />
  );
}
