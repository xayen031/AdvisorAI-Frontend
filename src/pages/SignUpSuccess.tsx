// src/pages/VerifyEmail.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sign } from 'crypto';

const SignUpSuccess: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToSignIn = () => {
    navigate('/signin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Email verified</CardTitle>
          <CardDescription className="text-center">
            Email verification completed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Button onClick={handleGoToSignIn} className="mt-4 w-full">
            Go to Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpSuccess;
