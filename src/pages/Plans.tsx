import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import CRMHeader from '@/components/crm/CRMHeader';
import { ArrowLeft } from 'lucide-react'; //

const plans = [
  {
    name: 'Basic',
    price: 'Free',
    features: ['1 User', 'Basic Support', 'Limited AI Access'],
    button: 'Choose Basic',
  },
  {
    name: 'Lite',
    price: '$9/month',
    features: ['Up to 3 Users', 'Priority Support', 'Moderate AI Access'],
    button: 'Choose Lite',
  },
  {
    name: 'Pro',
    price: '$19/month',
    features: ['Unlimited Users', '24/7 Support', 'Full AI Access'],
    button: 'Choose Pro',
  },
];

const Plans: React.FC = () => {
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPlan = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user && user.user_metadata?.plan) {
        setCurrentPlan(user.user_metadata.plan);
      }
    };

    fetchUserPlan();
  }, []);

  const handleChoose = async (plan: string) => {
    if (plan === currentPlan) return;

    if (plan === 'basic') {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.auth.updateUser({
        data: { plan: 'basic' },
      });
      navigate('/crm/settings');
      return;
    }

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("User not found");
      return;
    }

    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      alert("Session error");
      return;
    }

    const res = await fetch('https://mylukrhthpvxhzadrfqe.supabase.co/functions/v1/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}` // 👈 Add this line
      },
      body: JSON.stringify({
        plan,
        user_id: user.id,
        email: user.email
      }),
    });

    const { url, error } = await res.json();

    if (res.ok && url) {
      window.location.href = url;
    } else {
      alert(error || 'Failed to create checkout session');
    }
  };



  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <CRMHeader />
      <div className="relative z-20 px-4 mt-4">
      <button
        onClick={() => navigate('/crm/settings')}
        className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 transition"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        Back to Settings
      </button>
    </div>
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">Choose Your Plan</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-12">
          Select a plan that fits your needs and scale as you grow.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map(plan => {
            const isCurrent = plan.name.toLowerCase() === currentPlan;
            return (
              <div
                key={plan.name}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 flex flex-col items-center text-center"
              >
                <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
                <p className="text-xl font-bold mb-4">{plan.price}</p>
                <ul className="mb-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {plan.features.map((feature, i) => (
                    <li key={i}>✓ {feature}</li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleChoose(plan.name.toLowerCase())}
                  disabled={isCurrent}
                  variant={isCurrent ? 'outline' : 'default'}
                >
                  {isCurrent ? 'Current Plan' : plan.button}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Plans;
