'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { applyActionCode, getAuth } from 'firebase/auth';
import { auth, db } from '@/lib/firebase'; // Ensure this is properly initialized
import { Button } from '@/app/components/ui/Button';
import { Route } from 'lucide-react';
import Link from 'next/link';
import { doc, updateDoc } from 'firebase/firestore';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get('oobCode');

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!oobCode) {
        setStatus('error');
        setMessage('Verification code is missing or invalid.');
        return;
      }

      try {
        await applyActionCode(auth, oobCode);

         const user = auth.currentUser;

         if (user?.emailVerified) {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                emailVerified: true
            });

            setStatus('success');
            setMessage('Your email has been successfully verified!');
        } else {
            setStatus('error');
            setMessage('Something went wrong. Email is still not verified.');
        }
      } catch (error: any) {
        console.log('Verification failed:', error);
        setStatus('error');
        setMessage('This verification link is invalid or has expired.');
      }
    };

    verifyEmail();
  }, [oobCode]);

  return (
    <div className="h-[calc(100vh-288px)] flex items-center justify-center bg-gray-50 tny:px-4">
      <div className="max-w-md w-full bg-white max-tny:px-5 p-8 rounded-xl shadow-md text-center">
        {status === 'verifying' && (
          <>
            <h2 className="text-xl font-semibold text-gray-800">Verifying your email...</h2>
            <p className="text-sm text-gray-500 mt-2">Please wait while we verify your email.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <h2 className="max-tny:text-xl text-2xl font-bold text-green-600 mb-2">Email Verified!</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <h2 className="max-tny:text-xl text-2xl font-bold text-red-600 mb-2">Verification Failed</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
        {status === 'success' &&(
            <>
                <Link href={'/'}>
                    <Button className="mt-4 max-tny:text-sm" variant="success">Continue to Home</Button>
                </Link>
            </>
        )}
         {status === "error" &&(
            <>
                <Link href={'/verify-email-sent'}>
                    <Button className="mt-4 max-tny:text-sm" variant="error">Resend Verification Email</Button>
                
                </Link>
            </>
        )}
      </div>
    </div>
  );
}
