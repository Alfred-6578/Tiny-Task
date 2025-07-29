import React from 'react'
import Image from 'next/image'

const GoogleSignupButton = () => {
  return (
    <>
        <button className="flex gap-2 p-2.5 rounded-4xl text-text-light border border-gray-300 w-full justify-center items-center cursor-pointer">
            <Image className='w-6 h-6' src={require('@/assets/google_logo.png')} alt='google_logo'/>
            <p className="font-medium max-tny:text-sm">Contine with Google</p> 

        </button> 
    </>
  )
}

export default GoogleSignupButton
