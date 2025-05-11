
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export default function Subscription() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isSubscribed, showSubscriptionDialog } = useSubscription();
  const [loading, setLoading] = React.useState(false);

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handlePlanSelect = async (planType: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId: planType }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('לא התקבלה כתובת תשלום');
      }
    } catch (error) {
      console.error('שגיאה בהתחלת תהליך התשלום:', error);
      toast({
        title: 'שגיאה',
        description: 'נכשל בהתחלת תהליך התשלום. אנא נסה שנית.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {});
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('לא התקבלה כתובת פורטל');
      }
    } catch (error) {
      console.error('שגיאה בפתיחת פורטל לקוחות:', error);
      toast({
        title: 'שגיאה',
        description: 'לא ניתן לפתוח את פורטל הלקוחות. אנא נסה שוב.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">{t('subscription.plans')}</h1>
      
      {isSubscribed && (
        <div className="mb-8 p-4 border border-green-500 rounded-lg bg-green-50">
          <h2 className="text-xl font-semibold text-green-700">{t('current.plan')}: {t('premium.plan')}</h2>
          <p className="mt-2">יש לך מנוי פעיל עם גישה לכל התכונות!</p>
          <Button 
            onClick={openCustomerPortal} 
            disabled={loading} 
            className="mt-4"
          >
            {loading ? "טוען..." : "נהל את המנוי שלך"}
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* תוכנית חינמית */}
        <Card className={!isSubscribed ? "border-2 border-primary" : ""}>
          <CardHeader>
            <CardTitle className="text-xl">חינמי</CardTitle>
            <CardDescription>מתאים למשתמשים מזדמנים</CardDescription>
            <div className="mt-4 text-3xl font-bold">₪0</div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary ml-2 mt-0.5 shrink-0" />
                <span>עד 10 דוחות בחינם</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary ml-2 mt-0.5 shrink-0" />
                <span>ניתוח תמונה בסיסי</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary ml-2 mt-0.5 shrink-0" />
                <span>ייצוא דוחות PDF</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              disabled={true}
            >
              התוכנית הנוכחית
            </Button>
          </CardFooter>
        </Card>

        {/* תוכנית חודשית */}
        <Card className={isSubscribed ? "border-2 border-primary" : "shadow-lg scale-105"}>
          <CardHeader>
            <CardTitle className="text-xl">מקצועי</CardTitle>
            <CardDescription>לשימוש יום-יומי</CardDescription>
            <div className="mt-4 text-3xl font-bold">₪39.99<span className="text-sm font-normal">/חודש</span></div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary ml-2 mt-0.5 shrink-0" />
                <span>דוחות בלתי מוגבלים</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary ml-2 mt-0.5 shrink-0" />
                <span>ניתוח תמונה מתקדם</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary ml-2 mt-0.5 shrink-0" />
                <span>תמיכת לקוחות מועדפת</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary ml-2 mt-0.5 shrink-0" />
                <span>שיתוף ועריכת דוחות</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => isSubscribed ? openCustomerPortal() : handlePlanSelect('premium_monthly')} 
              disabled={loading}
            >
              {loading ? "מעבד..." : isSubscribed ? "נהל מנוי" : "הירשם עכשיו"}
            </Button>
          </CardFooter>
        </Card>

        {/* תוכנית שנתית */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">ארגוני</CardTitle>
            <CardDescription>לעסקים וארגונים</CardDescription>
            <div className="mt-4 text-3xl font-bold">₪399.99<span className="text-sm font-normal">/שנה</span></div>
            <p className="text-sm text-green-600 font-medium mt-1">חיסכון של 17%</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary ml-2 mt-0.5 shrink-0" />
                <span>כל התכונות המקצועיות</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary ml-2 mt-0.5 shrink-0" />
                <span>גישת מנהל מתקדמת</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary ml-2 mt-0.5 shrink-0" />
                <span>התאמות מותאמות אישית</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary ml-2 mt-0.5 shrink-0" />
                <span>מנהל חשבון אישי</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handlePlanSelect('premium_annual')}
              disabled={loading}
            >
              {loading ? "מעבד..." : "הירשם לתוכנית שנתית"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">{t('compare.plans')}</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="p-4 text-right border">תכונות</th>
                <th className="p-4 text-center border">חינמי</th>
                <th className="p-4 text-center border">מקצועי</th>
                <th className="p-4 text-center border">ארגוני</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border">מספר דוחות</td>
                <td className="p-4 text-center border">10</td>
                <td className="p-4 text-center border">בלתי מוגבל</td>
                <td className="p-4 text-center border">בלתי מוגבל</td>
              </tr>
              <tr>
                <td className="p-4 border">ניתוח תמונה</td>
                <td className="p-4 text-center border">בסיסי</td>
                <td className="p-4 text-center border">מתקדם</td>
                <td className="p-4 text-center border">מתקדם</td>
              </tr>
              <tr>
                <td className="p-4 border">תמיכת לקוחות</td>
                <td className="p-4 text-center border">אימייל</td>
                <td className="p-4 text-center border">מועדף</td>
                <td className="p-4 text-center border">24/7</td>
              </tr>
              <tr>
                <td className="p-4 border">שיתוף דוחות</td>
                <td className="p-4 text-center border">לא</td>
                <td className="p-4 text-center border">כן</td>
                <td className="p-4 text-center border">כן</td>
              </tr>
              <tr>
                <td className="p-4 border">הרשאות מנהל</td>
                <td className="p-4 text-center border">לא</td>
                <td className="p-4 text-center border">בסיסי</td>
                <td className="p-4 text-center border">מלא</td>
              </tr>
              <tr>
                <td className="p-4 border">API גישה</td>
                <td className="p-4 text-center border">לא</td>
                <td className="p-4 text-center border">לא</td>
                <td className="p-4 text-center border">כן</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
