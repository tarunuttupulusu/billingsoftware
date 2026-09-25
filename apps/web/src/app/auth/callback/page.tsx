'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/lib/state';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { session, setSession } = useApp();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function handleAuth() {
      try {
        const { data: { session: supaSession }, error } = await supabase.auth.getSession();

        if (error) {
          setErrorMsg(error.message);
          return;
        }

        if (supaSession?.user) {
          const user = supaSession.user;
          const userEmail = user.email || '';
          const userName = user.user_metadata?.full_name || user.user_metadata?.name || userEmail.split('@')[0];

          // Set active app session
          setSession({
            ...session,
            userId: user.id,
            email: userEmail,
            fullName: userName,
            roleName: 'OWNER',
            permissions: ['*'],
          });

          // Check if onboarding completed
          router.replace('/dashboard');
        } else {
          // If no session found yet, wait for auth state change
          const { data: authListener } = supabase.auth.onAuthStateChange((event, authSession) => {
            if (authSession?.user) {
              const u = authSession.user;
              setSession({
                ...session,
                userId: u.id,
                email: u.email || '',
                fullName: u.user_metadata?.full_name || u.email?.split('@')[0] || 'User',
                roleName: 'OWNER',
                permissions: ['*'],
              });
              router.replace('/dashboard');
            }
          });

          return () => {
            authListener.subscription.unsubscribe();
          };
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Authentication callback failed');
      }
    }

    handleAuth();
  }, [router, session, setSession]);

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="card p-8 max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <h2 className="text-xl font-bold text-heading">Authentication Failed</h2>
          <p className="text-sm text-secondary">{errorMsg}</p>
          <a href="/login" className="btn-primary inline-block px-4 py-2 mt-2">
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
      <h2 className="text-lg font-semibold text-heading">Completing Google Sign In...</h2>
      <p className="text-sm text-muted">Please wait while we set up your restaurant workspace</p>
    </div>
  );
}
