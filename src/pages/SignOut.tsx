import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

const SignOut: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const signOutUser = async () => {
      await supabase.auth.signOut();
      navigate('/signin'); // redirect after sign-out
    };

    signOutUser();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen text-xl">
      Signing out...
    </div>
  );
};

export default SignOut;