
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionDialog } from '@/components/subscription/SubscriptionDialog';

// מספר הדוחות המקסימלי שמשתמש יכול ליצור בחינם
const FREE_REPORTS_LIMIT = 10;

export function useSubscription() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [remainingFreeReports, setRemainingFreeReports] = useState(FREE_REPORTS_LIMIT);
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // טעינת נתוני המשתמש ומצב המנוי
  useEffect(() => {
    if (!user) return;
    
    const loadUserData = async () => {
      try {
        // בדיקת נתוני שימוש למשתמש
        const { data: usageData, error: usageError } = await supabase
          .from('user_report_usage')
          .select('reports_created')
          .eq('user_id', user.id)
          .single();

        if (usageError && usageError.code !== 'PGRST116') {
          console.error('שגיאה בטעינת נתוני משתמש:', usageError);
          return;
        }

        // אם יש נתוני שימוש למשתמש, חשב את מספר הדוחות שנותרו
        if (usageData) {
          const reportsCreated = usageData.reports_created || 0;
          setRemainingFreeReports(Math.max(0, FREE_REPORTS_LIMIT - reportsCreated));
        } else {
          // משתמש חדש, הקצאה מלאה
          setRemainingFreeReports(FREE_REPORTS_LIMIT);
          
          // יצירת רשומת שימוש התחלתית
          await supabase
            .from('user_report_usage')
            .insert({ user_id: user.id, reports_created: 0 });
        }

        // בדיקה אם למשתמש יש מנוי פעיל
        const { data: subData } = await supabase
          .from('user_subscriptions')
          .select('active')
          .eq('user_id', user.id)
          .single();

        setIsSubscribed(subData?.active === true);
      } catch (error) {
        console.error('שגיאה בטעינת נתוני משתמש:', error);
      }
    };

    loadUserData();
  }, [user]);

  // פונקציה לרישום יצירת דוח ועדכון מספר הדוחות שנותרו
  const handleReportCreation = async (count = 1) => {
    if (!user) return;
    
    // אם המשתמש מנוי, אל תפחית את המונה
    if (isSubscribed) return;
    
    try {
      // Fix: Use await to properly get the data and then extract reports_created value
      const { error } = await supabase
        .from('user_report_usage')
        .update({ 
          // Fix: Don't directly assign the query result to a number
          reports_created: supabase.rpc('increment_reports', { amount: count }),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // נקבל את המספר העדכני של דוחות
      const { data: updatedData } = await supabase
        .from('user_report_usage')
        .select('reports_created')
        .eq('user_id', user.id)
        .single();

      if (updatedData) {
        // עדכון מצב מקומי
        const updatedReportsCount = updatedData.reports_created || 0;
        setRemainingFreeReports(Math.max(0, FREE_REPORTS_LIMIT - updatedReportsCount));
      }
    } catch (error) {
      console.error('שגיאה בעדכון נתוני שימוש:', error);
      toast({
        title: 'שגיאה',
        description: 'נכשל בעדכון נתוני שימוש. אנא נסה שוב.',
        variant: 'destructive'
      });
    }
  };

  // פונקציית עזר להצגת דיאלוג המנוי
  const showSubscriptionDialog = () => {
    setIsSubscriptionDialogOpen(true);
  };

  // פונקציה שנקראת לאחר הצטרפות מוצלחת למנוי
  const handleSuccessfulSubscription = () => {
    setIsSubscribed(true);
    setIsSubscriptionDialogOpen(false);
    toast({
      title: 'המנוי הופעל',
      description: 'יש לך כעת גישה בלתי מוגבלת ליצירת דוחות!',
      variant: 'default'
    });
  };

  return {
    remainingFreeReports,
    isSubscribed,
    handleReportCreation,
    showSubscriptionDialog,
    isSubscriptionDialogOpen,
    setIsSubscriptionDialogOpen,
    handleSuccessfulSubscription,
  };
}
