
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
    console.log("התחלת פונקציית verify-subscription");
    const { session_id } = await req.json();

    if (!session_id) {
      throw new Error("לא סופק מזהה סשן");
    }
    
    console.log("מזהה סשן שהתקבל:", session_id);

    // בדיקת מפתח סודי של Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("מפתח Stripe לא מוגדר");
      throw new Error("מפתח Stripe לא מוגדר");
    }

    // יצירת לקוח Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // אחזור הסשן מ-Stripe
    console.log("מבקש פרטי סשן מ-Stripe");
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log("פרטי סשן התקבלו:", { 
      payment_status: session.payment_status,
      customer: session.customer,
      customer_email: session.customer_details?.email,
      subscription: session.subscription
    });

    // אימות שהסשן הושלם בהצלחה
    if (session.payment_status !== "paid") {
      console.log("תשלום לא הושלם, סטטוס:", session.payment_status);
      throw new Error("התשלום לא הושלם");
    }

    // גישה ל-Supabase עם מפתח שירות
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("פרטי התחברות ל-Supabase חסרים");
      throw new Error("פרטי התחברות ל-Supabase חסרים");
    }
    
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceKey,
      { auth: { persistSession: false } }
    );

    // אחזור משתמש לפי אימייל
    let userId;
    if (session.customer_details?.email) {
      console.log("מחפש משתמש לפי אימייל:", session.customer_details.email);
      const { data: userData, error: userError } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", session.customer_details.email)
        .single();
      
      if (userError) {
        console.log("שגיאה בחיפוש המשתמש:", userError);
        
        // ננסה לחפש בטבלת המשתמשים של Supabase
        const { data: authUser } = await supabaseAdmin
          .auth
          .admin
          .listUsers();
        
        const foundUser = authUser.users.find(u => u.email === session.customer_details?.email);
        if (foundUser) {
          userId = foundUser.id;
          console.log("נמצא משתמש בטבלת auth:", userId);
        }
      } else {
        userId = userData?.id;
        console.log("נמצא משתמש בטבלה המותאמת אישית:", userId);
      }
    }

    if (!userId) {
      console.error("לא נמצא משתמש עם האימייל המתאים");
      throw new Error("לא ניתן למצוא את המשתמש");
    }

    // עדכון מצב המנוי בטבלת המנויים
    console.log("מעדכן נתוני מנוי למשתמש:", userId);
    await supabaseAdmin
      .from("user_subscriptions")
      .upsert({
        user_id: userId,
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
        active: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    console.log("עדכון המנוי הושלם בהצלחה");

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
