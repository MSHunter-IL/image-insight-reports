
import React from 'react';
import { ReportEntry } from '@/types/report';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { UrgencyBadge } from './UrgencyBadge';
import { StatusBadge } from './StatusBadge';
import { EditReportDialog } from './EditReportDialog';
import { InternalNotesDialog } from './InternalNotesDialog';
import { useReport } from '@/context/ReportContext';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

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
  const { updateInternalNotes } = useReport();
  
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
      <TableCell>
        <div className="flex flex-col gap-1">
          <span>{entry.topic}</span>
          {entry.category && (
            <Badge variant="outline" className="w-fit text-xs">
              {entry.category}
            </Badge>
          )}
        </div>
      </TableCell>
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InternalNotesDialog 
                  entry={entry}
                  onSave={updateInternalNotes}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>הערות פנימיות</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
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
              </TooltipTrigger>
              <TooltipContent>
                <p>ערוך פריט</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="text-destructive hover:bg-destructive hover:text-white"
                  onClick={() => onDelete(entry.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>מחק פריט</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
    </TableRow>
  );
}
