
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { File, FileText } from 'lucide-react';

interface SiteReportListProps {
  siteId: string;
}

// Mock data - in a real app this would come from your data store
const mockReports = [
  {
    id: '1',
    date: '2025-04-15',
    status: 'פתוח',
    entryCount: 8,
    completedCount: 5,
  },
  {
    id: '2',
    date: '2025-03-25',
    status: 'סגור',
    entryCount: 12,
    completedCount: 12,
  }
];

export function SiteReportList({ siteId }: SiteReportListProps) {
  const navigate = useNavigate();
  
  const handleViewReport = (reportId: string) => {
    navigate(`/sites/${siteId}/reports/${reportId}`);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>סקרי בטיחות</CardTitle>
      </CardHeader>
      <CardContent>
        {mockReports.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            אין סקרי בטיחות להצגה עבור אתר זה.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>תאריך</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead>ממצאים</TableHead>
                <TableHead>התקדמות</TableHead>
                <TableHead>פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{formatDate(report.date)}</TableCell>
                  <TableCell>
                    <Badge variant={report.status === 'פתוח' ? 'outline' : 'default'}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{report.entryCount}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress 
                        value={(report.completedCount / report.entryCount) * 100} 
                        className="h-2 flex-grow" 
                      />
                      <span className="text-xs w-10 text-left">
                        {Math.round((report.completedCount / report.entryCount) * 100)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewReport(report.id)}
                    >
                      <FileText className="h-4 w-4 ml-2" />
                      צפה בסקר
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
