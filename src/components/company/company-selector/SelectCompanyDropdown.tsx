
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { CompanyDetails } from '@/types/report';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SelectCompanyDropdownProps {
  companies: CompanyDetails[];
  selectedCompany: CompanyDetails | null;
  onSelect: (companyId: string) => void;
}

export function SelectCompanyDropdown({ 
  companies, 
  selectedCompany, 
  onSelect 
}: SelectCompanyDropdownProps) {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleSelectChange = (companyId: string) => {
    onSelect(companyId);
    toast({
      title: t('company.selected'),
      description: `${companies.find(c => c.id === companyId)?.name} ${t('company.selected')}`,
    });
  };

  return (
    <div className="flex-1">
      <Label htmlFor="company-select" className="block mb-2">{t('select.company')}</Label>
      <Select value={selectedCompany?.id} onValueChange={handleSelectChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t('select.company')} />
        </SelectTrigger>
        <SelectContent>
          {companies.map(company => (
            <SelectItem key={company.id} value={company.id}>
              {company.name} - {company.surveyLocation || t('not.specified')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
