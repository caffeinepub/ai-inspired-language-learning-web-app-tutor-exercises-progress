import { useGetCallerUserProfile } from '@/hooks/useQueries';
import AuthGate from '@/components/auth/AuthGate';
import ProfileSetupModal from '@/components/auth/ProfileSetupModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, User } from 'lucide-react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

export default function SettingsPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const getLanguageName = (code: string) => {
    const names: Record<string, string> = {
      en: 'English',
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      it: 'Italian',
      pt: 'Portuguese',
      ru: 'Russian',
      zh: 'Chinese',
      ja: 'Japanese',
      ko: 'Korean',
    };
    return names[code] || code;
  };

  return (
    <AuthGate>
      <ProfileSetupModal open={showProfileSetup} />

      <div className="space-y-8 max-w-3xl">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your learning preferences and account</p>
        </div>

        {profileLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Loading settings...</p>
            </CardContent>
          </Card>
        ) : userProfile ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <CardTitle>Language Settings</CardTitle>
                </div>
                <CardDescription>Your current language learning configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Source Language</span>
                  <Badge variant="secondary">{getLanguageName(userProfile.activeLanguage.sourceLanguage)}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Target Language</span>
                  <Badge variant="secondary">{getLanguageName(userProfile.activeLanguage.targetLanguage)}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-5 w-5 text-primary" />
                  <CardTitle>Account</CardTitle>
                </div>
                <CardDescription>Your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Vocabulary Items</span>
                  <Badge>{userProfile.vocabulary.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Practice Sessions</span>
                  <Badge>{Number(userProfile.practiceCounter)}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Complete profile setup to view settings</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthGate>
  );
}
