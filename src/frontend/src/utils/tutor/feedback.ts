import { normalize, areAnswersEquivalent } from './normalize';
import { isCloseMatch, levenshteinDistance } from './editDistance';

export interface Feedback {
  isCorrect: boolean;
  hint: string;
  suggestion: string;
}

export function generateFeedback(userAnswer: string, expectedAnswer: string): Feedback {
  const isExactMatch = areAnswersEquivalent(userAnswer, expectedAnswer);

  if (isExactMatch) {
    return {
      isCorrect: true,
      hint: 'Perfect! Your answer is correct.',
      suggestion: '',
    };
  }

  const normalizedUser = normalize(userAnswer);
  const normalizedExpected = normalize(expectedAnswer);
  const distance = levenshteinDistance(normalizedUser, normalizedExpected);

  if (isCloseMatch(userAnswer, expectedAnswer, 2)) {
    return {
      isCorrect: false,
      hint: 'You were very close! Check for small typos or spelling differences.',
      suggestion: `The correct answer is "${expectedAnswer}". You may have a minor spelling error.`,
    };
  }

  if (normalizedUser.includes(normalizedExpected) || normalizedExpected.includes(normalizedUser)) {
    return {
      isCorrect: false,
      hint: 'Your answer contains part of the correct answer, but is incomplete or has extra words.',
      suggestion: `The correct answer is "${expectedAnswer}".`,
    };
  }

  const userWords = normalizedUser.split(' ');
  const expectedWords = normalizedExpected.split(' ');
  const commonWords = userWords.filter((word) => expectedWords.includes(word));

  if (commonWords.length > 0) {
    return {
      isCorrect: false,
      hint: 'Some words are correct, but the order or other words are different.',
      suggestion: `The correct answer is "${expectedAnswer}". Check word order and missing/extra words.`,
    };
  }

  if (distance > expectedAnswer.length * 0.7) {
    return {
      isCorrect: false,
      hint: 'Your answer is quite different from the expected answer. Review the vocabulary item.',
      suggestion: `The correct answer is "${expectedAnswer}".`,
    };
  }

  return {
    isCorrect: false,
    hint: 'Not quite right. Compare your answer carefully with the correct one.',
    suggestion: `The correct answer is "${expectedAnswer}".`,
  };
}

export function generateFeedbackForMultipleAnswers(userAnswer: string, acceptableAnswers: string[]): Feedback {
  for (const expectedAnswer of acceptableAnswers) {
    if (areAnswersEquivalent(userAnswer, expectedAnswer)) {
      return {
        isCorrect: true,
        hint: 'Perfect! Your answer is correct.',
        suggestion: '',
      };
    }
  }

  let bestFeedback: Feedback | null = null;
  let bestDistance = Infinity;

  for (const expectedAnswer of acceptableAnswers) {
    const normalizedUser = normalize(userAnswer);
    const normalizedExpected = normalize(expectedAnswer);
    const distance = levenshteinDistance(normalizedUser, normalizedExpected);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestFeedback = generateFeedback(userAnswer, expectedAnswer);
    }
  }

  if (bestFeedback && acceptableAnswers.length > 1) {
    const allAnswers = acceptableAnswers.join('" or "');
    bestFeedback.suggestion = bestFeedback.suggestion.replace(
      /The correct answer is "([^"]+)"\./,
      `Acceptable answers include: "${allAnswers}".`
    );
  }

  return bestFeedback || {
    isCorrect: false,
    hint: 'Not quite right. Try again.',
    suggestion: `Acceptable answers include: "${acceptableAnswers.join('" or "')}".`,
  };
}
