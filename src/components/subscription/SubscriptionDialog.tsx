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
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: { 
          price_id: 'price_1ROE8iQHVIvC1gNSLwM7AlDd',
          mode: 'subscription',
          success_url: `${window.location.origin}/payment-success`,
          cancel_url: `${window.location.origin}/payment-canceled`
        }
      });
      
      if (error) {
        console.error("Error creating checkout session:", error);
        throw error;
      }
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error starting payment:', error);
      toast({
        title: 'שגיאה',
        description: 'נכשל בהתחלת תהליך התשלום. אנא נסה שנית.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>נדרש מנוי</DialogTitle>
          <DialogDescription>הגעת למגבלת הדוחות החינמיים שלך. שדרג למנוי כדי ליצור דוחות נוספים.</DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
            <h3 className="font-semibold text-lg mb-2">דוחות בלתי מוגבלים</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary ml-2 mt-0.5 shrink-0" />
                <span>צור דוחות בטיחות ללא הגבלה</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary ml-2 mt-0.5 shrink-0" />
                <span>ניתוח תמונה מתקדם</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary ml-2 mt-0.5 shrink-0" />
                <span>תמיכת לקוחות בעדיפות</span>
              </li>
            </ul>
            <div className="mt-4 text-center">
              <div className="text-2xl font-bold">₪39.99<span className="text-sm font-normal">/חודש</span></div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            ביטול
          </Button>
          <Button onClick={handlePayment} disabled={isLoading}>
            {isLoading ? "מעבד..." : "המשך לתשלום"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}