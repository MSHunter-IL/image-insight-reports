
-- Create table for tracking user report usage
CREATE TABLE IF NOT EXISTS public.user_report_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  reports_created INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add RLS to user_report_usage table
ALTER TABLE public.user_report_usage ENABLE ROW LEVEL SECURITY;

-- Allow users to read only their own usage data
CREATE POLICY "Users can view their own usage" 
  ON public.user_report_usage
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow edge functions to insert/update usage data
CREATE POLICY "Service can manage all usage data" 
  ON public.user_report_usage
  USING (true);

-- Create table for tracking user subscriptions
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add RLS to user_subscriptions table
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow users to read only their own subscription data
CREATE POLICY "Users can view their own subscriptions" 
  ON public.user_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow edge functions to insert/update subscription data
CREATE POLICY "Service can manage all subscription data" 
  ON public.user_subscriptions
  USING (true);

-- Create function to increment report count
CREATE OR REPLACE FUNCTION public.increment_reports(amount INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN reports_created + amount;
END;
$$;
