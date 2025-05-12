
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
  
  try {
    // Parse the request body
    const { session_id } = await req.json();
    
    if (!session_id) {
      return new Response(
        JSON.stringify({
          error: "Session ID is required"
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });
    
    console.log("Verifying session:", session_id);
    
    // Retrieve the session
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (!session) {
      return new Response(
        JSON.stringify({ error: "Session not found" }),
        { 
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    console.log("Session retrieved:", JSON.stringify(session, null, 2));
    
    // Check if session is paid
    if (session.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "תשלום לא אושר", 
          session: session 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    // Get Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );
    
    // Get the customer
    const customerId = session.customer as string;
    const customerEmail = session.customer_details?.email;
    
    console.log("Customer ID:", customerId);
    console.log("Customer email:", customerEmail);
    
    // Find the user by email
    let userId: string | undefined;
    
    if (customerEmail) {
      console.log("Looking up user by email:", customerEmail);
      const { data: user, error: userError } = await supabaseClient
        .from("auth")
        .table("users")
        .select("id")
        .eq("email", customerEmail)
        .single();
        
      if (userError) {
        console.error("Error finding user:", userError.message);
      } else if (user) {
        userId = user.id;
        console.log("Found user:", userId);
      }
    }
    
    // If we have a user ID and customer ID, save the subscription
    if (userId) {
      console.log("Updating subscription for user:", userId);
      
      // Update or create the subscription for the user
      const { error: subError } = await supabaseClient
        .from("user_subscriptions")
        .upsert({
          user_id: userId,
          active: true,
          stripe_customer_id: customerId,
          stripe_subscription_id: session.subscription as string,
          updated_at: new Date().toISOString(),
        });
      
      if (subError) {
        console.error("Error updating subscription:", subError.message);
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: "שגיאה בעדכון המנוי", 
            error: subError.message 
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      
      console.log("Subscription updated successfully");
      
      // Return success response
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "המנוי הופעל בהצלחה",
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    } else {
      console.log("No user found for email:", customerEmail);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "לא נמצא משתמש מתאים",
          customerEmail: customerEmail
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error.message);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "שגיאה באימות התשלום", 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
