
import React from 'react';
import { ImageUploader } from './ImageUploader';
import { ReportList } from './ReportList';
import { ReportExport } from './ReportExport';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, MapPin, User } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">סקר בטיחות</h1>
        <img 
          src="/lovable-uploads/26b58140-d09a-43b7-b02a-4365f061cc76.png"
          alt="לוגו"
          className="h-16 object-contain"
        />
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                שם חברה
              </Label>
              <Input placeholder="הזן שם חברה" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                כתובת
              </Label>
              <Input placeholder="הזן כתובת" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                איש קשר
              </Label>
              <Input placeholder="הזן שם איש קשר" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4">
          <h2 className="text-xl font-semibold mb-4">העלאת תמונה</h2>
          <ImageUploader />
          <div className="mt-6">
            <ReportExport />
          </div>
        </div>
        
        <div className="md:col-span-8">
          <h2 className="text-xl font-semibold mb-4">פריטי הדוח</h2>
          <ReportList />
        </div>
      </div>
    </div>
  );
}
