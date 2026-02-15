import { useState } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetAllVocabularyItems, useSubmitPracticeResult } from '@/hooks/useQueries';
import AuthGate from '@/components/auth/AuthGate';
import ProfileSetupModal from '@/components/auth/ProfileSetupModal';
import PracticeCard from '@/components/practice/PracticeCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { BookOpen, Trophy } from 'lucide-react';
import { generateExercises } from '@/utils/practice/generateExercises';
import { Exercise } from '@/types/practice';
import { useGetCallerUserProfile } from '@/hooks/useQueries';

export default function PracticePage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: vocabulary = [], isLoading: vocabLoading } = useGetAllVocabularyItems();
  const submitResult = useSubmitPracticeResult();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);
  const [results, setResults] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const startSession = () => {
    const generated = generateExercises(vocabulary, 10);
    setExercises(generated);
    setCurrentIndex(0);
    setSessionActive(true);
    setResults({ correct: 0, total: 0 });
  };

  const handleSubmit = async (passed: boolean) => {
    const currentExercise = exercises[currentIndex];
    setResults((prev) => ({
      correct: prev.correct + (passed ? 1 : 0),
      total: prev.total + 1,
    }));

    try {
      await submitResult.mutateAsync({
        id: currentExercise.itemId,
        passed,
      });
    } catch (error) {
      console.error('Failed to submit result:', error);
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setSessionActive(false);
    }
  };

  const handleSkip = async () => {
    const currentExercise = exercises[currentIndex];
    setResults((prev) => ({
      correct: prev.correct,
      total: prev.total + 1,
    }));

    try {
      await submitResult.mutateAsync({
        id: currentExercise.itemId,
        passed: false,
      });
    } catch (error) {
      console.error('Failed to submit skip:', error);
    }

    handleNext();
  };

  const currentExercise = exercises[currentIndex];

  return (
    <AuthGate>
      <ProfileSetupModal open={showProfileSetup} />

      <div className="space-y-8 max-w-3xl mx-auto">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Practice</h1>
          <p className="text-muted-foreground">Test your knowledge with interactive exercises</p>
        </div>

        {vocabLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        ) : vocabulary.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Vocabulary Yet</CardTitle>
              <CardDescription>Add some vocabulary items before starting practice</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/vocabulary">
                <Button className="w-full">Go to Vocabulary</Button>
              </Link>
            </CardContent>
          </Card>
        ) : !sessionActive ? (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <CardTitle>Ready to Practice?</CardTitle>
              </div>
              <CardDescription>
                You have {vocabulary.length} vocabulary item{vocabulary.length !== 1 ? 's' : ''} ready for practice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.total > 0 && (
                <div className="p-4 rounded-lg bg-primary/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Session Complete!</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You got {results.correct} out of {results.total} correct (
                    {Math.round((results.correct / results.total) * 100)}%)
                  </p>
                </div>
              )}
              <Button onClick={startSession} className="w-full" size="lg">
                {results.total > 0 ? 'Start New Session' : 'Start Practice Session'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          currentExercise && (
            <PracticeCard
              exercise={currentExercise}
              onSubmit={handleSubmit}
              onSkip={handleSkip}
              currentIndex={currentIndex}
              totalCount={exercises.length}
            />
          )
        )}
      </div>
    </AuthGate>
  );
}
