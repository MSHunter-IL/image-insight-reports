
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ReportEntry, UrgencyLevel, StatusType } from '@/types/report';
import { useToast } from '@/components/ui/use-toast';

interface ReportContextType {
  entries: ReportEntry[];
  addEntry: (entry: Omit<ReportEntry, 'id' | 'timestamp' | 'version'>) => void;
  updateEntry: (id: string, updates: Partial<ReportEntry>) => void;
  deleteEntry: (id: string) => void;
  clearAllEntries: () => void;
  updateInternalNotes: (id: string, notes: string) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export function ReportProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<ReportEntry[]>([]);
  const { toast } = useToast();

  // Load from localStorage on init
  useEffect(() => {
    const savedEntries = localStorage.getItem('reportEntries');
    if (savedEntries) {
      try {
        const parsed = JSON.parse(savedEntries);
        // Convert string dates back to Date objects
        const fixedEntries = parsed.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
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
        entry.timestamp < sevenDaysAgo
      );
      
      if (openOldEntries.length > 0) {
        toast({
          title: "תזכורת",
          description: `יש ${openOldEntries.length} סקרים פתוחים מעל 7 ימים`,
        });
      }
    };
    
    // Check on load and set up daily check
    checkOldEntries();
    const interval = setInterval(checkOldEntries, 24 * 60 * 60 * 1000); // Check daily
    
    return () => clearInterval(interval);
  }, [entries, toast]);

  const addEntry = (entry: Omit<ReportEntry, 'id' | 'timestamp' | 'version'>) => {
    const newEntry: ReportEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      version: 1
    };
    
    setEntries(prev => [...prev, newEntry]);
    toast({
      title: "נוסף לדוח",
      description: `ממצא חדש: ${entry.topic}`,
    });
  };

  const updateEntry = (id: string, updates: Partial<ReportEntry>) => {
    setEntries(prev => 
      prev.map(entry => 
        entry.id === id 
          ? { 
              ...entry, 
              ...updates,
              version: (entry.version || 1) + 1 // Increment version
            } 
          : entry
      )
    );
    toast({
      title: "עודכן בהצלחה",
      description: "הפריט עודכן בדוח",
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
      title: "הוסר מהדוח",
      description: "הפריט הוסר בהצלחה",
    });
  };

  const clearAllEntries = () => {
    setEntries([]);
    localStorage.removeItem('reportEntries');
    toast({
      title: "הדוח נוקה",
      description: "כל הפריטים הוסרו מהדוח",
    });
  };

  return (
    <ReportContext.Provider value={{ 
      entries, 
      addEntry, 
      updateEntry, 
      deleteEntry,
      clearAllEntries,
      updateInternalNotes
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
