// Preguntas visibles de una vertical según las respuestas (reglas showIf de config/questions.json).
export const getVisibleQuestions = (questionsData, vertical, answers) => {
  if (!vertical) return [];
  const verticalQuestions = questionsData.questions?.[vertical] || questionsData.questions || [];
  return verticalQuestions.filter(q => {
    if (!q.showIf) return true;
    const { field, equals, notEquals, includes } = q.showIf;
    const answer = answers[field];
    if (equals !== undefined) return answer === equals;
    if (notEquals !== undefined) return answer !== notEquals;
    if (includes !== undefined) return Array.isArray(answer) ? answer.includes(includes) : answer === includes;
    return true;
  });
};

export const DEFAULT_PREQUIZ_OPTIONS = [
  { value: 'nueva_tarjeta', label: 'Nueva tarjeta de crédito', description: 'Quiero mi primera tarjeta o una adicional', emoji: '💳', vertical: 'cards' },
  { value: 'cambiar_tarjeta', label: 'Cambiar mi tarjeta actual', description: 'Tengo una tarjeta pero no estoy satisfecho', emoji: '🔄', vertical: 'cards' },
  { value: 'necesito_credito', label: 'Necesito dinero / Crédito', description: 'Busco financiamiento personal o para mi negocio', emoji: '💰', vertical: 'credit' }
];
