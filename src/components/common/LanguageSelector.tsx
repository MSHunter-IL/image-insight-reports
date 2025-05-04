
import React from 'react';
import { useLanguage, SupportedLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Translate } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: SupportedLanguage; name: string }[] = [
    { code: 'en', name: t('english') },
    { code: 'he', name: t('hebrew') },
    { code: 'es', name: t('spanish') },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Translate className="h-4 w-4 mr-2" />
          {t('language')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={language === lang.code ? "bg-accent" : ""}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
