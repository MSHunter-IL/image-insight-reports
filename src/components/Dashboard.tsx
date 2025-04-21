
import React, { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { ReportList } from './ReportList';
import { ReportExport } from './ReportExport';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, MapPin, User, Phone } from 'lucide-react';

export function Dashboard() {
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                שם חברה
              </Label>
              <Input 
                placeholder="הזן שם חברה" 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                כתובת
              </Label>
              <Input 
                placeholder="הזן כתובת" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                איש קשר
              </Label>
              <Input 
                placeholder="הזן שם איש קשר"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                טלפון איש קשר
              </Label>
              <Input 
                placeholder="הזן מספר טלפון"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                type="tel"
                dir="ltr"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4">
          <h2 className="text-xl font-semibold mb-4">העלאת תמונה</h2>
          <ImageUploader />
          <div className="mt-6">
            <ReportExport 
              companyDetails={{
                name: companyName,
                address,
                contactName,
                contactPhone
              }}
            />
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
