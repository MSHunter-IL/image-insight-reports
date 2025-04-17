
import React from 'react';
import { ReportEntry, StatusType, UrgencyLevel } from '@/types/report';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EditReportDialogProps {
  editEntry: ReportEntry | null;
  setEditEntry: (entry: ReportEntry | null) => void;
  onSave: () => void;
  children: React.ReactNode;
}

export function EditReportDialog({ 
  editEntry, 
  setEditEntry, 
  onSave, 
  children 
}: EditReportDialogProps) {
  if (!editEntry) return null;
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>עריכת פריט</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-topic">נושא</Label>
            <Input
              id="edit-topic"
              value={editEntry.topic}
              onChange={(e) => setEditEntry({
                ...editEntry,
                topic: e.target.value
              })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-description">תיאור</Label>
            <Textarea
              id="edit-description"
              value={editEntry.description}
              onChange={(e) => setEditEntry({
                ...editEntry,
                description: e.target.value
              })}
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-urgency">דחיפות</Label>
            <Select
              value={editEntry.urgency}
              onValueChange={(value) => setEditEntry({
                ...editEntry,
                urgency: value as UrgencyLevel
              })}
            >
              <SelectTrigger id="edit-urgency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="גבוהה">גבוהה</SelectItem>
                <SelectItem value="בינונית">בינונית</SelectItem>
                <SelectItem value="נמוכה">נמוכה</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-status">סטטוס</Label>
            <Select
              value={editEntry.status}
              onValueChange={(value) => setEditEntry({
                ...editEntry,
                status: value as StatusType
              })}
            >
              <SelectTrigger id="edit-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="טרם טופל">טרם טופל</SelectItem>
                <SelectItem value="בטיפול">בטיפול</SelectItem>
                <SelectItem value="טופל">טופל</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button 
              type="button" 
              onClick={onSave}
            >
              שמור שינויים
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
