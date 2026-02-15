import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '@/hooks/useQueries';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import AuthGate from '@/components/auth/AuthGate';
import ProfileSetupModal from '@/components/auth/ProfileSetupModal';
import MetricsCards from '@/components/dashboard/MetricsCards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { BookOpen, Plus, TrendingUp, MessageCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { todayCount, accuracy, dueCount, hasData } = useDashboardMetrics();

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <AuthGate>
      <ProfileSetupModal open={showProfileSetup} />

      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Track your learning progress and continue your journey</p>
        </div>

        {profileLoading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : hasData ? (
          <>
            <MetricsCards todayCount={todayCount} accuracy={accuracy} dueCount={dueCount} />

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <CardTitle>Practice Session</CardTitle>
                  </div>
                  <CardDescription>Continue learning with personalized exercises</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/practice">
                    <Button className="w-full">Start Practice</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <CardTitle>Conversation</CardTitle>
                  </div>
                  <CardDescription>Practice real conversations with your vocabulary</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/conversation">
                    <Button variant="outline" className="w-full">
                      Start Conversation
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Plus className="h-5 w-5 text-primary" />
                    <CardTitle>Vocabulary</CardTitle>
                  </div>
                  <CardDescription>Add new words and phrases to your collection</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/vocabulary">
                    <Button variant="outline" className="w-full">
                      Manage Vocabulary
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>Add your first vocabulary items to begin practicing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/vocabulary" className="flex-1">
                  <Button className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    Add Vocabulary
                  </Button>
                </Link>
                <Link to="/practice" className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    <TrendingUp className="h-4 w-4" />
                    View Practice
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthGate>
  );
}
