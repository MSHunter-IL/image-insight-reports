
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UrgencyLevel } from '@/types/report';

interface UrgencyFieldProps {
  urgency: UrgencyLevel;
  setUrgency: (u: UrgencyLevel) => void;
}

export function UrgencyField({ urgency, setUrgency }: UrgencyFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="urgency">דחיפות</Label>
      <Select
        value={urgency}
        onValueChange={(value) => setUrgency(value as UrgencyLevel)}
      >
        <SelectTrigger>
          <SelectValue placeholder="בחר דחיפות" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="גבוהה">גבוהה</SelectItem>
          <SelectItem value="בינונית">בינונית</SelectItem>
          <SelectItem value="נמוכה">נמוכה</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
