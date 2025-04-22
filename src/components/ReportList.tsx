
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
import { ReportEntry, ImageCategory } from '@/types/report';
import { ReportListRow } from './report/ReportListRow';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export function ReportList() {
  const { entries, updateEntry, deleteEntry } = useReport();
  const [editEntry, setEditEntry] = useState<ReportEntry | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleEdit = (entry: ReportEntry) => {
    setEditEntry(entry);
  };

  const handleSaveEdit = () => {
    if (editEntry) {
      updateEntry(editEntry.id, editEntry);
      setEditEntry(null);
    }
  };

  const filteredEntries = entries.filter(entry => {
    // Filter by category
    const matchesCategory = categoryFilter === 'all' || entry.category === categoryFilter;
    
    // Filter by search query
    const matchesSearch = 
      entry.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

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
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <CardTitle>פריטי הדוח ({entries.length})</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Input
              placeholder="חפש פריטים..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64"
            />
            <Select
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="סנן לפי קטגוריה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הקטגוריות</SelectItem>
                <SelectItem value="חוץ">חוץ</SelectItem>
                <SelectItem value="פנים">פנים</SelectItem>
                <SelectItem value="מסמכים">מסמכים</SelectItem>
                <SelectItem value="תשתיות">תשתיות</SelectItem>
                <SelectItem value="אחר">אחר</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
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
              {filteredEntries.map((entry, index) => (
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
