import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

type Props = {
  children: React.ReactNode;
  allowedPlans: ('basic' |'lite' | 'pro')[];
};

const ProtectedRoute: React.FC<Props> = ({ children, allowedPlans }) => {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setAuthorized(false);
        return;
      }
      const plan = user.user_metadata?.plan || '';
      setAuthorized(allowedPlans.includes(plan as any));
    };

    checkAccess();
  }, [allowedPlans]);

  if (authorized === null) {
    return <div className="text-center py-10">Checking access...</div>; // Loading fallback
  }

  if (!authorized) {
    return <Navigate to="/plans" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
