import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import CRMHeader from '@/components/crm/CRMHeader';
import { ArrowLeft } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    price: '$75/month',
    value: 'basic',
    amount: 7500,
    features: [
      'AI generated meeting summary',
      'Automated AI meeting admin',
      'Monthly report generation',
      'Email support',
      '✘ Realtime AI assistant',
      '✘ Custom integrations',
      '✘ Advanced Analytics',
    ],
    button: 'Get Started',
    recommended: false,
    enterprise: false,
  },
  {
    name: 'Professional',
    price: '$100/month',
    value: 'pro',
    amount: 10000,
    features: [
      'AI generated meeting summary',
      'Automated AI meeting admin',
      'Monthly report generation',
      'Email support',
      'Realtime AI assistant',
      'Custom integrations',
      'Advanced Analytics',
    ],
    button: 'Get Started',
    recommended: true,
    enterprise: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    value: 'enterprise',
    amount: 0,
    features: [],
    button: 'Get in touch',
    recommended: false,
    enterprise: true,
  },
];

const Plans: React.FC = () => {
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState<string>('');

  useEffect(() => {
    const fetchUserPlan = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.plan) {
        setCurrentPlan(user.user_metadata.plan);
      }
    };
    fetchUserPlan();
  }, []);

  const handleChoose = async (plan: string) => {
    if (plan === currentPlan) return;
    if (plan === 'enterprise') {
      window.location.href = 'mailto:support@advisorai.io?subject=Enterprise%20Plan%20Inquiry';
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!session || userError || !user) {
      alert('Please sign in to choose a plan.');
      return;
    }

    try {
      const res = await fetch(
        'https://mylukrhthpvxhzadrfqe.supabase.co/functions/v1/create-checkout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            plan,
            user_id: user.id,
            email: user.email,
            promotionCode: couponCode || undefined,
          }),
        }
      );
      const { url, error } = await res.json();
      if (res.ok && url) {
        window.location.href = url;
      } else {
        alert(error || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
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
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Select a plan that fits your needs and scale as you grow.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((planItem) => {
            const isCurrent = planItem.value === currentPlan;
            return (
              <div
                key={planItem.name}
                className={`rounded-2xl p-8 shadow-md flex flex-col justify-between text-center border ${
                  planItem.recommended
                    ? 'border-blue-600 ring-2 ring-blue-600'
                    : 'border-gray-200 dark:border-gray-700'
                } bg-white dark:bg-gray-800`}
              >
                <div>
                  <h2 className="text-2xl font-semibold mb-2">{planItem.name}</h2>
                  <p className="text-xl font-bold mb-4">{planItem.price}</p>
                  <ul className="mb-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    {planItem.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <Button
                  onClick={() => handleChoose(planItem.value)}
                  disabled={isCurrent}
                  variant={isCurrent ? 'outline' : 'default'}
                  className="w-full mt-auto"
                >
                  {isCurrent ? 'Current Plan' : planItem.button}
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
