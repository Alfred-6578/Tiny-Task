import React, { useEffect, useState } from 'react'
import { User } from 'lucide-react'
import { LiaCheckCircleSolid } from "react-icons/lia";
import { FaCheckCircle } from "react-icons/fa";
import { isUsernameTaken } from '@/lib/utils';
import { Button } from '@/app/components/ui/Button';
import { LuCircleX } from "react-icons/lu";
import { StepProps } from '../page';
import Link from 'next/link';


const StepUsername: React.FC<StepProps> = ({data, setData, nextStep, isValid, setIsValid ,isTaken, setIsTaken}) => {
    const [isChecking, setIsChecking] = useState(false);
    const [isEmpty, setIsEmpty] = useState<boolean | null>(null);

    const handleUsernameCheck = async (username: string) => {
        setData((prev)=> ({...prev, username: username}))
        setIsChecking(true);


        if (username.trim() === "") {
            if (setIsValid) {
              setIsValid(false);
            }
            setIsChecking(false);
            return;
        }

        if (setIsValid) {
            setIsValid(true);
        }
        const taken = await isUsernameTaken(username);
        if (setIsTaken) {
            setIsTaken(taken);
        }
        setIsChecking(false);
    };

    const handleSkip = () => {
        setData((prev) => ({ ...prev, username: "" }));
        nextStep();
    };

    useEffect(() => {
        // every time data.username changes, recalculate
        setIsEmpty(data.username.trim().length === 0);
    }, [data.username]);


  return (
    <div className='full-h flex flex-col justify-between'>
        <div className="">
            <div className="">
                <h1 className="font-semibold text-lg vsm:text-2xl">Hey there, welcome aboard!</h1>
                <p className="max-vsm:text-[13px] text-gray-500">Let’s set up your profile to personalize your experience.</p>
            </div>
            <div className="pt-5">
                <h2 className="font-medium max-tny:text-sm vsm:text-lg">What should we call you?</h2>
                <div className="flex items-center border border-gray-300 max-w-md rounded h-10 gap-1.5 pr-8 relative mt-2 mb-1">
                    <span className="h-full w-10 bg-gray-200 rounded-l flex items-center justify-center">
                        <User className='max-tny:w-[21px] text-gray-400'/>
                    </span>
                    <input type="text" value={data.username} placeholder='e.g cuteInterviewer801' className='outline-0 w-full placeholder:text-sm' onChange={(e)=> handleUsernameCheck(e.target.value)}/>
                    {!isChecking && isValid && isTaken === false && data.username.length > 0 && (
                        <LiaCheckCircleSolid className='text-success text-[22px] absolute right-2'/>
                    )}
                    {isChecking && (
                        <div className="flex items-center text-sm text-gray-500 absolute right-2">
                            <svg className="w-4 h-4 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"></path>
                            </svg>
                        </div>
                    )}

                    {/* invalid */}
                    {!isChecking && isValid === false && (
                        <LuCircleX className='text-error text-[20px] absolute right-2'/>

                    )}
                  
                    {/* taken */}
                    {!isChecking && isValid && isTaken === true && (
                        <LuCircleX className='text-error text-[20px] absolute right-2'/>
                    )}
                          
                </div>
                <div className="">
                    {isChecking && (
                        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                            <svg className="w-4 h-4 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"></path>
                            </svg>
                            Checking username...
                        </div>
                    )}
                    {!isChecking && isValid === false && (
                       <p className="text-error text-sm mt-1">Username is invalid</p>
                    )}
                    {!isChecking && isValid && isTaken === false && (
                        <p className="text-success text-sm mt-1">Username is available ✓</p>
                    )}

                    {!isChecking && isValid && isTaken === true && (
                        <p className="text-error text-sm mt-1">Username is already taken</p>
                    )}
                </div>
            </div>
        </div>
      
        <div className="flex justify-between">
            <div className="group relative">
                <div className="absolute -left-4 -top-10 w-64 mb-2 rounded shadow-md transition-all duration-300 bg-white p-2 text-[12px] opacity-0 group-hover:opacity-100">You can set this later from your profile.</div>
                <div className="flex items-center justify-center rounded-full bg-gray-200 p-1 w-8 h-8 tny:w-10 tny:h-10 cursor-pointer">
                    <div className="max-tny:text-sm flex items-center justify-center text-gray-400 border border-gray-400 w-6 h-6 tny:w-8 tny:h-8 rounded-full">?</div>
                </div>
            </div>
          
            <div className="flex justify-end gap-6 tny:gap-8">
                <button onClick={handleSkip} className="max-tny:text-sm text-gray-500 hover:underline cursor-pointer">
                    Skip
                </button>
                <Button onClick={nextStep} variant={!isEmpty && isValid && !isTaken ? "primary" : "disabled"} className="max-tny:text-sm max-tny:py-2">Continue</Button>
            </div>
           
        </div>

    </div>
  )
}

export default StepUsername
