import React, { useEffect, useState } from 'react'
import { User } from 'lucide-react'
import { LiaCheckCircleSolid } from "react-icons/lia";
import { FaCheckCircle } from "react-icons/fa";
import { isUsernameTaken, isWhatsappTaken } from '@/lib/utils';
import { Button } from '@/app/components/ui/Button';
import { LuCircleX } from "react-icons/lu";
import { StepProps } from '../page';
import Link from 'next/link';

const StepUsername: React.FC<StepProps> = ({data, setData, nextStep, isValid, setIsValid ,isTaken, setIsTaken}) => {
    const [isChecking, setIsChecking] = useState(false);
    const [isCheckingWhatsapp, setIsCheckingWhatsapp] = useState(false);
    const [isEmpty, setIsEmpty] = useState<boolean | null>(null);
    const [whatsappError, setWhatsappError] = useState<string | null>(null);

    const isValidPhone = (phone: string) => {
        const regex = /^\+234[789][01]\d{8}$/;
        return regex.test(phone);
    }

    const handleUsernameCheck = async (username: string) => {
        setData((prev) => ({ ...prev, username: trimmed }));

        const trimmed = username.trim();

        if (trimmed === "") {
            if (setIsValid) setIsValid(false);
            if (setIsTaken) setIsTaken(false);
            setIsChecking(false);
            return;
        }

        setIsChecking(true);

        if (setIsValid) setIsValid(true);

        const taken = await isUsernameTaken(trimmed);

        if (setIsTaken) setIsTaken(taken);

        setIsChecking(false);
    };


    const handleWhatsAppChange = async (value: string) => {
        const trimmed = value.trim();
        setData(prev => ({ ...prev, whatsapp: trimmed }));


        if (trimmed === "") {
            setWhatsappError("WhatsApp number is required");
            return;
        }

        if (!isValidPhone(trimmed)) {
            setWhatsappError("Invalid Nigerian WhatsApp number");
            return;
        }

        setIsCheckingWhatsapp(true);

        const taken = await isWhatsappTaken(trimmed);

        setIsCheckingWhatsapp(false);


        if (taken) {
            setWhatsappError("This WhatsApp number is already in use");
        } else {
            setWhatsappError(null);
        }
    };


    const handleSkip = () => {
        setData((prev) => ({ ...prev, username: "", whatsapp: "" }));
        nextStep();
    };

    useEffect(() => {
        setIsEmpty(data.username.trim().length === 0);
    }, [data.username]);

    const canContinue = !isEmpty && isValid && !isTaken && data.whatsapp && whatsappError === null;

    return (
    <div className='full-h flex flex-col justify-between'>
        <div>
            <h1 className="font-semibold text-lg vsm:text-2xl">Hey there, welcome aboard!</h1>
            <p className="max-vsm:text-[13px] text-gray-500">Let’s set up your profile to personalize your experience.</p>

            {/* USERNAME SECTION */}
            <div className="pt-5">
                <h2 className="font-medium max-tny:text-sm vsm:text-lg">What should we call you?</h2>
                <div className="flex items-center border border-gray-300 max-w-md rounded h-10 gap-1.5 pr-8 relative mt-2 mb-1">
                    <span className="h-full px-4 bg-gray-200 rounded-l flex items-center justify-center">
                        <User className='max-tny:w-[21px] text-gray-400'/>
                    </span>
                    <input type="text" value={data.username} placeholder='e.g cuteInterviewer801' className='outline-0 w-full placeholder:text-sm' onChange={(e)=> handleUsernameCheck(e.target.value)}/>
                    {!isChecking && isValid && isTaken === false && data.username.length > 0 && (
                        <LiaCheckCircleSolid className='text-success text-[22px] absolute right-2'/>
                    )}
                    {isChecking && (
                        <div className="absolute right-2">
                            <svg className="w-4 h-4 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"></path>
                            </svg>
                        </div>
                    )}
                    {!isChecking && isValid === false && (
                        <LuCircleX className='text-error text-[20px] absolute right-2'/>
                    )}
                    {!isChecking && isTaken === true && (
                        <LuCircleX className='text-error text-[20px] absolute right-2'/>
                    )}
                </div>

                {/* username validation messages */}
                <div>
                    {isChecking && (
                        <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">Checking username...</p>
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

            {/* WHATSAPP SECTION */}
            <div className="pt-6">
                <h2 className="font-medium max-tny:text-sm vsm:text-lg">Enter your WhatsApp number</h2>
                <div className="flex items-center border border-gray-300 rounded max-w-md mt-2 relative">
                    <span className="px-3 h-[40px] flex items-center justify-center text-sm text-gray-400 bg-gray-100 border-r border-gray-300">+234</span>
                    <input
                        type="tel"
                        maxLength={10}
                        placeholder="8123456789"
                        value={data.whatsapp?.slice(4) || ''}  // show only last 10 digits
                        onChange={(e) => handleWhatsAppChange("+234" + e.target.value)}
                        className="w-full px-2 py-2 outline-none placeholder:text-sm"
                    />
                    {!isCheckingWhatsapp && whatsappError === null && (
                        <LiaCheckCircleSolid className='text-success text-[22px] absolute right-2'/>
                    )}
                    {isCheckingWhatsapp && (
                        <div className="absolute right-2">
                            <svg className="w-4 h-4 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"></path>
                            </svg>
                        </div>
                    )}
                    {!isCheckingWhatsapp && typeof whatsappError === "string" && (
                        <LuCircleX className='text-error text-[20px] absolute right-2'/>
                    )}
                </div>
                {whatsappError && (
                    <p className="text-error text-sm mt-1">{whatsappError}</p>
                )}
                {!whatsappError && data.whatsapp && (
                    <p className="text-success text-sm mt-1">Looks good ✓</p>
                )}
            </div>

        </div>

        <div className="flex justify-between items-end">
            <div className="group relative">
                <div className="absolute -left-4 -top-10 w-64 mb-2 rounded shadow-md transition-all duration-300 bg-white p-2 text-[12px] opacity-0 group-hover:opacity-100">
                    You can set this later from your profile.
                </div>
                <div className="flex items-center justify-center rounded-full bg-gray-200 p-1 w-8 h-8 tny:w-10 tny:h-10 cursor-pointer">
                    <div className="max-tny:text-sm flex items-center justify-center text-gray-400 border border-gray-400 w-6 h-6 tny:w-8 tny:h-8 rounded-full">?</div>
                </div>
            </div>

            <div className="flex justify-end gap-6 tny:gap-8">
                <button onClick={handleSkip} className="max-tny:text-sm text-gray-500 hover:underline cursor-pointer">Skip</button>
                <Button onClick={nextStep} variant={canContinue ? "primary" : "disabled"} className="max-tny:text-sm max-tny:py-2">
                    Continue
                </Button>
            </div>
        </div>
    </div>
    )
}

export default StepUsername;
