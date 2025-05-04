
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-6 mt-8 border-t">
      <div className="container">
        <div className="text-center text-sm text-muted-foreground">
          &copy; {currentYear} {t('copyright')}
        </div>
      </div>
    </footer>
  );
};
