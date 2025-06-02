// src/pages/Plans.tsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { loadStripe } from "@stripe/stripe-js";

interface Plan {
  name: string;
  price: string;         // Display only
  value: string;         // e.g. "basic", "pro", "enterprise"
  features: string[];
  stripePriceId: string; // Must match the Price ID you set up in Stripe Dashboard
}

const PLANS: Plan[] = [
  {
    name: "Basic",
    price: "$75/month",
    value: "basic",
    stripePriceId: "price_1JHXXXXXbBbXXXXXa", // ← REPLACE with your actual price ID
    features: [
      "AI-generated meeting summary",
      "Automated AI meeting admin",
      "Monthly report generation"
    ],
  },
  {
    name: "Pro",
    price: "$150/month",
    value: "pro",
    stripePriceId: "price_1JHYYYYYbBbYYYYYb", // ← REPLACE
    features: [
      "Everything in Basic",
      "Unlimited meetings",
      "Priority support"
    ],
  },
  {
    name: "Enterprise",
    price: "$500/month",
    value: "enterprise",
    stripePriceId: "price_1JHZZZZZbBbZZZZZd", // ← REPLACE
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Custom integrations"
    ],
  },
];

const Plans: React.FC = () => {
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // On mount, fetch current plan for this user
  useEffect(() => {
    async function fetchPlan() {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("No logged-in user or error:", userError);
        setUserPlan(null);
        setLoading(false);
        return;
      }

      // You might store plan under "user_metadata.plan", or in a "profiles" table.
      // In this example, let's assume it's in user.user_metadata.plan
      const plan = (user.user_metadata as any)?.plan || null;
      setUserPlan(plan);
      setLoading(false);
    }
    fetchPlan();
  }, []);

  const handleChoosePlan = async (planValue: string, priceId: string) => {
    if (planValue === userPlan) {
      return; // Already on this plan—no action.
    }

    setLoading(true);

    // 1) Call your Edge Function to create a Checkout Session
    const sessionRes = await fetch(
      "https://<YOUR_EDGE_DOMAIN>/create-checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // If your Edge Function checks supabase JWT:
          Authorization: `Bearer ${supabase.auth.session()?.access_token}`,
        },
        body: JSON.stringify({
          priceId: priceId,
          plan: planValue,
        }),
      }
    );

    if (!sessionRes.ok) {
      console.error("Failed to create checkout session", await sessionRes.text());
      setLoading(false);
      return;
    }

    const { sessionId } = await sessionRes.json();

    // 2) Redirect to Stripe Checkout
    const stripe = await loadStripe("<YOUR_PUBLISHABLE_KEY>");
    if (!stripe) {
      console.error("stripe.js failed to load.");
      setLoading(false);
      return;
    }
    stripe.redirectToCheckout({ sessionId });
  };

  if (loading) {
    return <div>Loading …</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center my-8">Choose a Plan</h1>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        {PLANS.map((plan) => {
          const isCurrent = plan.value === userPlan;
          return (
            <div
              key={plan.value}
              className="bg-white rounded-xl shadow p-6 flex flex-col"
            >
              <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
              <p className="text-xl font-bold mb-4">{plan.price}</p>
              <ul className="flex-1 mb-6 list-disc pl-5 space-y-1">
                {plan.features.map((feat) => (
                  <li key={feat}>{feat}</li>
                ))}
              </ul>
              <Button
                disabled={isCurrent}
                onClick={() => handleChoosePlan(plan.value, plan.stripePriceId)}
                className="w-full mt-auto"
              >
                {isCurrent ? "Current Plan" : `Choose ${plan.name}`}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Plans;
