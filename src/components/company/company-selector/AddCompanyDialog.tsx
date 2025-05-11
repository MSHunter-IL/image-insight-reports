import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CompanyFormData } from '@/types/report';

interface AddCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCompany: (company: CompanyFormData) => void;
}

export function AddCompanyDialog({ 
  open, 
  onOpenChange, 
  onAddCompany 
}: AddCompanyDialogProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [newCompany, setNewCompany] = React.useState<CompanyFormData>({
    name: '',
    address: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    surveyLocation: '',
    surveyStatus: 'פתוח' // Adding default value for surveyStatus
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCompany(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCompany = () => {
    if (!newCompany.name) {
      toast({
        title: t('error'),
        description: t('company.name.required'),
        variant: "destructive"
      });
      return;
    }

    onAddCompany(newCompany);
    setNewCompany({
      name: '',
      address: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      surveyLocation: '',
      surveyStatus: 'פתוח' // Reset with default value
    });
    onOpenChange(false);
    
    toast({
      title: t('company.added'),
      description: `${newCompany.name} ${t('company.added')}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-6">
          <Building className="ml-2 h-4 w-4" />
          {t('add.new.company')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('add.new.company')}</DialogTitle>
          <DialogDescription>
            {t('add.company.details')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              {t('company.name')} *
            </Label>
            <Input
              id="name"
              name="name"
              value={newCompany.name}
              onChange={handleInputChange}
              className="col-span-3"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              {t('company.address')}
            </Label>
            <Input
              id="address"
              name="address"
              value={newCompany.address}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="surveyLocation" className="text-right">
              {t('site.location')} *
            </Label>
            <Input
              id="surveyLocation"
              name="surveyLocation"
              value={newCompany.surveyLocation}
              onChange={handleInputChange}
              className="col-span-3"
              placeholder={t('site.location')}
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contactName" className="text-right">
              {t('contact.person')}
            </Label>
            <Input
              id="contactName"
              name="contactName"
              value={newCompany.contactName}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contactPhone" className="text-right">
              {t('contact.phone')}
            </Label>
            <Input
              id="contactPhone"
              name="contactPhone"
              value={newCompany.contactPhone}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contactEmail" className="text-right">
              {t('contact.email')}
            </Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              value={newCompany.contactEmail}
              onChange={handleInputChange}
              className="col-span-3"
              type="email"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button type="submit" onClick={handleAddCompany}>
            {t('add.company')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
