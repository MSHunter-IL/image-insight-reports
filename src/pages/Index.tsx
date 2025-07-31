import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Auth from '@/pages/Auth';
import { CompanyDashboard } from '@/components/company/CompanyDashboard';
import { CompanyManagement } from '@/components/company/CompanyManagement';
import { ReportExport } from '@/components/ReportExport';
import { ReportList } from '@/components/ReportList';
import { ImageUploader } from '@/components/ImageUploader';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { Footer } from '@/components/common/Footer';
import { SubscriptionDialog } from '@/components/subscription/SubscriptionDialog';
import { useLanguage } from '@/context/LanguageContext';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  LogOut, 
  Building, 
  FileText, 
  Upload, 
  Settings,
  BarChart3,
  Users,
  Home
} from 'lucide-react';

export default function Index() {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const { isSubscribed } = useSubscription();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Safety Reports CRM</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="hidden md:flex">
                {isSubscribed ? t('premium.plan') : 'Free Plan'}
              </Badge>
              <LanguageSelector />
              <Button variant="outline" onClick={signOut}>
                <LogOut className="ml-2 h-4 w-4" />
                יציאה
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation Tabs */}
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-2xl grid-cols-5">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">לוח בקרה</span>
              </TabsTrigger>
              <TabsTrigger value="companies" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">חברות</span>
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">העלאה</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">דוחות</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">נתונים</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Contents */}
          <TabsContent value="dashboard" className="space-y-6">
            <CompanyDashboard />
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            <CompanyManagement />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  {t('upload.image')}
                </CardTitle>
                <CardDescription>
                  העלה תמונות לניתוח בטיחות והפקת דוחות
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUploader />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ReportList />
              </div>
              <div>
                <ReportExport companyDetails={{
                  name: '',
                  address: '',
                  contactName: '',
                  contactPhone: '',
                  contactEmail: '',
                  surveyLocation: '',
                  surveyStatus: 'פתוח'
                }} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  נתונים וסטטיסטיקות
                </CardTitle>
                <CardDescription>
                  צפייה בנתוני השימוש והביצועים
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  נתונים וסטטיסטיקות יתווספו בקרוב
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <Footer />
      
      {/* Subscription Dialog */}
      <SubscriptionDialog 
        isOpen={false}
        setIsOpen={() => {}}
        onSubscribeSuccess={() => {}}
      />
    </div>
  );
}