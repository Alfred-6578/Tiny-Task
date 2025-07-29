'use client';

import { useEffect, useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { Typewriter } from 'react-simple-typewriter';
import Confetti from 'react-confetti';
import { useRouter } from 'next/navigation';
import { useWindowSize } from 'react-use';
import dynamic from 'next/dynamic';

const LottiePlayer = dynamic(
  () => import('@lottiefiles/react-lottie-player').then(mod => mod.Player),
  { ssr: false }
);

export default function SuccessPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { width, height } = useWindowSize()
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/onboarding'); // adjust your redirect route
    }, 4200);

   
    // const confettiTimer = setTimeout(() => {
    //   setShowConfetti(false);
    // }, 5000);

    return () => {
      clearTimeout(timeout);
    //   clearTimeout(confettiTimer);
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-48px)] bg-white rounded-xl px-4 text-center relative overflow-hidden">
      {/* {mounted && showConfetti && <Confetti width={width} height={height} numberOfPieces={250} />} */}
      <div className="h-30 w-30">
        <LottiePlayer
            autoplay
            loop={true}
            keepLastFrame
            src="/lottie/Success.json"
            style={{ height: '120px', width: '120px' }}
        />
      </div>
     
      <h1 className="text-xl xtny:text-[22px] tny:text-3xl font-bold mb-2">Welcome to TinyTasks!</h1>
      
      <p className="tny:text-xl font-mono h-8">
        <Typewriter
          words={['Signup Successful!', 'Redirecting...']}
          loop={false}
          cursor
          cursorStyle="|"
          typeSpeed={60}
          deleteSpeed={50}
          delaySpeed={1000}
        />
      </p>
      <p className="mt-2 text-gray-500">Thank you for joining TinyTasks.</p>
    </div>
  );
}
