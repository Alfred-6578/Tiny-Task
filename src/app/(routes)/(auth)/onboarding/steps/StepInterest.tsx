import { Button } from '@/app/components/ui/Button'
import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { StepProps } from '../page'
import { useState } from "react";
import {
  BookOpen,
  ShoppingCart,
  Brush,
  Code,
  Truck,
  Edit3,
  Archive,
} from "lucide-react";
import { BsTools } from 'react-icons/bs';

const interestOptions = [
  { id: "education", label: "Education", Icon: BookOpen },
  { id: "errands",   label: "Errands",   Icon: ShoppingCart },
  { id: "design",    label: "Design",    Icon: Brush },
  { id: "tech",      label: "Tech",      Icon: Code },
  { id: "delivery",  label: "Delivery",  Icon: Truck },
  { id: "writing",   label: "Writing",   Icon: Edit3 },
  { id: "logistics", label: "Logistics", Icon: Archive },
  { id: "handy",     label: "Handywork", Icon: BsTools },
];



const StepInterest : React.FC<StepProps> = ({data, setData, prevStep, finalStep, handleSkip}) => {
    const [selected, setSelected] = useState<string[]>(data.interests || []);

    const toggle = (id: string) => {
        setSelected((s) =>
        s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
        );

    };

    const onContinue = () => {
        const updatedData = { ...data, interests: selected };
        setData(updatedData);  
        
       if (finalStep) {
           finalStep(updatedData);
        }
    };

    const onSkip = ()=>{
        const updatedData = { ...data, interests: selected };
        setData(updatedData);  
        
        if (handleSkip) {
           handleSkip(updatedData);
        }
    }
  return (
     <div className="full-h flex flex-col justify-between">
        <div className="">
            <div onClick={prevStep} className="flex gap-2 items-center max-tny:text-sm font-medium cursor-pointer">
                <FaArrowLeft/>
                <p className="">Go Back</p>
            </div>
            <div>
                <h1 className="font-semibold text-lg vsm:text-2xl">What are you interested in?</h1>
                <p className="max-vsm:text-[13px] text-gray-500 mb-6">Choose up to 5 to personalize your task feed.</p>

                {/* Interest Chips */}
                <div className="grid tny:grid-cols-2 gap-3">
                    {interestOptions.map(({ id, label, Icon }) => {
                        const isSel = selected.includes(id);
                        return (
                        <button
                            key={id}
                            onClick={() => toggle(id)}
                            disabled={!isSel && selected.length >= 5}
                            className={`
                            flex items-center gap-2 px-4 py-2 tny:py-3 border rounded-lg text-left transition
                            ${isSel
                                ? "bg-primary/10 border-primary text-primary"
                                : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"}
                            ${!isSel && selected.length >= 5 ? "opacity-50 cursor-not-allowed" : ""}
                            `}
                        >
                            <Icon className={`w-5 h-5 ${isSel ? "text-primary" : "text-gray-500"}`} />
                            <span className="truncate max-vsm:text-sm">{label}</span>
                        </button>
                        );
                    })}
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
                <button onClick={onSkip} className="max-tny:text-sm text-gray-500 hover:underline cursor-pointer">
                    Skip
                </button>
                <Button onClick={onContinue} variant={selected.length > 0 ? "primary" : "disabled"} className="max-tny:text-sm max-tny:py-2">Continue</Button>
            </div>
            
        </div>
    </div>
  )
}

export default StepInterest
