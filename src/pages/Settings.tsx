// src/pages/Settings.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CRMHeader from '@/components/crm/CRMHeader';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [phone, setPhone]         = useState('');
  const [plan, setPlan]           = useState<'basic'|'lite'|'pro'>('basic');
  const [theme, setTheme]         = useState<'light'|'dark'>('light');
  const [billingDate, setBillingDate] = useState<string | null>(null);
  const [sendingReset, setSendingReset] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    
    (async () => {
      await supabase.auth.refreshSession();
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }

      const meta = user?.user_metadata || {};
      setFirstName(meta.firstName || '');
      setLastName(meta.lastName || '');
      setPhone(meta.phone || '');
      setPlan(meta.plan || 'basic');

      const savedTheme = meta.theme || (localStorage.getItem('theme') as 'light'|'dark') || 'light';
      setTheme(savedTheme);
      applyTheme(savedTheme);

      if (meta.stripe_customer_id && meta.plan !== 'basic') {
        fetchBillingDate();
        console.log("Billing date:", billingDate);
      }
      console.log("Meta Stripe Customer ID:", meta.stripe_customer_id);
    })();
  }, []);

  const fetchBillingDate = async () => {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    if (!token) {
      console.warn("No access token");
      return;
    }

    const res = await fetch("https://mylukrhthpvxhzadrfqe.supabase.co/functions/v1/get-billing-info", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    console.log("Billing response:", data);

    if (res.ok && data.current_period_end) {
      const date = new Date(data.current_period_end * 1000).toLocaleDateString();
      setBillingDate(date);
      console.log("Billing date set to:", date);
    } else {
      console.warn("Billing fetch failed:", data);
    }
  };

  const applyTheme = (mode: 'light'|'dark') => {
    if (mode === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const handleSaveProfile = async () => {
    setLoadingProfile(true);
    const { error } = await supabase.auth.updateUser({
      data: { firstName, lastName, phone, plan, theme }
    });
    setLoadingProfile(false);

    if (error) {
      toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
    } else {
      localStorage.setItem('theme', theme);
      applyTheme(theme);
      toast({ title: 'Profile saved', description: 'Your settings have been updated.' });
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: 'Sign out failed', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Signed out', description: 'You have been signed out successfully.' });
    navigate('/signin', { replace: true });
  };

  const handlePasswordReset = async () => {
    setSendingReset(true);
    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user?.email) {
      toast({ title: 'Error', description: (userErr||{}).message || 'No email found', variant: 'destructive' });
      setSendingReset(false);
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(user.email);
    setSendingReset(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Email sent', description: 'Check your inbox to reset your password.' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-indigo-950">
      <CRMHeader activePage="Settings" />
      <div className="container mx-auto px-4 py-8 space-y-12">

        {/* Profile Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Profile</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Update your personal information.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Plan</Label>
              <div className="flex items-center justify-between">
                <span className="text-gray-800 dark:text-gray-200 capitalize">{plan}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/plans')}
                >
                  Change
                </Button>
              </div>
              {plan !== 'basic' && billingDate && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Next billing date: <strong>{billingDate}</strong>
                </p>
              )}
              <Button onClick={async () => {
                const session = await supabase.auth.getSession();
                const token = session.data.session?.access_token;

                const res = await fetch("https://mylukrhthpvxhzadrfqe.supabase.co/functions/v1/create-portal-session", {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                });

                const data = await res.json();
                if (data.url) window.location.href = data.url;
                else alert('Failed to create billing portal');
              }}>
                View Billing & Invoices
              </Button>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Security</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Change your password via email.</p>
          <div className="space-y-4">
            <div>
              <Button onClick={handlePasswordReset} disabled={sendingReset}>
                {sendingReset ? 'Sending…' : 'Send Password Reset'}
              </Button>
            </div>
            <div>
              <Button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
