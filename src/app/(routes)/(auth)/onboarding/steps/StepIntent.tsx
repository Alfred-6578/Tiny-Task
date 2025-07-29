import React, { useState } from 'react'
import { StepProps } from '../page'
import { FaArrowLeft } from "react-icons/fa";
import { Button } from '@/app/components/ui/Button';
import { BiDollarCircle } from "react-icons/bi";
import { LuClipboardCheck } from "react-icons/lu";
import { LuShuffle } from "react-icons/lu";


const intents = [
    {
        id: 0,
        value: 'taskee',
        title: 'Complete tasks for others',
        desc: 'Take charge—earn extra doing quick gigs',
        Icon: BiDollarCircle
    },
     {
        id: 1,
        value: 'tasker',
        title: 'Post tasks and find help',
        desc: 'Delegate tasks—get them done by trusted helpers.',
        Icon: LuClipboardCheck
    },
     {
        id: 2,
        value: 'both',
        title: 'Do both',
        desc: 'Stay flexible—earn or outsource tasks as you wish.”',
        Icon: LuShuffle
    },
]
const StepIntent : React.FC<StepProps> = ({data, setData, nextStep, prevStep}) => {
    const [selected, setSelected] = useState(data.intent || '')


    const handleSkip = () => {
        setData((prev) => ({ ...prev, intent: '' }));
        nextStep();
    };

    const select = (value:string) => {
        setSelected(value)
        setData(prev => ({ ...prev, intent: value }))
    }

  return (
    <div className="full-h flex flex-col justify-between">
        <div className="">
            <div onClick={prevStep} className="flex gap-2 items-center max-tny:text-sm font-medium cursor-pointer">
                <FaArrowLeft/>
                <p className="">Go Back</p>
            </div>
            <div className="">
                <h1 className="font-semibold text-lg vsm:text-2xl">What brings you to TinyTasks?</h1>
                <p className="max-vsm:text-[13px] text-gray-500">Helps personalize your experience — you can edit this later.</p>
            </div>
            <div className="grid gap-4 mt-4">
                {intents.map(({ id, title, desc, value, Icon }) => (
                    <button
                    key={id}
                    onClick={() => select(value)}
                    className={`
                        flex items-center gap-3  p-3 tny:gap-4 tny:p-4 cursor-pointer border rounded-lg transition 
                        ${selected === value 
                        ? 'border-primary bg-primary/10' 
                        : 'border-gray-300 hover:border-gray-400'}
                    `}
                    >
                    <Icon className={`text-2xl sm:text-3xl ${selected === value ? 'text-primary' : 'text-gray-500'} xtny:shrink-0`} />
                    <div className="text-left">
                        <h3 className={`max-tny:text-sm font-medium ${selected === value ? 'text-primary' : 'text-gray-800'}`}>
                        {title}
                        </h3>
                        <p className="text-[12px] tny:text-sm text-gray-600">{desc}</p>
                    </div>
                    </button>
                ))}
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
                <Button onClick={nextStep} variant={selected ? "primary":"disabled"} className="max-tny:text-sm max-tny:py-2">Continue</Button>
            </div>
            
        </div>
    </div>
  )
}

export default StepIntent
