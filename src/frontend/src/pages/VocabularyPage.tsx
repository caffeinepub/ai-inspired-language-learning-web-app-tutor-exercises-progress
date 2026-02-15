import { useState } from 'react';
import { useGetAllVocabularyItems } from '@/hooks/useQueries';
import AuthGate from '@/components/auth/AuthGate';
import ProfileSetupModal from '@/components/auth/ProfileSetupModal';
import VocabularyList from '@/components/vocabulary/VocabularyList';
import VocabularyFormDialog from '@/components/vocabulary/VocabularyFormDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { VocabularyItem } from '@/backend';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '@/hooks/useQueries';

export default function VocabularyPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: vocabulary = [], isLoading } = useGetAllVocabularyItems();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<VocabularyItem | null>(null);

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleEdit = (item: VocabularyItem) => {
    setEditItem(item);
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditItem(null);
    }
  };

  return (
    <AuthGate>
      <ProfileSetupModal open={showProfileSetup} />

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Vocabulary</h1>
            <p className="text-muted-foreground">Manage your personal vocabulary collection</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Word
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading vocabulary...</div>
        ) : (
          <VocabularyList items={vocabulary} onEdit={handleEdit} />
        )}
      </div>

      <VocabularyFormDialog open={dialogOpen} onOpenChange={handleDialogClose} editItem={editItem} />
    </AuthGate>
  );
}
