
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
    const { session_id } = await req.json();

    if (!session_id) {
      throw new Error("לא סופק מזהה סשן");
    }

    // יצירת לקוח Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // אחזור הסשן מ-Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // אימות שהסשן הושלם בהצלחה
    if (session.payment_status !== "paid") {
      throw new Error("התשלום לא הושלם");
    }

    // גישה ל-Supabase עם מפתח שירות
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      { auth: { persistSession: false } }
    );

    // אחזור משתמש לפי אימייל
    let userId;
    if (session.customer_details?.email) {
      const { data: userData } = await supabaseAdmin
        .from("auth.users")
        .select("id")
        .eq("email", session.customer_details.email)
        .single();
      
      userId = userData?.id;
    }

    if (!userId) {
      throw new Error("לא ניתן למצוא את המשתמש");
    }

    // עדכון מצב המנוי בטבלת המנויים
    await supabaseAdmin
      .from("user_subscriptions")
      .upsert({
        user_id: userId,
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
        active: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "שגיאה לא ידועה";
    console.error("שגיאה באימות המנוי:", message);
    
    return new Response(
      JSON.stringify({ error: message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
