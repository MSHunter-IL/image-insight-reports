import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
        // Check subscription status - use maybeSingle to handle no data
        const { data: subscriptionData } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        setIsSubscribed(subscriptionData?.active === true);

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
      // קריאה לפונקציית RPC להגדלת מונה הדוחות
      const { data, error } = await supabase.rpc('increment_reports', { amount: count });
      
      if (error) {
        throw error;
      }

      // לאחר הצלחת ה-RPC, קבל את הערך המעודכן מהמסד נתונים
      const { data: updatedData, error: fetchError } = await supabase
        .from('user_report_usage')
        .select('reports_created')
        .eq('user_id', user.id)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }

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