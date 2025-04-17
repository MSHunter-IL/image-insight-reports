
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useReport } from '@/context/ReportContext';
import { ReportEntry } from '@/types/report';
import { ReportListRow } from './report/ReportListRow';

export function ReportList() {
  const { entries, updateEntry, deleteEntry } = useReport();
  const [editEntry, setEditEntry] = useState<ReportEntry | null>(null);

  const handleEdit = (entry: ReportEntry) => {
    setEditEntry(entry);
  };

  const handleSaveEdit = () => {
    if (editEntry) {
      updateEntry(editEntry.id, editEntry);
      setEditEntry(null);
    }
  };

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center p-6">
            <p className="text-muted-foreground">
              אין פריטים בדוח עדיין. העלה תמונות כדי להתחיל.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>פריטי הדוח ({entries.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">מס'</TableHead>
                <TableHead>תמונה</TableHead>
                <TableHead>נושא</TableHead>
                <TableHead className="max-w-[200px]">תיאור</TableHead>
                <TableHead>דחיפות</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead className="text-left">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry, index) => (
                <ReportListRow
                  key={entry.id}
                  entry={entry}
                  index={index}
                  onEdit={handleEdit}
                  onDelete={deleteEntry}
                  editEntry={editEntry}
                  setEditEntry={setEditEntry}
                  handleSaveEdit={handleSaveEdit}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
