
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the session ID from the request
    const { session_id } = await req.json();
    
    if (!session_id) {
      return new Response(JSON.stringify({ error: "Session ID is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (!session || !session.customer) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Retrieve the customer to get their email and user ID from metadata
    const customer = await stripe.customers.retrieve(session.customer as string);
    
    if (!customer || customer.deleted) {
      return new Response(JSON.stringify({ error: "Invalid customer" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Get user ID either from customer metadata or from auth
    const email = customer.email;
    const authHeader = req.headers.get("Authorization")!;
    
    // Create a Supabase client with the service role key to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    
    // Get user details from email
    const { data: userData } = await supabaseAdmin
      .from("auth.users")
      .select("id")
      .eq("email", email)
      .single();
    
    const userId = userData?.id || customer.metadata?.user_id;
    
    if (!userId) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    // Check if the subscription is active (payment succeeded)
    let isActive = false;
    if (session.payment_status === "paid") {
      isActive = true;
    } else if (session.subscription) {
      // If there's a subscription ID, check its status
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      isActive = subscription.status === "active";
    }

    // Update the user's subscription status in Supabase
    const { data, error } = await supabaseAdmin
      .from("user_subscriptions")
      .upsert({
        user_id: userId,
        stripe_customer_id: customer.id,
        stripe_subscription_id: session.subscription as string,
        active: isActive,
        updated_at: new Date().toISOString()
      }, {
        onConflict: "user_id"
      });

    if (error) {
      console.error("Error updating subscription:", error);
      return new Response(JSON.stringify({ error: "Failed to update subscription status" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ 
      active: isActive,
      customer_id: customer.id,
      user_id: userId
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
