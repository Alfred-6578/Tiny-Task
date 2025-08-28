import React from 'react'
import { Button } from './Button'

const Popup = ({finishOnboarding, closePopup}:any) => {
  return (
 <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 p-4">
  <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in fade-in-50 scale-in-95">
    
    {/* Close button (optional) */}
    <button onClick={closePopup} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
      ✕
    </button>

    {/* Illustration / Emoji */}
    <div className="flex justify-center mb-4">
      <div className="text-6xl">👥</div>
    </div>

    {/* Title */}
    <h1 className="text-2xl font-extrabold text-gray-800 text-center mb-3">
      Build trust & unlock task posting
    </h1>

    {/* Subtitle */}
    <p className="text-base text-gray-600  leading-relaxed mb-6">
      Onboarding makes your tasks stand out. A quick setup shows others who you are, so you’ll get faster responses and trusted applications.
    </p>

    {/* Benefits */}
    <ul className="space-y-2 text-sm text-gray-700 mb-8">
      <li className="flex items-center gap-2">
        <span className="text-green-500 text-lg">✅</span>
        <span>Tasks linked to real profiles</span>
      </li>
      <li className="flex items-center gap-2">
        <span className="text-green-500 text-lg">✅</span>
        <span>More trust, more responses</span>
      </li>
      <li className="flex items-center gap-2">
        <span className="text-green-500 text-lg">✅</span>
        <span>Safer community for everyone</span>
      </li>
    </ul>

    {/* CTA */}
    <div className="flex justify-center">
      <Button className="w-full py-3 rounded-xl text-base font-semibold 
        bg-gradient-to-r from-indigo-500 to-purple-600 
        text-white shadow-md hover:opacity-90 transition">
        Finish Onboarding
      </Button>
    </div>
  </div>
</div>


  )
}

export default Popup
