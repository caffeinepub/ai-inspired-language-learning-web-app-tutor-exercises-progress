import { VocabularyItem } from '@/backend';
import { Exercise, ExerciseType } from '@/types/practice';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateTranslationExercise(item: VocabularyItem): Exercise {
  const direction = Math.random() > 0.5;

  return {
    itemId: item.id,
    type: 'translation',
    prompt: direction ? item.word : item.translation,
    expectedAnswer: direction ? item.translation : item.word,
    context: item.notes || undefined,
  };
}

function generateFillInBlankExercise(item: VocabularyItem): Exercise {
  const templates = [
    `Complete: "_____ means ${item.translation}"`,
    `Fill in: "The word for '${item.translation}' is _____"`,
    `What word means '${item.translation}'? _____`,
  ];

  const template = templates[Math.floor(Math.random() * templates.length)];

  return {
    itemId: item.id,
    type: 'fillInBlank',
    prompt: template,
    expectedAnswer: item.word,
    context: item.notes || undefined,
  };
}

export function generateExercises(vocabulary: VocabularyItem[], count: number = 10): Exercise[] {
  if (vocabulary.length === 0) return [];

  const shuffled = shuffleArray(vocabulary);
  const selected = shuffled.slice(0, Math.min(count, vocabulary.length));

  const exercises: Exercise[] = selected.map((item) => {
    const exerciseType: ExerciseType = Math.random() > 0.5 ? 'translation' : 'fillInBlank';

    if (exerciseType === 'translation') {
      return generateTranslationExercise(item);
    } else {
      return generateFillInBlankExercise(item);
    }
  });

  return exercises;
}
