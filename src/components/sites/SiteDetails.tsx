
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useSites } from '@/context/SiteContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, Plus, File } from 'lucide-react';
import { SiteReportList } from './SiteReportList';

export function SiteDetails() {
  const { siteId } = useParams<{ siteId: string }>();
  const { getSiteById } = useSites();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const site = getSiteById(siteId || '');
  
  if (!site) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold mb-4">האתר לא נמצא</h2>
        <Button onClick={() => navigate('/sites')}>חזרה לרשימת האתרים</Button>
      </div>
    );
  }

  const handleCreateNewReport = () => {
    toast({
      title: "יצירת סקר חדש",
      description: "עוברים ליצירת סקר חדש עבור האתר",
    });
    navigate(`/sites/${siteId}/new-report`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate('/sites')}>
          <ChevronLeft className="h-4 w-4 ml-2" />
          חזרה לרשימת האתרים
        </Button>
        
        <h1 className="text-2xl font-bold">{site.name}</h1>
        
        <Button onClick={handleCreateNewReport}>
          <Plus className="h-4 w-4 ml-2" />
          סקר בטיחות חדש
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>פרטי האתר</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="font-medium">כתובת:</dt>
                <dd>{site.address}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">איש קשר:</dt>
                <dd>{site.contactPerson || '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">טלפון:</dt>
                <dd>{site.phoneNumber || '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">תאריך הוספה:</dt>
                <dd>{new Date(site.createdAt).toLocaleDateString('he-IL')}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>סטטיסטיקה</CardTitle>
            <CardDescription>סיכום סקרי הבטיחות באתר</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>סקרים פתוחים</span>
                <span className="font-bold">2</span>
              </div>
              <Progress value={40} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>אחוז טיפול בממצאים</span>
                <span className="font-bold">68%</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>ממצאים בדחיפות גבוהה</span>
                <span className="font-bold">3</span>
              </div>
              <Progress value={20} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <SiteReportList siteId={siteId} />
    </div>
  );
}
