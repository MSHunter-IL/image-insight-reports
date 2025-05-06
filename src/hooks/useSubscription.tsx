
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionDialog } from '@/components/subscription/SubscriptionDialog';

// Maximum number of free reports a user can create
const FREE_REPORTS_LIMIT = 10;

export function useSubscription() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [remainingFreeReports, setRemainingFreeReports] = useState(FREE_REPORTS_LIMIT);
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Load user's report usage and subscription status
  useEffect(() => {
    if (!user) return;
    
    const loadUserData = async () => {
      try {
        // Check for user usage data
        const { data: usageData, error: usageError } = await supabase
          .from('user_report_usage')
          .select('reports_created')
          .eq('user_id', user.id)
          .single();

        if (usageError && usageError.code !== 'PGRST116') {
          console.error('Error fetching user usage:', usageError);
          return;
        }

        // If user has usage data, calculate remaining reports
        if (usageData) {
          const reportsCreated = usageData.reports_created || 0;
          setRemainingFreeReports(Math.max(0, FREE_REPORTS_LIMIT - reportsCreated));
        } else {
          // New user, full allocation
          setRemainingFreeReports(FREE_REPORTS_LIMIT);
          
          // Create initial usage record
          await supabase
            .from('user_report_usage')
            .insert({ user_id: user.id, reports_created: 0 });
        }

        // Check if user has an active subscription
        const { data: subData } = await supabase
          .from('user_subscriptions')
          .select('active')
          .eq('user_id', user.id)
          .single();

        setIsSubscribed(subData?.active === true);
      } catch (error) {
        console.error('Error in loadUserData:', error);
      }
    };

    loadUserData();
  }, [user]);

  // Function to record report creation and update remaining count
  const handleReportCreation = async (count = 1) => {
    if (!user) return;
    
    // If user is subscribed, don't decrement counter
    if (isSubscribed) return;
    
    try {
      // Update the reports_created count
      const { data, error } = await supabase
        .from('user_report_usage')
        .update({ 
          reports_created: supabase.rpc('increment_reports', { amount: count }),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select('reports_created')
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      if (data) {
        setRemainingFreeReports(Math.max(0, FREE_REPORTS_LIMIT - data.reports_created));
      }
    } catch (error) {
      console.error('Error updating report usage:', error);
      toast({
        title: 'Error',
        description: 'Failed to update report usage. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Helper function to show the subscription dialog
  const showSubscriptionDialog = () => {
    setIsSubscriptionDialogOpen(true);
  };

  // Function called after successful subscription
  const handleSuccessfulSubscription = () => {
    setIsSubscribed(true);
    setIsSubscriptionDialogOpen(false);
    toast({
      title: 'Subscription Activated',
      description: 'You now have unlimited access to report creation!',
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
