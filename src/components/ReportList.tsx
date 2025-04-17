
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
import { Button } from '@/components/ui/button';
import { 
  Pencil, 
  Trash2, 
  CheckCircle,
  Clock,
  AlertCircle,
  AlarmClock
} from 'lucide-react';
import { useReport } from '@/context/ReportContext';
import { ReportEntry, StatusType, UrgencyLevel } from '@/types/report';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ReportList() {
  const { entries, updateEntry, deleteEntry } = useReport();
  const [editEntry, setEditEntry] = useState<ReportEntry | null>(null);

  const getUrgencyIcon = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case 'גבוהה':
        return <AlertCircle className="h-4 w-4" />;
      case 'בינונית':
        return <AlarmClock className="h-4 w-4" />;
      case 'נמוכה':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: StatusType) => {
    switch (status) {
      case 'טרם טופל':
        return <Clock className="h-4 w-4" />;
      case 'בטיפול':
        return <AlarmClock className="h-4 w-4" />;
      case 'טופל':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getUrgencyClass = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case 'גבוהה':
        return 'urgency-high';
      case 'בינונית':
        return 'urgency-medium';
      case 'נמוכה':
        return 'urgency-low';
      default:
        return '';
    }
  };

  const getStatusClass = (status: StatusType) => {
    switch (status) {
      case 'טרם טופל':
        return 'status-pending';
      case 'בטיפול':
        return 'status-in-progress';
      case 'טופל':
        return 'status-completed';
      default:
        return '';
    }
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
                    <Badge 
                      variant="outline" 
                      className={getUrgencyClass(entry.urgency)}
                    >
                      {getUrgencyIcon(entry.urgency)}
                      <span className="mr-1">{entry.urgency}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={getStatusClass(entry.status)}
                    >
                      {getStatusIcon(entry.status)}
                      <span className="mr-1">{entry.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2 items-center justify-end">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setEditEntry(entry)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>עריכת פריט</DialogTitle>
                          </DialogHeader>
                          {editEntry && (
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
                          )}
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button 
                                type="button" 
                                onClick={handleSaveEdit}
                              >
                                שמור שינויים
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive hover:text-white"
                        onClick={() => deleteEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
