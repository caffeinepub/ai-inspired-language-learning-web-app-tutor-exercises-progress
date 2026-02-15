import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAddVocabularyItem } from '@/hooks/useQueries';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { VocabularyItem } from '@/backend';

interface VocabularyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem?: VocabularyItem | null;
}

export default function VocabularyFormDialog({ open, onOpenChange, editItem }: VocabularyFormDialogProps) {
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');

  const addItem = useAddVocabularyItem();

  useEffect(() => {
    if (editItem) {
      setWord(editItem.word);
      setTranslation(editItem.translation);
      setNotes(editItem.notes || '');
      setTags(editItem.tags?.join(', ') || '');
    } else {
      setWord('');
      setTranslation('');
      setNotes('');
      setTags('');
    }
  }, [editItem, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!word.trim() || !translation.trim()) {
      toast.error('Word and translation are required');
      return;
    }

    try {
      const tagArray = tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      await addItem.mutateAsync({
        word: word.trim(),
        translation: translation.trim(),
        notes: notes.trim() || null,
        tags: tagArray.length > 0 ? tagArray : null,
      });

      toast.success(editItem ? 'Item updated successfully!' : 'Item added successfully!');
      onOpenChange(false);
    } catch (error) {
      console.error('Add vocabulary error:', error);
      toast.error('Failed to save item');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editItem ? 'Edit Vocabulary' : 'Add Vocabulary'}</DialogTitle>
          <DialogDescription>
            {editItem ? 'Update your vocabulary item' : 'Add a new word or phrase to your vocabulary'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="word">Word / Phrase</Label>
            <Input
              id="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="e.g., Hola"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="translation">Translation</Label>
            <Input
              id="translation"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="e.g., Hello"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add context or usage examples..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (optional)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., greetings, basic, common"
            />
            <p className="text-xs text-muted-foreground">Separate tags with commas</p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={addItem.isPending} className="flex-1">
              {addItem.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : editItem ? (
                'Update'
              ) : (
                'Add'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
