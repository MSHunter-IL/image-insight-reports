
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';  // Changed from Comment to MessageSquare
import { ReportEntry } from '@/types/report';
import { useToast } from '@/components/ui/use-toast';

interface InternalNotesDialogProps {
  entry: ReportEntry;
  onSave: (id: string, notes: string) => void;
}

export function InternalNotesDialog({ entry, onSave }: InternalNotesDialogProps) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(entry.internalNotes || '');
  const { toast } = useToast();

  const handleSave = () => {
    onSave(entry.id, notes);
    setOpen(false);
    toast({
      title: "הערות נשמרו",
      description: "ההערות הפנימיות נשמרו בהצלחה"
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="relative"
        >
          <MessageSquare className="h-4 w-4" />
          {entry.internalNotes && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>הערות פנימיות</DialogTitle>
          <DialogDescription>
            הערות אלה לא יופיעו בסקר המודפס וגלויות רק לצוות
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="הוסף הערות פנימיות..."
            rows={5}
            dir="rtl"
          />
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>שמור הערות</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
