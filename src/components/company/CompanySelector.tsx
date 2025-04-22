
import React from 'react';
import { useCompany } from '@/context/CompanyContext';
import { Button } from '@/components/ui/button';
import { Building } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from '@/components/ui/use-toast';

export function CompanySelector() {
  const { companies, selectedCompany, selectCompany, addCompany } = useCompany();
  const { toast } = useToast();
  const [newCompany, setNewCompany] = React.useState({
    name: '',
    address: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    surveyLocation: ''
  });
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleSelectChange = (companyId: string) => {
    selectCompany(companyId);
    toast({
      title: "חברה נבחרה",
      description: `${companies.find(c => c.id === companyId)?.name} נבחרה בהצלחה`,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCompany(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCompany = () => {
    if (!newCompany.name) {
      toast({
        title: "שגיאה",
        description: "נא למלא לפחות את שם החברה",
        variant: "destructive"
      });
      return;
    }

    addCompany(newCompany);
    setNewCompany({
      name: '',
      address: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      surveyLocation: ''
    });
    setDialogOpen(false);
    
    toast({
      title: "חברה חדשה נוספה",
      description: `${newCompany.name} נוספה בהצלחה ונבחרה`,
    });
  };

  return (
    <div className="flex items-center space-x-2 mb-6 flex-wrap gap-2">
      <div className="flex-1">
        <Label htmlFor="company-select" className="block mb-2">בחר חברה</Label>
        <Select value={selectedCompany?.id} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="בחר חברה" />
          </SelectTrigger>
          <SelectContent>
            {companies.map(company => (
              <SelectItem key={company.id} value={company.id}>
                {company.name} - {company.surveyLocation || 'ללא אתר'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-6">
            <Building className="ml-2 h-4 w-4" />
            הוסף חברה חדשה
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>הוסף חברה חדשה</DialogTitle>
            <DialogDescription>
              הוסף את פרטי החברה החדשה. שדות מסומנים בכוכבית (*) הם שדות חובה.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                שם חברה *
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
                כתובת
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
                אתר *
              </Label>
              <Input
                id="surveyLocation"
                name="surveyLocation"
                value={newCompany.surveyLocation}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="מיקום האתר"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contactName" className="text-right">
                איש קשר
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
                טלפון
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
                אימייל
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
              הוסף חברה
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
