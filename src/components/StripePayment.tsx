// components/StripePayment.tsx
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import React, { useEffect, useState } from 'react'

const stripePromise = loadStripe('pk_live_51RU8RZP1BcK15YIHlY6iPMxujJbuxRZmYf2NuOy7dsRBaM9n0KXXm1hJKGOyjfnQ4EFBVJfa1hlllluxnVC3ZG8r00PMPreaUq') // 🔁 Buraya kendi Stripe public key'ini gir

const CheckoutForm = ({
  amount,
  onSuccess
}: {
  amount: number
  onSuccess: () => void
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [clientSecret, setClientSecret] = useState('')
  const [promotionCode, setPromotionCode] = useState('')
  const [couponStatus, setCouponStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const createPaymentIntent = async () => {
    setCouponStatus(promotionCode ? 'validating' : 'idle')
    const res = await fetch('https://mylukrhthpvxhzadrfqe.functions.supabase.co/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        currency: 'usd',
        promotionCode: promotionCode || undefined,
      }),
    })

    const data = await res.json()

    if (data.error) {
      setCouponStatus('invalid')
      setClientSecret('')
    } else {
      setClientSecret(data.clientSecret)
      if (promotionCode) setCouponStatus('valid')
    }
  }

  useEffect(() => {
    createPaymentIntent()
  }, [amount]) // ilk mount olduğunda

  const handleApplyCoupon = async () => {
    await createPaymentIntent()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!stripe || !elements) return

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Coupon Code
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Enter coupon (optional)"
            value={promotionCode}
            onChange={(e) => {
              setPromotionCode(e.target.value)
              setCouponStatus('idle')
            }}
            className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
          />
          <button
            type="button"
            onClick={handleApplyCoupon}
            className="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Apply
          </button>
        </div>
        {couponStatus === 'validating' && <p className="text-xs text-blue-500 mt-1">Validating...</p>}
        {couponStatus === 'valid' && <p className="text-xs text-green-600 mt-1">✅ Coupon applied successfully!</p>}
        {couponStatus === 'invalid' && <p className="text-xs text-red-500 mt-1">❌ Invalid or expired coupon code</p>}
      </div>

      <div className="border rounded p-4 bg-white dark:bg-gray-800">
        <CardElement />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">✅ Payment successful!</p>}

      <button
        type="submit"
        disabled={!stripe || loading || !clientSecret}
        className={`w-full py-2 text-white rounded transition ${
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
    <div className="animate-fade-in bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-center">Secure Payment</h2>
      <CheckoutForm amount={amount} onSuccess={onSuccess} />
    </div>
  </Elements>
)

export default StripePayment
