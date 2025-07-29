"use client"
import { usePathname } from 'next/navigation';
import React from 'react'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const pathName = usePathname()

    const hiddenPathNames = ['/success', '/onboarding']
    const shouldNotDisplay = hiddenPathNames.includes(pathName)

  return (
    <div>
      <div className="h-full min-h-screen bg-bg-light p-6">
       {!shouldNotDisplay &&
            <>
                <div className="fixed">
                    <h1 className='text-2xl vsm:text-3xl font-bold'>Logo</h1>
                </div>
                <div className="h-20"></div>
            </>
        }
        <div className="">
            {children}
        </div>
      </div>
    </div>
  );
}
