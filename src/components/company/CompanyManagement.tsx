import React, { useState } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import {
  Building,
  Edit,
  Trash2,
  Plus,
  Mail,
  Phone,
  MapPin,
  Users,
  Activity,
  FileText,
  Briefcase,
} from 'lucide-react';

interface EditCompanyDialogProps {
  company: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditCompanyDialog: React.FC<EditCompanyDialogProps> = ({ company, open, onOpenChange }) => {
  const { updateCompany } = useCompany();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: company?.name || '',
    address: company?.address || '',
    contactName: company?.contactName || '',
    contactPhone: company?.contactPhone || '',
    contactEmail: company?.contactEmail || '',
    surveyLocation: company?.surveyLocation || '',
    surveyStatus: company?.surveyStatus || 'פתוח',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: t('error'),
        description: 'שם החברה הוא שדה חובה',
        variant: 'destructive',
      });
      return;
    }

    updateCompany(company.id, formData);
    toast({
      title: t('success'),
      description: t('company.updated'),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('edit.company')}</DialogTitle>
          <DialogDescription>
            {t('edit.company.details')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-name" className="text-right">
              {t('company.name')} *
            </Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-address" className="text-right">
              {t('company.address')}
            </Label>
            <Input
              id="edit-address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-contact-name" className="text-right">
              {t('company.contact.name')}
            </Label>
            <Input
              id="edit-contact-name"
              value={formData.contactName}
              onChange={(e) => handleInputChange('contactName', e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-contact-phone" className="text-right">
              {t('company.contact.phone')}
            </Label>
            <Input
              id="edit-contact-phone"
              value={formData.contactPhone}
              onChange={(e) => handleInputChange('contactPhone', e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-contact-email" className="text-right">
              {t('company.contact.email')}
            </Label>
            <Input
              id="edit-contact-email"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-survey-location" className="text-right">
              {t('company.survey.location')}
            </Label>
            <Input
              id="edit-survey-location"
              value={formData.surveyLocation}
              onChange={(e) => handleInputChange('surveyLocation', e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSave}>
            {t('save')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const CompanyManagement: React.FC = () => {
  const { companies, deleteCompany } = useCompany();
  const { t } = useLanguage();
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEdit = (company: any) => {
    setEditingCompany(company);
    setEditDialogOpen(true);
  };

  const handleDelete = (companyId: string) => {
    deleteCompany(companyId);
    toast({
      title: t('success'),
      description: t('company.deleted'),
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'פתוח':
        return 'default';
      case 'בטיפול':
        return 'secondary';
      case 'סגור':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getCompanyInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('company.management')}</h1>
          <p className="text-muted-foreground">
            ניהול וצפייה בכל החברות במערכת שלך
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="px-3 py-1">
            <Briefcase className="ml-1 h-4 w-4" />
            {t('total.companies')}: {companies.length}
          </Badge>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('total.companies')}</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.length}</div>
            <p className="text-xs text-muted-foreground">
              חברות רשומות במערכת
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('active.surveys')}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {companies.filter(c => c.surveyStatus === 'פתוח' || c.surveyStatus === 'בטיפול').length}
            </div>
            <p className="text-xs text-muted-foreground">
              סקרים פעילים
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('reports.generated')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {companies.filter(c => c.surveyStatus === 'סגור').length}
            </div>
            <p className="text-xs text-muted-foreground">
              דוחות שהושלמו
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Companies List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('companies.list')}
          </CardTitle>
          <CardDescription>
            כל החברות הרשומות במערכת עם פרטי קשר ומידע על הסקרים
          </CardDescription>
        </CardHeader>
        <CardContent>
          {companies.length === 0 ? (
            <div className="text-center py-8">
              <Building className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">{t('no.companies')}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                התחל על ידי הוספת החברה הראשונה שלך
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {companies.map((company) => (
                <Card key={company.id} className="transition-all hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getCompanyInitials(company.name)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{company.name}</h3>
                            <Badge variant={getStatusBadgeVariant(company.surveyStatus)}>
                              {company.surveyStatus}
                            </Badge>
                          </div>
                          
                          <div className="grid gap-1 text-sm text-muted-foreground">
                            {company.address && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {company.address}
                              </div>
                            )}
                            {company.contactName && (
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {company.contactName}
                              </div>
                            )}
                            {company.contactEmail && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {company.contactEmail}
                              </div>
                            )}
                            {company.contactPhone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {company.contactPhone}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(company)}
                        >
                          <Edit className="h-3 w-3 ml-1" />
                          {t('edit')}
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-3 w-3 ml-1" />
                              {t('delete')}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('confirm.delete')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('confirm.delete.company')}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(company.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {t('delete')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Company Dialog */}
      {editingCompany && (
        <EditCompanyDialog
          company={editingCompany}
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open);
            if (!open) setEditingCompany(null);
          }}
        />
      )}
    </div>
  );
};