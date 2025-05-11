
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ReportEntry, UrgencyLevel, StatusType } from '@/types/report';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/context/LanguageContext';

interface ReportContextType {
  entries: ReportEntry[];
  addEntry: (entry: Omit<ReportEntry, 'id' | 'timestamp' | 'version'>) => void;
  updateEntry: (id: string, updates: Partial<ReportEntry>) => void;
  deleteEntry: (id: string) => void;
  clearAllEntries: () => void;
  updateInternalNotes: (id: string, notes: string) => void;
  markAllAsTreated: () => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export function ReportProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<ReportEntry[]>([]);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Load from localStorage on init
  useEffect(() => {
    const savedEntries = localStorage.getItem('reportEntries');
    if (savedEntries) {
      try {
        const parsed = JSON.parse(savedEntries);
        // Convert string dates back to Date objects
        const fixedEntries = parsed.map((entry: any) => ({
          ...entry,
          timestamp: entry.timestamp ? new Date(entry.timestamp) : new Date()
        }));
        setEntries(fixedEntries);
      } catch (error) {
        console.error('Error loading saved entries:', error);
      }
    }
  }, []);

  // Save to localStorage when entries change
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('reportEntries', JSON.stringify(entries));
    }
  }, [entries]);

  // Check for reports open for more than 7 days
  useEffect(() => {
    const checkOldEntries = () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const openOldEntries = entries.filter(entry => 
        entry.status === 'טרם טופל' && 
        entry.timestamp && entry.timestamp < sevenDaysAgo
      );
      
      if (openOldEntries.length > 0) {
        toast({
          title: t("reminder"),
          description: `${t("open.reports.msg")} ${openOldEntries.length} ${t("open.reports")}`,
        });
      }
    };
    
    // Check on load and set up daily check
    checkOldEntries();
    const interval = setInterval(checkOldEntries, 24 * 60 * 60 * 1000); // Check daily
    
    return () => clearInterval(interval);
  }, [entries, toast, t]);

  const addEntry = (entry: Omit<ReportEntry, 'id' | 'timestamp' | 'version'>) => {
    const newEntry: ReportEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      version: 1
    };
    
    setEntries(prev => [...prev, newEntry]);
    toast({
      title: t("item.added"),
      description: `${t("new.finding")}: ${entry.topic}`,
    });
  };

  const updateEntry = (id: string, updates: Partial<ReportEntry>) => {
    setEntries(prev => 
      prev.map(entry => 
        entry.id === id 
          ? { 
              ...entry, 
              ...updates,
              version: ((entry.version || 1) + 1) // Increment version
            } 
          : entry
      )
    );
    toast({
      title: t("item.updated"),
      description: t("item.updated.msg"),
    });
  };

  const updateInternalNotes = (id: string, notes: string) => {
    setEntries(prev => 
      prev.map(entry => 
        entry.id === id 
          ? { ...entry, internalNotes: notes } 
          : entry
      )
    );
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    toast({
      title: t("item.removed"),
      description: t("item.removed.msg"),
    });
  };

  const clearAllEntries = () => {
    setEntries([]);
    localStorage.removeItem('reportEntries');
    toast({
      title: t("report.cleared"),
      description: t("all.items.removed"),
    });
  };
  
  // Function to mark all entries as treated
  const markAllAsTreated = () => {
    if (entries.length === 0) return;
    
    setEntries(prev => 
      prev.map(entry => ({ 
        ...entry, 
        status: 'טופל' as StatusType,
        version: ((entry.version || 1) + 1)
      }))
    );

    toast({
      title: t("success"),
      description: t("all.items.marked.as.treated"),
    });
  };

  return (
    <ReportContext.Provider value={{ 
      entries, 
      addEntry, 
      updateEntry, 
      deleteEntry,
      clearAllEntries,
      updateInternalNotes,
      markAllAsTreated
    }}>
      {children}
    </ReportContext.Provider>
  );
}

export const useReport = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReport must be used within a ReportProvider');
  }
  return context;
};
