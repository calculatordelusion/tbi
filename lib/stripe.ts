import Stripe from "stripe";

// Only create Stripe client if we have the required environment variable
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-10-28.acacia"
    })
  : null;

// Helper function to check if Stripe is available
export const isStripeAvailable = () => {
  return !!process.env.STRIPE_SECRET_KEY && !!stripe;
};