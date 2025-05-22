// src/components/AuthGuard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

interface AuthGuardProps {
  children: React.ReactElement;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/signin', { replace: true });
      } else {
        setLoading(false);
      }
    });
  }, [navigate]);

  // while we’re checking session, don’t flash protected UI
  if (loading) return null;

  return children;
};

export default AuthGuard;
