import { useGetCallerUserProfile, useGetItemsDueForReview } from './useQueries';

export function useDashboardMetrics() {
  const { data: profile } = useGetCallerUserProfile();
  const { data: itemsDue = [] } = useGetItemsDueForReview();

  if (!profile) {
    return {
      todayCount: 0,
      accuracy: 0,
      dueCount: 0,
      hasData: false,
    };
  }

  const vocabulary = profile.vocabulary;
  const hasData = vocabulary.length > 0;

  const totalCorrect = vocabulary.reduce((sum, item) => sum + Number(item.timesCorrect), 0);
  const totalIncorrect = vocabulary.reduce((sum, item) => sum + Number(item.timesIncorrect), 0);
  const totalAttempts = totalCorrect + totalIncorrect;

  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const todayCount = Number(profile.practiceCounter);

  const dueCount = itemsDue.length;

  return {
    todayCount,
    accuracy,
    dueCount,
    hasData,
  };
}
