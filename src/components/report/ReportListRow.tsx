
import React from 'react';
import { ReportEntry } from '@/types/report';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { UrgencyBadge } from './UrgencyBadge';
import { StatusBadge } from './StatusBadge';
import { EditReportDialog } from './EditReportDialog';

interface ReportListRowProps {
  entry: ReportEntry;
  index: number;
  onEdit: (entry: ReportEntry) => void;
  onDelete: (id: string) => void;
  editEntry: ReportEntry | null;
  setEditEntry: (entry: ReportEntry | null) => void;
  handleSaveEdit: () => void;
}

export function ReportListRow({ 
  entry, 
  index, 
  onEdit, 
  onDelete,
  editEntry,
  setEditEntry,
  handleSaveEdit
}: ReportListRowProps) {
  return (
    <TableRow key={entry.id}>
      <TableCell className="font-medium">{index + 1}</TableCell>
      <TableCell>
        <div className="h-16 w-16 overflow-hidden rounded-md border">
          <img 
            src={entry.imageUrl} 
            alt={entry.topic} 
            className="h-full w-full object-cover"
          />
        </div>
      </TableCell>
      <TableCell>{entry.topic}</TableCell>
      <TableCell className="max-w-[200px]">
        <div className="truncate">
          {entry.description}
        </div>
      </TableCell>
      <TableCell>
        <UrgencyBadge urgency={entry.urgency} />
      </TableCell>
      <TableCell>
        <StatusBadge status={entry.status} />
      </TableCell>
      <TableCell>
        <div className="flex space-x-2 items-center justify-end">
          <EditReportDialog 
            editEntry={editEntry} 
            setEditEntry={setEditEntry}
            onSave={handleSaveEdit}
          >
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onEdit(entry)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </EditReportDialog>
          <Button 
            variant="outline" 
            size="icon" 
            className="text-destructive hover:bg-destructive hover:text-white"
            onClick={() => onDelete(entry.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
