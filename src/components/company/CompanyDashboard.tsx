
import React, { useState } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { useReport } from '@/context/ReportContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Building, List } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CompanyDetails } from '@/types/report';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from '@/components/report/StatusBadge';
import { UrgencyBadge } from '@/components/report/UrgencyBadge';

export function CompanyDashboard() {
  const { selectedCompany, companies } = useCompany();
  const { entries } = useReport();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState<'info' | 'reports'>('info');

  if (!selectedCompany) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>דשבורד חברה</CardTitle>
          <CardDescription>לא נבחרה חברה</CardDescription>
        </CardHeader>
        <CardContent>
          <p>אנא בחר חברה מהרשימה למעלה כדי לצפות בדשבורד שלה.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Filter entries for this company
  const companyEntries = entries.filter(entry => 
    !entry.companyId || entry.companyId === selectedCompany.id
  );
  
  // Count status
  const pendingCount = companyEntries.filter(e => e.status === 'טרם טופל').length;
  const inProgressCount = companyEntries.filter(e => e.status === 'בטיפול').length;
  const completedCount = companyEntries.filter(e => e.status === 'טופל').length;
  
  // Count by urgency
  const highUrgencyCount = companyEntries.filter(e => e.urgency === 'גבוהה').length;
  const mediumUrgencyCount = companyEntries.filter(e => e.urgency === 'בינונית').length;
  const lowUrgencyCount = companyEntries.filter(e => e.urgency === 'נמוכה').length;

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <Building className="ml-2 h-5 w-5" />
              {selectedCompany.name}
              <Badge variant="outline" className="mr-2">
                {selectedCompany.surveyLocation || 'ללא אתר'}
              </Badge>
            </CardTitle>
            <CardDescription>
              דשבורד חברה - סקרים ופרטי התקשרות
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={selectedTab === 'info' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSelectedTab('info')}
            >
              <Building className="ml-1 h-4 w-4" />
              פרטי חברה
            </Button>
            <Button 
              variant={selectedTab === 'reports' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSelectedTab('reports')}
            >
              <List className="ml-1 h-4 w-4" />
              סקרים
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {selectedTab === 'info' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">פרטי חברה</h3>
                <div className="space-y-2">
                  <p><strong>שם חברה:</strong> {selectedCompany.name}</p>
                  <p><strong>אתר:</strong> {selectedCompany.surveyLocation || 'לא צוין'}</p>
                  <p><strong>כתובת:</strong> {selectedCompany.address || 'לא צוין'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">פרטי קשר</h3>
                <div className="space-y-2">
                  <p><strong>איש קשר:</strong> {selectedCompany.contactName || 'לא צוין'}</p>
                  <p><strong>טלפון:</strong> {selectedCompany.contactPhone || 'לא צוין'}</p>
                  <p><strong>אימייל:</strong> {selectedCompany.contactEmail || 'לא צוין'}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">סיכום סקרים</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">סה"כ ממצאים</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{companyEntries.length}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">ממתינים לטיפול</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{pendingCount}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">הושלמו</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{completedCount}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">דחיפות גבוהה</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-red-600">{highUrgencyCount}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">דחיפות בינונית</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-500">{mediumUrgencyCount}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">דחיפות נמוכה</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">{lowUrgencyCount}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
        
        {selectedTab === 'reports' && (
          <div>
            <h3 className="text-lg font-medium mb-4">רשימת ממצאים</h3>
            {companyEntries.length > 0 ? (
              <Table>
                <TableCaption>רשימת ממצאים לחברה {selectedCompany.name}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">#</TableHead>
                    <TableHead>נושא</TableHead>
                    <TableHead>תאריך</TableHead>
                    <TableHead>דחיפות</TableHead>
                    <TableHead>סטטוס</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companyEntries.map((entry, index) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{entry.topic}</TableCell>
                      <TableCell>{new Date(entry.timestamp).toLocaleDateString('he-IL')}</TableCell>
                      <TableCell><UrgencyBadge urgency={entry.urgency} /></TableCell>
                      <TableCell><StatusBadge status={entry.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-center py-8">אין ממצאים לחברה זו</p>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="justify-end">
        <Button variant="outline" className="ml-2">
          <FileText className="ml-2 h-4 w-4" />
          הפק סקר לחברה זו
        </Button>
      </CardFooter>
    </Card>
  );
}
