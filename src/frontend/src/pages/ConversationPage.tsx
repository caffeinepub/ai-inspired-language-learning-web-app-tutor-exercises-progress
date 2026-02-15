import { useState, useRef, useEffect } from 'react';
import { useGetAllVocabularyItems, useSubmitPracticeResult } from '@/hooks/useQueries';
import AuthGate from '@/components/auth/AuthGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from '@tanstack/react-router';
import { MessageCircle, Send, RotateCcw, Plus, User, Bot } from 'lucide-react';
import { generateConversationTurn } from '@/utils/conversation/generateConversationTurns';
import { generateFeedbackForMultipleAnswers } from '@/utils/tutor/feedback';
import TutorPanel from '@/components/practice/TutorPanel';

interface Message {
  id: number;
  role: 'partner' | 'learner' | 'feedback';
  content: string;
  feedback?: {
    isCorrect: boolean;
    hint: string;
    suggestion: string;
  };
  expectedAnswer?: string;
  userAnswer?: string;
}

interface ConversationTurn {
  partnerPrompt: string;
  acceptableReplies: string[];
  vocabularyItemId: bigint;
}

export default function ConversationPage() {
  const { data: vocabulary = [], isLoading } = useGetAllVocabularyItems();
  const submitResult = useSubmitPracticeResult();

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentTurn, setCurrentTurn] = useState<ConversationTurn | null>(null);
  const [turnIndex, setTurnIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isWaitingForUser, setIsWaitingForUser] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasVocabulary = vocabulary.length > 0;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startConversation = () => {
    setMessages([]);
    setTurnIndex(0);
    setIsStarted(true);
    generateNextTurn(0);
  };

  const resetConversation = () => {
    setMessages([]);
    setCurrentInput('');
    setCurrentTurn(null);
    setTurnIndex(0);
    setIsStarted(false);
    setIsWaitingForUser(false);
  };

  const generateNextTurn = (index: number) => {
    if (vocabulary.length === 0) return;

    const turn = generateConversationTurn(vocabulary, index);
    setCurrentTurn(turn);

    const newMessage: Message = {
      id: messages.length,
      role: 'partner',
      content: turn.partnerPrompt,
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsWaitingForUser(true);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim() || !currentTurn || !isWaitingForUser) return;

    const userMessage: Message = {
      id: messages.length,
      role: 'learner',
      content: currentInput.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsWaitingForUser(false);

    const feedback = generateFeedbackForMultipleAnswers(currentInput.trim(), currentTurn.acceptableReplies);

    const feedbackMessage: Message = {
      id: messages.length + 1,
      role: 'feedback',
      content: '',
      feedback,
      expectedAnswer: currentTurn.acceptableReplies[0],
      userAnswer: currentInput.trim(),
    };

    setMessages((prev) => [...prev, feedbackMessage]);

    try {
      await submitResult.mutateAsync({
        id: currentTurn.vocabularyItemId,
        passed: feedback.isCorrect,
      });
    } catch (error) {
      console.error('Failed to submit practice result:', error);
    }

    setCurrentInput('');

    setTimeout(() => {
      const nextIndex = turnIndex + 1;
      setTurnIndex(nextIndex);
      generateNextTurn(nextIndex);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <AuthGate>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Conversation Practice</h1>
            <p className="text-muted-foreground">Loading your vocabulary...</p>
          </div>
        </div>
      </AuthGate>
    );
  }

  if (!hasVocabulary) {
    return (
      <AuthGate>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Conversation Practice</h1>
            <p className="text-muted-foreground">Practice real conversations using your vocabulary</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>No Vocabulary Yet</CardTitle>
              <CardDescription>
                Add vocabulary items first to start practicing conversations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/vocabulary">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Vocabulary
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </AuthGate>
    );
  }

  return (
    <AuthGate>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Conversation Practice</h1>
            <p className="text-muted-foreground">Practice real conversations using your vocabulary</p>
          </div>
          {isStarted && (
            <Button onClick={resetConversation} variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>

        <Card className="h-[600px] flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <CardTitle>Conversation</CardTitle>
              </div>
              <Badge variant={isWaitingForUser ? 'default' : 'secondary'}>
                {isWaitingForUser ? 'Your Turn' : isStarted ? 'Partner Turn' : 'Not Started'}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {!isStarted ? (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center space-y-4 max-w-md">
                  <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Ready to Practice?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start a conversation practice session. Your conversation partner will prompt you with
                      questions based on your vocabulary, and you'll practice responding naturally.
                    </p>
                  </div>
                  <Button onClick={startConversation} size="lg" className="gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Start Conversation
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <ScrollArea className="flex-1 p-6" ref={scrollRef}>
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id}>
                        {message.role === 'partner' && (
                          <div className="flex gap-3 items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Bot className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                                <p className="text-sm">{message.content}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {message.role === 'learner' && (
                          <div className="flex gap-3 items-start justify-end">
                            <div className="flex-1 flex justify-end">
                              <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                                <p className="text-sm">{message.content}</p>
                              </div>
                            </div>
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                              <User className="h-4 w-4" />
                            </div>
                          </div>
                        )}

                        {message.role === 'feedback' && message.feedback && (
                          <div className="my-4">
                            <TutorPanel
                              feedback={message.feedback}
                              userAnswer={message.userAnswer || ''}
                              expectedAnswer={message.expectedAnswer || ''}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={isWaitingForUser ? 'Type your response...' : 'Wait for partner...'}
                      disabled={!isWaitingForUser || submitResult.isPending}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!currentInput.trim() || !isWaitingForUser || submitResult.isPending}
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthGate>
  );
}
