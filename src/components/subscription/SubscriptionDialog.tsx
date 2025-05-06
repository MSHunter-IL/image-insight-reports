
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface SubscriptionDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubscribeSuccess: () => void;
}

export function SubscriptionDialog({ isOpen, setIsOpen, onSubscribeSuccess }: SubscriptionDialogProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId: 'premium_subscription' }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error starting checkout:', error);
      toast({
        title: language === 'en' ? 'Error' : 'שגיאה',
        description: language === 'en' 
          ? 'Failed to start checkout process. Please try again.'
          : 'נכשל בהתחלת תהליך התשלום. אנא נסה שנית.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('subscription.required')}</DialogTitle>
          <DialogDescription>{t('subscription.description')}</DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
            <h3 className="font-semibold text-lg mb-2">{t('unlimited.reports')}</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                <span>{language === 'en' 
                  ? 'Create unlimited safety reports'
                  : 'צור דוחות בטיחות ללא הגבלה'
                }</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                <span>{language === 'en'
                  ? 'Advanced image analysis'
                  : 'ניתוח תמונה מתקדם'
                }</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                <span>{language === 'en'
                  ? 'Priority customer support'
                  : 'תמיכת לקוחות בעדיפות'
                }</span>
              </li>
            </ul>
            <div className="mt-4 text-center">
              <div className="text-2xl font-bold">$9.99<span className="text-sm font-normal">/month</span></div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {language === 'en' ? 'Cancel' : 'ביטול'}
          </Button>
          <Button onClick={handlePayment} disabled={isLoading}>
            {isLoading 
              ? (language === 'en' ? 'Processing...' : 'מעבד...') 
              : t('proceed.to.payment')
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
