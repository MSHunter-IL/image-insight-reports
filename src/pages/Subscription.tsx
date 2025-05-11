
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

export default function Subscription() {
  const { user } = useAuth();
  const { isSubscribed } = useSubscription();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const startCheckout = async (priceId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('לא התקבלה כתובת תשלום');
      }
    } catch (err) {
      console.error('שגיאה בהתחלת תהליך התשלום:', err);
      toast({
        title: 'שגיאה',
        description: 'נכשל בהתחלת תהליך התשלום. אנא נסה שנית.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">תוכניות מנוי</h1>
        <p className="text-muted-foreground">בחר את התוכנית המתאימה לך</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* תוכנית חינמית */}
        <Card className={`border ${!isSubscribed ? 'border-primary' : ''}`}>
          <CardHeader>
            {!isSubscribed && (
              <div className="bg-primary text-primary-foreground text-sm font-medium py-1 px-3 rounded-full w-fit mb-2">
                התוכנית הנוכחית
              </div>
            )}
            <CardTitle>חינם</CardTitle>
            <div className="text-3xl font-bold">₪0<span className="text-sm font-normal text-muted-foreground"> / לחודש</span></div>
            <CardDescription>התחל ליצור דוחות בטיחות בקלות</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary ml-2 mt-0.5 shrink-0" />
                <span>עד 10 דוחות בחודש</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary ml-2 mt-0.5 shrink-0" />
                <span>ניתוח תמונות בסיסי</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary ml-2 mt-0.5 shrink-0" />
                <span>ייצוא דוחות בפורמט בסיסי</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" disabled className="w-full">
              התוכנית הנוכחית
            </Button>
          </CardFooter>
        </Card>

        {/* תוכנית פרימיום */}
        <Card className={`border ${isSubscribed ? 'border-primary' : ''}`}>
          <CardHeader>
            {isSubscribed && (
              <div className="bg-primary text-primary-foreground text-sm font-medium py-1 px-3 rounded-full w-fit mb-2">
                התוכנית הנוכחית
              </div>
            )}
            <CardTitle>פרימיום</CardTitle>
            <div className="text-3xl font-bold">₪39.99<span className="text-sm font-normal text-muted-foreground"> / לחודש</span></div>
            <CardDescription>כל מה שצריך לדוחות בטיחות מקצועיים</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary ml-2 mt-0.5 shrink-0" />
                <span>דוחות ללא הגבלה</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary ml-2 mt-0.5 shrink-0" />
                <span>ניתוח תמונות מתקדם</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary ml-2 mt-0.5 shrink-0" />
                <span>ייצוא דוחות בכל הפורמטים</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary ml-2 mt-0.5 shrink-0" />
                <span>תמיכת לקוחות מועדפת</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary ml-2 mt-0.5 shrink-0" />
                <span>סיכומים וניתוחים מתקדמים</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {isSubscribed ? (
              <Button variant="outline" disabled className="w-full">
                המנוי שלך פעיל
              </Button>
            ) : (
              <Button 
                onClick={() => startCheckout('premium_monthly')} 
                disabled={loading || !user} 
                className="w-full"
              >
                {loading ? "מעבד..." : "הירשם עכשיו"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Link to="/">
          <Button variant="outline">חזרה לדף הראשי</Button>
        </Link>
      </div>
    </div>
  );
}
