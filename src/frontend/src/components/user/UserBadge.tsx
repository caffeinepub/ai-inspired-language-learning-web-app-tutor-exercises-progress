import { useGetCallerUserProfile } from '@/hooks/useQueries';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

export default function UserBadge() {
  const { data: profile, isLoading } = useGetCallerUserProfile();

  if (isLoading) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  if (!profile) {
    return null;
  }

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

  const initials = `${profile.activeLanguage.sourceLanguage.substring(0, 1).toUpperCase()}${profile.activeLanguage.targetLanguage.substring(0, 1).toUpperCase()}`;

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="hidden sm:block text-sm">
        <div className="font-medium text-foreground">
          {getLanguageName(profile.activeLanguage.sourceLanguage)} →{' '}
          {getLanguageName(profile.activeLanguage.targetLanguage)}
        </div>
      </div>
    </div>
  );
}
