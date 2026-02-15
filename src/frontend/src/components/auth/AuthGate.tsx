import { ReactNode } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Globe, TrendingUp, Zap } from 'lucide-react';
import BrandHeader from '../branding/BrandHeader';
import HeroIllustration from '../branding/HeroIllustration';

interface AuthGateProps {
  children: ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;

  if (isAuthenticated) {
    return <>{children}</>;
  }

  const features = [
    {
      icon: BookOpen,
      title: 'Smart Vocabulary',
      description: 'Build your personal vocabulary library with translations and notes',
    },
    {
      icon: Zap,
      title: 'Interactive Practice',
      description: 'Engage with exercises tailored to your learning progress',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your accuracy and review items that need attention',
    },
    {
      icon: Globe,
      title: 'Multiple Languages',
      description: 'Learn any language pair at your own pace',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12">
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <BrandHeader size="large" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Master Languages with AI-Powered Learning
            </h1>
            <p className="text-xl text-muted-foreground">
              Build vocabulary, practice with intelligent exercises, and track your progress—all in one place.
            </p>
          </div>

          <Button
            onClick={login}
            disabled={loginStatus === 'logging-in'}
            size="lg"
            className="text-lg px-8 py-6 h-auto"
          >
            {loginStatus === 'logging-in' ? 'Connecting...' : 'Get Started'}
          </Button>

          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-muted">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-base">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="hidden lg:block">
          <HeroIllustration />
        </div>
      </div>
    </div>
  );
}
