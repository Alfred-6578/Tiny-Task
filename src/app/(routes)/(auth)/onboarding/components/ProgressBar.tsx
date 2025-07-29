import React from 'react'

type ProgressBarProps = {
  currentStep: number;
};

const ProgressBar = ({currentStep}:ProgressBarProps) => {
  return (
    <div className='grid grid-cols-3 gap-2 vsm:gap-4 '>
        {[...Array(3)].map((_,i)=>(
            <span key={i} className={`h-1.5 tny:h-2 rounded-2xl ${currentStep === i  ? 'bg-primary' : 'bg-bg-light'} transition-colors duration-100`}></span>
        ))}
      
    </div>
  )
}

export default ProgressBar
