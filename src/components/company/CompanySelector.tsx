
import React from 'react';
import { useCompany } from '@/context/CompanyContext';
import { Building } from 'lucide-react';
import { SelectCompanyDropdown } from './company-selector/SelectCompanyDropdown';
import { AddCompanyDialog } from './company-selector/AddCompanyDialog';
import { CompanyFormData } from '@/types/report';

export function CompanySelector() {
  const { companies, selectedCompany, selectCompany, addCompany } = useCompany();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleAddCompany = (company: CompanyFormData) => {
    // Convert CompanyFormData to the expected format for addCompany
    addCompany({
      ...company,
      surveyStatus: company.surveyStatus || 'פתוח'
    });
  };

  return (
    <div className="flex items-center space-x-2 mb-6 flex-wrap gap-2">
      <SelectCompanyDropdown 
        companies={companies} 
        selectedCompany={selectedCompany} 
        onSelect={selectCompany} 
      />
      
      <AddCompanyDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onAddCompany={handleAddCompany}
      />
    </div>
  );
}
