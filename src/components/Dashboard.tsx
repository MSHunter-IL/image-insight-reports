
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageUploader } from './ImageUploader';
import { ReportExport } from './ReportExport';
import { ReportList } from './ReportList';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Building } from 'lucide-react';

export function Dashboard() {
  const [companyDetails, setCompanyDetails] = useState({
    name: 'בוב בטיחות',
    address: 'רחוב הבטיחות 123, תל אביב',
    contactName: 'ישראל ישראלי',
    contactPhone: '052-1234567'
  });

  return (
    <div dir="rtl" className="container mx-auto py-6">
      <header className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">מערכת סקרי בטיחות</h1>
          <p className="text-muted-foreground">צור ונהל סקרי בטיחות בקלות</p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Link to="/sites">
            <Button variant="outline" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              ניהול אתרים
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="list">
            <TabsList className="w-full">
              <TabsTrigger value="list" className="flex-1">רשימת ממצאים</TabsTrigger>
              <TabsTrigger value="upload" className="flex-1">העלאת תמונות</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <Card>
                <CardHeader>
                  <CardTitle>רשימת ממצאים</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReportList />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="upload">
              <ImageUploader />
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>פרטי חברה</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium">שם החברה</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded mt-1"
                    value={companyDetails.name}
                    onChange={(e) => setCompanyDetails({...companyDetails, name: e.target.value})}
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">כתובת</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded mt-1"
                    value={companyDetails.address}
                    onChange={(e) => setCompanyDetails({...companyDetails, address: e.target.value})}
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">איש קשר</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded mt-1"
                    value={companyDetails.contactName}
                    onChange={(e) => setCompanyDetails({...companyDetails, contactName: e.target.value})}
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">טלפון</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded mt-1"
                    value={companyDetails.contactPhone}
                    onChange={(e) => setCompanyDetails({...companyDetails, contactPhone: e.target.value})}
                    dir="rtl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <ReportExport companyDetails={companyDetails} />
          </div>
        </div>
      </div>
    </div>
  );
}
