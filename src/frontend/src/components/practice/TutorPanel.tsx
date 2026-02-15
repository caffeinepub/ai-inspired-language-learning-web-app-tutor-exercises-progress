import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, Lightbulb } from 'lucide-react';

interface TutorPanelProps {
  feedback: {
    isCorrect: boolean;
    hint: string;
    suggestion: string;
  };
  userAnswer: string;
  expectedAnswer: string;
}

export default function TutorPanel({ feedback, userAnswer, expectedAnswer }: TutorPanelProps) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">AI Tutor Feedback</CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  This feedback uses deterministic heuristics including normalization (case, whitespace, diacritics) and
                  typo tolerance (edit distance) to help you learn. No external AI services are used.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {!feedback.isCorrect && (
          <>
            <div>
              <p className="text-sm font-medium mb-1">Your answer:</p>
              <p className="text-sm text-muted-foreground">{userAnswer}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Expected answer:</p>
              <p className="text-sm text-muted-foreground">{expectedAnswer}</p>
            </div>
          </>
        )}
        <div>
          <p className="text-sm font-medium mb-1">Hint:</p>
          <p className="text-sm text-muted-foreground">{feedback.hint}</p>
        </div>
        {feedback.suggestion && (
          <div>
            <p className="text-sm font-medium mb-1">Suggestion:</p>
            <p className="text-sm text-muted-foreground">{feedback.suggestion}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
