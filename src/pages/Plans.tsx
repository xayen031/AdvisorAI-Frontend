import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import CRMHeader from '@/components/crm/CRMHeader'
import { ArrowLeft } from 'lucide-react'
import StripePayment from '@/components/StripePayment'

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
    features: [],
    amount: 0,
    button: 'Get in touch',
    recommended: false,
    enterprise: true,
  },
]

const Plans: React.FC = () => {
  const navigate = useNavigate()
  const [currentPlan, setCurrentPlan] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showPayment, setShowPayment] = useState(false)

  useEffect(() => {
    const fetchUserPlan = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.user_metadata?.plan) {
        setCurrentPlan(user.user_metadata.plan)
      }
    }

    fetchUserPlan()
  }, [])

  const handleChoose = async (plan: string) => {
    if (plan === currentPlan) return

    if (plan === 'enterprise') {
      window.location.href = 'mailto:support@advisorai.io?subject=Enterprise Plan Inquiry'
      return
    }

    setSelectedPlan(plan)
    setShowPayment(true)
  }

<<<<<<< HEAD
  const selected = plans.find(p => p.value === selectedPlan)
=======
    const res = await fetch('https://mylukrhthpvxhzadrfqe.supabase.co/functions/v1/create-checkout', {
      method: 'PlOST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        plan,
        user_id: user?.id,
        email: user?.email,
      }),
    });

    const { url, error } = await res.json();
    if (res.ok && url) {
      window.location.href = url;
    } else {
      alert(error || 'Faied to create checkout session');
    }
  };
>>>>>>> parent of f459aa9 (minor bug fixes)

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
            const isCurrent = plan.value === currentPlan
            return (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 shadow-md flex flex-col justify-between text-center border ${
                  plan.recommended ? 'border-blue-600 ring-2 ring-blue-600' : 'border-gray-200 dark:border-gray-700'
                } bg-white dark:bg-gray-800`}
              >
                <div>
                  <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
                  <p className="text-xl font-bold mb-4">{plan.price}</p>
                  <ul className="mb-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    {plan.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <Button
                  onClick={() => handleChoose(plan.value)}
                  disabled={isCurrent}
                  variant={isCurrent ? 'outline' : 'default'}
                  className="w-full mt-auto"
                >
                  {isCurrent ? 'Current Plan' : plan.button}
                </Button>
              </div>
            )
          })}
        </div>
      </div>

      {showPayment && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center">Complete Your Payment</h2>
            <StripePayment
              amount={selected.amount}
              onSuccess={() => {
                setShowPayment(false)
                setCurrentPlan(selected.value)
              }}
            />
            <button
              className="mt-4 w-full text-sm text-gray-500"
              onClick={() => setShowPayment(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Plans
