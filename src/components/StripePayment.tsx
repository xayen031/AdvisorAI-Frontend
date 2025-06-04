// components/StripePayment.tsx
import { supabase } from '@/lib/supabaseClient'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import React, { useState } from 'react'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!) // ✅ .env üzerinden alınmalı

const CheckoutForm = ({
  amount,
  onSuccess
}: {
  amount: number
  onSuccess: () => void
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [promotionCode, setPromotionCode] = useState('')
  const [couponStatus, setCouponStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const fetchPaymentIntent = async (promo?: string) => {
    setCouponStatus(promo ? 'validating' : 'idle')
    setClientSecret(null)

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const res = await fetch(`https://mylukrhthpvxhzadrfqe.supabase.co/functions/v1/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        amount,
        currency: 'usd',
        promotionCode: promo || undefined,
      }),
    })

    const data = await res.json()
    if (res.ok && data.clientSecret) {
      setClientSecret(data.clientSecret)
      if (promo) setCouponStatus('valid')
    } else {
      setCouponStatus(promo ? 'invalid' : 'idle')
      setError(data.error || 'Failed to create payment intent')
    }
  }

  const handleApplyCoupon = async () => {
    await fetchPaymentIntent(promotionCode)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!stripe || !elements || !clientSecret) {
      setError('Payment is not ready yet')
      setLoading(false)
      return
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    })

    if (result.error) {
      setError(result.error.message || 'Payment failed')
    } else if (result.paymentIntent?.status === 'succeeded') {
      setSuccess(true)
      onSuccess()
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Coupon Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Coupon Code
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. advisor25"
            value={promotionCode}
            onChange={(e) => {
              setPromotionCode(e.target.value)
              setCouponStatus('idle')
            }}
            className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
          />
          <button
            type="button"
            onClick={handleApplyCoupon}
            className="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Apply
          </button>
        </div>
        {couponStatus === 'validating' && <p className="text-xs text-blue-500 mt-1">Validating coupon...</p>}
        {couponStatus === 'valid' && <p className="text-xs text-green-600 mt-1">✅ Coupon applied successfully!</p>}
        {couponStatus === 'invalid' && <p className="text-xs text-red-500 mt-1">❌ Invalid or expired coupon</p>}
      </div>

      {/* Card Input */}
      <div
        className="border rounded p-4 bg-white dark:bg-gray-800"
        style={{ minHeight: '60px', overflow: 'visible' }}
      >
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#32325d',
                fontFamily: 'Inter, sans-serif',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
              },
            },
          }}
        />
      </div>

      {/* Messages */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">✅ Payment successful!</p>}

      {/* Submit */}
      <button
        type="submit"
        disabled={!stripe || loading || !clientSecret}
        className={`w-full py-2 text-white font-medium rounded transition ${
          loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  )
}

const StripePayment = ({
  amount,
  onSuccess
}: {
  amount: number
  onSuccess: () => void
}) => (
  <Elements stripe={stripePromise}>
    <div className="animate-fade-in bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
        Complete Your Payment
      </h2>
      <CheckoutForm amount={amount} onSuccess={onSuccess} />
    </div>
  </Elements>
)

export default StripePayment
