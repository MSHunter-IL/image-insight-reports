
import React from 'react';
import { ImageUploader } from './ImageUploader';
import { ReportList } from './ReportList';
import { ReportExport } from './ReportExport';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileImage, FileText, FileDown } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">מערכת דוחות בטיחות</h1>
      
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
