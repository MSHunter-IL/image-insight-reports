
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CompanyDetails } from '@/types/report';

interface CompanyContextType {
  companies: CompanyDetails[];
  selectedCompany: CompanyDetails | null;
  addCompany: (company: Omit<CompanyDetails, 'id'>) => void;
  updateCompany: (id: string, updates: Partial<CompanyDetails>) => void;
  deleteCompany: (id: string) => void;
  selectCompany: (id: string) => void;
  getCompanyById: (id: string) => CompanyDetails | undefined;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Sample companies for initial data
const sampleCompanies: CompanyDetails[] = [
  {
    id: '1',
    name: 'חברת הבנייה א.ב.',
    address: 'רחוב האלון 15, תל אביב',
    contactName: 'ישראל ישראלי',
    contactPhone: '050-1234567',
    contactEmail: 'israel@company-a.co.il',
    surveyLocation: 'אתר בנייה - רמת גן'
  },
  {
    id: '2',
    name: 'תעשיות מתכת בע"מ',
    address: 'אזור תעשייה, חיפה',
    contactName: 'רונית כהן',
    contactPhone: '052-7654321',
    contactEmail: 'ronit@metal-industries.co.il',
    surveyLocation: 'מפעל ראשי - חיפה'
  },
  {
    id: '3',
    name: 'מוסך האחים לוי',
    address: 'דרך יפו 42, ירושלים',
    contactName: 'דוד לוי',
    contactPhone: '053-9876543',
    contactEmail: 'david@levi-garage.co.il',
    surveyLocation: 'סניף ירושלים'
  }
];

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<CompanyDetails[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyDetails | null>(null);

  // Load from localStorage on init
  useEffect(() => {
    const savedCompanies = localStorage.getItem('companies');
    if (savedCompanies) {
      try {
        const parsed = JSON.parse(savedCompanies);
        setCompanies(parsed);
        
        // Set first company as selected if available
        if (parsed.length > 0) {
          setSelectedCompany(parsed[0]);
        }
      } catch (error) {
        console.error('Error loading saved companies:', error);
        // Initialize with sample companies if error
        setCompanies(sampleCompanies);
        setSelectedCompany(sampleCompanies[0]);
      }
    } else {
      // Initialize with sample companies if none saved
      setCompanies(sampleCompanies);
      setSelectedCompany(sampleCompanies[0]);
    }
  }, []);

  // Save to localStorage when companies change
  useEffect(() => {
    if (companies.length > 0) {
      localStorage.setItem('companies', JSON.stringify(companies));
    }
  }, [companies]);

  const addCompany = (company: Omit<CompanyDetails, 'id'>) => {
    const newCompany: CompanyDetails = {
      ...company,
      id: crypto.randomUUID()
    };
    
    setCompanies(prev => [...prev, newCompany]);
    
    // Auto-select newly added company
    setSelectedCompany(newCompany);
  };

  const updateCompany = (id: string, updates: Partial<CompanyDetails>) => {
    setCompanies(prev => 
      prev.map(company => 
        company.id === id 
          ? { ...company, ...updates } 
          : company
      )
    );
    
    // Update selected company if it's the one being updated
    if (selectedCompany && selectedCompany.id === id) {
      setSelectedCompany(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteCompany = (id: string) => {
    setCompanies(prev => prev.filter(company => company.id !== id));
    
    // If deleted company was selected, select first available company
    if (selectedCompany && selectedCompany.id === id) {
      setCompanies(prev => {
        if (prev.length > 0 && prev[0].id !== id) {
          setSelectedCompany(prev[0]);
        } else if (prev.length > 1) {
          setSelectedCompany(prev.find(c => c.id !== id) || null);
        } else {
          setSelectedCompany(null);
        }
        return prev;
      });
    }
  };

  const selectCompany = (id: string) => {
    const company = companies.find(c => c.id === id);
    if (company) {
      setSelectedCompany(company);
    }
  };

  const getCompanyById = (id: string) => {
    return companies.find(c => c.id === id);
  };

  return (
    <CompanyContext.Provider value={{ 
      companies, 
      selectedCompany, 
      addCompany, 
      updateCompany, 
      deleteCompany,
      selectCompany,
      getCompanyById
    }}>
      {children}
    </CompanyContext.Provider>
  );
}

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
