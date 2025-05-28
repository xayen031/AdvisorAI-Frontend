import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setAuthorized(false);
        return;
      }

      const plan = user.user_metadata?.plan;
      // Eğer plan tanımsız veya boşsa engelle
      setAuthorized(!!plan);
    };

    checkAccess();
  }, []);

  if (authorized === null) {
    return <div className="text-center py-10">Checking access...</div>;
  }

  if (!authorized) {
    return <Navigate to="/plans" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
