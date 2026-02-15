import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteVocabularyItem } from '@/hooks/useQueries';
import { VocabularyItem } from '@/backend';
import { toast } from 'sonner';

interface DeleteVocabularyConfirmDialogProps {
  item: VocabularyItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteVocabularyConfirmDialog({
  item,
  open,
  onOpenChange,
}: DeleteVocabularyConfirmDialogProps) {
  const deleteItem = useDeleteVocabularyItem();

  const handleDelete = async () => {
    if (!item) return;

    try {
      await deleteItem.mutateAsync(item.id);
      toast.success('Item deleted successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete item');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete vocabulary item?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{item?.word}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
