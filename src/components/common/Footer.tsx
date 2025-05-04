
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-4 text-center text-sm text-muted-foreground mt-8 border-t">
      <p>© {currentYear} • {t('copyright')}</p>
    </footer>
  );
}
