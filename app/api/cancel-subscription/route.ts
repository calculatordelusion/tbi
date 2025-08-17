import { stripe, isStripeAvailable } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Only create Supabase client if we have the required environment variables
const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  
  return createClient(supabaseUrl, supabaseKey);
};

export async function POST(req: Request) {
  try {
    // Check if required services are available
    if (!isStripeAvailable()) {
      return NextResponse.json(
        { error: "Stripe service not configured" }, 
        { status: 503 }
      );
    }

    const supabaseAdmin = createSupabaseClient();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database service not configured" }, 
        { status: 503 }
      );
    }

    const { subscription_id } = await req.json();
    
    // Cancel the subscription on Stripe
    if (stripe) {
      await stripe.subscriptions.cancel(subscription_id);
    }

    // Update the Supabase row
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        paid: false,
        subscription_id: null
      })
      .eq('subscription_id', subscription_id);

    if (error) {
      throw new Error(`Supabase update error: ${error.message}`);
    }

    return NextResponse.json({ message: "Subscription cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}