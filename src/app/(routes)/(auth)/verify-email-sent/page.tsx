"use client";
import { Button } from '@/app/components/ui/Button';
import { useToast } from '@/app/components/ui/Toast/ToastContext';
import { auth } from '@/lib/firebase';
import { mapAuthFirebaseError } from '@/lib/utils';
import { sendEmailVerification, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';

const VerifyEmailSent = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [cooldown, setCooldown] = useState(60);
  const [emailSent, setEmailSent] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [userReady, setUserReady] = useState(false);

  const handleSendVerification = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;

      if (!user) {
        const msg = "No user is currently logged in.";
        showToast({ message: msg, type: 'error', duration: 2000 });
        setStatusMessage(msg);
        return;
      }

      await user.reload();

      if (user.emailVerified) {
        const msg = "Email already verified. No email sent.";
        showToast({ message: msg, type: 'info', duration: 2000 });
        setStatusMessage(msg);
        return;
      }

      await sendEmailVerification(user, {
        url: `${window.location.origin}/verify-email`
      });

      setEmailSent(true);
      setStatusMessage("Verification email sent! Check your inbox.");
      showToast({ message: "Verification email sent!", type: 'success', duration: 2000 });
      setCooldown(60);
    } catch (error: any) {
      const errorCode = error.code || "";
      const errorMessage = mapAuthFirebaseError(errorCode) || "Error sending verification email.";
      console.log(errorCode);
      setStatusMessage(errorMessage);
      showToast({ message: errorMessage, type: 'error', duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  // Wait for auth state before triggering handleSendVerification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserReady(true);
      } else {
        setStatusMessage("No user is currently logged in.");
      }
    });

    return () => unsubscribe();
  }, []);

  // Once auth is ready, trigger send
  useEffect(() => {
    if (userReady) {
      handleSendVerification();
    }
  }, [userReady]);

  // Cooldown countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  return (
    <div className="h-[calc(100vh-288px)] flex flex-col items-center justify-center py-4 vsm:p-4 bg-gray-50">
      <div className="max-w-lg xtny:min-w-[310px] tny:min-w-[330px] vsm:min-w-[420px] text-center bg-white p-6 max-tny:px-4 vsm:p-8 rounded-xl shadow">
        <h1 className=" max-tny:text-xl text-2xl font-semibold mb-4 max-tny:mb-2">
          {emailSent ? "Almost there!" : "Email Status"}
        </h1>
        <p className="max-tny:text-sm max-tny:mb-4 text-gray-600 mb-6">
          {statusMessage || "Checking status..."}
        </p>
         {loading ? (
            <Button variant="dis">
              <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"></path>
                  </svg>
              </div>
            </Button>
         ): !auth.currentUser ? (
            <Button onClick={() => window.location.href = "/signin"} className="max-tny:text-sm">
              Go to Login
            </Button>
          ) : auth.currentUser.emailVerified ? (
            <Button onClick={() => window.location.href = "/"} className="max-tny:text-sm">
              Continue to Home
            </Button>
          ) : (
            <Button
              variant={loading || cooldown > 0 ? "disabled" : "primary"}
              onClick={handleSendVerification}
              className="max-tny:text-sm"
            >
              {loading
                ? "Sending..."
                : cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : "Resend Email"}
            </Button>
          )}
         
      </div>
    </div>
  );
};

export default VerifyEmailSent;
