
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Site } from '@/types/site';

interface SiteContextType {
  sites: Site[];
  addSite: (site: Site) => void;
  updateSite: (site: Site) => void;
  deleteSite: (id: string) => void;
  getSiteById: (id: string) => Site | undefined;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [sites, setSites] = useState<Site[]>(() => {
    const savedSites = localStorage.getItem('sites');
    return savedSites ? JSON.parse(savedSites) : [];
  });

  useEffect(() => {
    localStorage.setItem('sites', JSON.stringify(sites));
  }, [sites]);

  const addSite = (site: Site) => {
    setSites(prev => [...prev, site]);
  };

  const updateSite = (updatedSite: Site) => {
    setSites(prev => prev.map(site => 
      site.id === updatedSite.id ? updatedSite : site
    ));
  };

  const deleteSite = (id: string) => {
    setSites(prev => prev.filter(site => site.id !== id));
  };

  const getSiteById = (id: string) => {
    return sites.find(site => site.id === id);
  };

  return (
    <SiteContext.Provider value={{ sites, addSite, updateSite, deleteSite, getSiteById }}>
      {children}
    </SiteContext.Provider>
  );
}

export const useSites = () => {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSites must be used within a SiteProvider');
  }
  return context;
};
