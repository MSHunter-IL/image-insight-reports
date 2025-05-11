
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // טיפול בבקשות CORS מקדימות
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // אימות המשתמש מהבקשה
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("לא סופק טוקן אימות");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_ANON_KEY") || ""
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !userData.user) {
      throw userError || new Error("משתמש לא מזוהה");
    }

    const user = userData.user;

    // קבלת סוג המנוי מגוף הבקשה
    const { priceId = "premium_monthly" } = await req.json();

    // יצירת אובייקט Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // בדיקה האם המשתמש כבר קיים במערכת של Stripe
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      // יצירת לקוח חדש ב-Stripe
      const newCustomer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabaseUserId: user.id,
        },
      });
      customerId = newCustomer.id;
    }

    // הגדרת מחירים לפי סוג מנוי
    const prices = {
      premium_monthly: "price_1RNYx0QHVIvC1gNSMyxrWuSX", // החלף במזהה המחיר האמיתי שלך
    };

    const priceIdToUse = prices[priceId as keyof typeof prices] || prices.premium_monthly;

    // יצירת סשן Checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceIdToUse,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin") || "https://localhost:3000"}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin") || "https://localhost:3000"}/payment-canceled`,
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "שגיאה לא ידועה";
    console.error("שגיאה ביצירת סשן Checkout:", message);
    
    return new Response(
      JSON.stringify({ error: message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
