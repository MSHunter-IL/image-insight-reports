
// Follow Deno's ES modules, import from URLs or other modules
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@13.2.0";

// Define CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Function handler that processes the request
serve(async (req) => {
  // Handle OPTIONS request for CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Get authentication token from request header
  const authHeader = req.headers.get("Authorization");
  
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "חסר אישור, אנא התחבר למערכת" }),
      { 
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
  
  try {
    // Get Supabase client to get the authenticated user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_ANON_KEY") || ""
    );
    
    // Get user from token
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      console.error("Error getting authenticated user:", userError?.message);
      return new Response(
        JSON.stringify({ error: "אירעה שגיאה בעת הרשאת המשתמש" }),
        { 
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    const user = userData.user;
    console.log("Authenticated user:", user.email);
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });
    
    // Create or get Stripe customer for this user
    let customerId: string | undefined;
    
    // First, try to find customer in our database
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );
    
    const { data: subscriptionData } = await supabaseAdmin
      .from("user_subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();
      
    if (subscriptionData?.stripe_customer_id) {
      customerId = subscriptionData.stripe_customer_id;
      console.log("Found existing customer ID:", customerId);
    } else {
      // If not found in our DB, try to find by email in Stripe
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1,
      });
      
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        console.log("Found customer in Stripe:", customerId);
      } else {
        // Create new customer
        const newCustomer = await stripe.customers.create({
          email: user.email,
          name: user.user_metadata?.full_name || "",
          metadata: {
            user_id: user.id,
          },
        });
        
        customerId = newCustomer.id;
        console.log("Created new customer:", customerId);
      }
    }
    
    // Determine price ID for the subscription
    const priceId = "price_ID"; // Replace with your actual Stripe price ID
    
    // Create checkout session
    console.log("Creating checkout session for customer:", customerId);
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${req.headers.get("origin") || "https://image-insight-reports.lovable.app"}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin") || "https://image-insight-reports.lovable.app"}/payment-canceled`,
      metadata: {
        user_id: user.id,
      },
    });
    
    console.log("Created checkout session:", session.id);
    
    // Store session information
    await supabaseAdmin
      .from("user_subscriptions")
      .upsert({
        user_id: user.id,
        stripe_customer_id: customerId,
        updated_at: new Date().toISOString(),
      });
    
    // Return session URL
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
    
  } catch (error) {
    console.error("Error processing request:", error.message);
    return new Response(
      JSON.stringify({ error: `שגיאה ביצירת התשלום: ${error.message}` }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
