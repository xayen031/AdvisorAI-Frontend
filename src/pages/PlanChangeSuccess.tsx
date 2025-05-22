import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

export default function PlanChangeSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const finalizePlan = async () => {
      try {
        if (!sessionId) throw new Error('Missing session ID');

        // Get current Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;

        if (!accessToken) throw new Error('Missing Supabase access token');

        // Call the finalize-plan edge function
        const res = await fetch(
          'https://mylukrhthpvxhzadrfqe.supabase.co/functions/v1/finalize-plan',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ session_id: sessionId }),
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Unknown error from finalize-plan');

        console.log('✅ Plan updated to:', data.plan);

        // Refresh session to pull updated metadata
        await supabase.auth.refreshSession();

        // Redirect to settings
        navigate('/crm/settings');
      } catch (err) {
        console.error('❌ Failed to update plan:', err);
        // You might want to show a failure UI here
      } finally {
        setLoading(false);
      }
    };

    finalizePlan();
  }, [sessionId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">🎉 Payment Successful</h1>
        <p className="mt-2 text-gray-600">
          {loading
            ? 'Finalizing your subscription...'
            : 'Redirecting to your settings...'}
        </p>
      </div>
    </div>
  );
}
