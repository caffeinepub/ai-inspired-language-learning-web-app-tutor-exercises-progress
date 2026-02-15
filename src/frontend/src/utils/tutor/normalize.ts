export function normalize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function areAnswersEquivalent(userAnswer: string, expectedAnswer: string): boolean {
  return normalize(userAnswer) === normalize(expectedAnswer);
}
