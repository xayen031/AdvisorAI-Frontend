import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resetComplete, setResetComplete] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveryMode(true);
      }
      setLoading(false);
    });

    // Hemen kontrol et (refreshSession token varsa çalışsın diye)
    supabase.auth.refreshSession().catch(() => setLoading(false));

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleReset = async () => {
    if (!password) return;

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      setResetComplete(true);
      toast({ title: 'Success', description: 'Password has been updated.' });
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600 dark:text-gray-300">Verifying token...</div>;
  }

  if (!isRecoveryMode) {
    return (
      <div className="p-6 text-center text-red-600">
        Access denied. This page is only accessible via a valid password reset link.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Reset Your Password</h2>

        {!resetComplete ? (
          <>
            <Input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4"
            />
            <Button onClick={handleReset} className="w-full">
              Update Password
            </Button>
          </>
        ) : (
          <>
            <p className="text-green-600 mb-4">Your password has been reset successfully.</p>
            <Button className="w-full" onClick={() => navigate('/signin')}>Back to Sign In</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
