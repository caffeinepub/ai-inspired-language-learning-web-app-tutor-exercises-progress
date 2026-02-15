import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, SkipForward } from 'lucide-react';
import TutorPanel from './TutorPanel';
import { Exercise } from '@/types/practice';
import { generateFeedback } from '@/utils/tutor/feedback';

interface PracticeCardProps {
  exercise: Exercise;
  onSubmit: (passed: boolean) => void;
  onSkip: () => void;
  currentIndex: number;
  totalCount: number;
}

export default function PracticeCard({ exercise, onSubmit, onSkip, currentIndex, totalCount }: PracticeCardProps) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<ReturnType<typeof generateFeedback> | null>(null);

  const handleSubmit = () => {
    if (!answer.trim()) return;

    const tutorFeedback = generateFeedback(answer, exercise.expectedAnswer);
    setFeedback(tutorFeedback);
    setSubmitted(true);
    onSubmit(tutorFeedback.isCorrect);
  };

  const handleNext = () => {
    setAnswer('');
    setSubmitted(false);
    setFeedback(null);
  };

  const handleSkipClick = () => {
    setAnswer('');
    setSubmitted(false);
    setFeedback(null);
    onSkip();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline">
              Question {currentIndex + 1} of {totalCount}
            </Badge>
            <Badge variant={exercise.type === 'translation' ? 'default' : 'secondary'}>
              {exercise.type === 'translation' ? 'Translation' : 'Fill in the Blank'}
            </Badge>
          </div>
          <CardTitle className="text-2xl">{exercise.prompt}</CardTitle>
          {exercise.context && <CardDescription className="text-base mt-2">{exercise.context}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer..."
              disabled={submitted}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !submitted) {
                  handleSubmit();
                }
              }}
              className="text-lg py-6"
            />
          </div>

          {!submitted ? (
            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={!answer.trim()} className="flex-1">
                Submit Answer
              </Button>
              <Button onClick={handleSkipClick} variant="outline">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                className={`flex items-center gap-2 p-4 rounded-lg ${
                  feedback?.isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100'
                    : 'bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100'
                }`}
              >
                {feedback?.isCorrect ? (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5" />
                    <span className="font-medium">Not quite right</span>
                  </>
                )}
              </div>

              {feedback && <TutorPanel feedback={feedback} userAnswer={answer} expectedAnswer={exercise.expectedAnswer} />}

              <Button onClick={handleNext} className="w-full">
                Next Question
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
