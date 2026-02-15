import { useState } from 'react';
import { VocabularyItem } from '@/backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Edit, Trash2 } from 'lucide-react';
import DeleteVocabularyConfirmDialog from './DeleteVocabularyConfirmDialog';

interface VocabularyListProps {
  items: VocabularyItem[];
  onEdit?: (item: VocabularyItem) => void;
}

export default function VocabularyList({ items, onEdit }: VocabularyListProps) {
  const [search, setSearch] = useState('');
  const [deleteItem, setDeleteItem] = useState<VocabularyItem | null>(null);

  const filteredItems = items.filter((item) => {
    const searchLower = search.toLowerCase();
    return (
      item.word.toLowerCase().includes(searchLower) ||
      item.translation.toLowerCase().includes(searchLower) ||
      (item.notes && item.notes.toLowerCase().includes(searchLower))
    );
  });

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No vocabulary items yet. Add your first word to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vocabulary..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-3">
          {filteredItems.map((item) => (
            <Card key={item.id.toString()}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <CardTitle className="text-lg">{item.word}</CardTitle>
                    <p className="text-sm text-muted-foreground">{item.translation}</p>
                    {item.notes && <p className="text-sm text-muted-foreground italic">{item.notes}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {onEdit && (
                      <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => setDeleteItem(item)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  {item.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">
                  {Number(item.timesCorrect)} ✓ / {Number(item.timesIncorrect)} ✗
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && search && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No items match your search.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <DeleteVocabularyConfirmDialog
        item={deleteItem}
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
      />
    </>
  );
}
