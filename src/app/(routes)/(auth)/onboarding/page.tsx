"use client"
import React, { useEffect, useState } from 'react'
import ProgressBar from './components/ProgressBar'
import StepUsername from './steps/StepUsername'
import StepIntent from './steps/StepIntent';
import StepInterest from './steps/StepInterest';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Loader from '@/app/components/ui/TaskLoader';
import ThreeDotsLoader from '@/app/components/ui/ThreeDotsLoader';
import { cleanData } from '@/lib/utils';


interface FormDataProps{
    username: string,
    interests: string[],
    intent: string,
    whatsapp: string,
}

export interface StepProps{
    data: FormDataProps,
    setData: React.Dispatch<React.SetStateAction<FormDataProps>>;
    nextStep: () => void;
    finalStep?: (data:any) => void;
    prevStep?: () => void;
    isValid?: boolean;
    isTaken?: boolean | null;
    setIsValid?: React.Dispatch<React.SetStateAction<boolean>>;
    setIsTaken?: React.Dispatch<React.SetStateAction<boolean | null>>;
    handleSkip?: (data:any) => void;
}

const page = () => {
    const [formData, setFormData] = useState<FormDataProps>({
        username: '',
        interests: [],
        intent: '',
        whatsapp: '',
    });
    const [currentStep, setCurrentStep] = useState<number>(0)
    const [usernameValid, setUsernameValid] = useState(true);
    const [usernameTaken, setUsernameTaken] = useState<boolean|null>(null);  
    const [userId, setUserId] = useState<string|null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [pageLoading, setPageLoading] = useState<boolean>(true)


    const router = useRouter()
 
    const finishOnboarding = async (data:any) => {
        if(!userId) return;

        try {
            setIsLoading(true)
            const cleaned = cleanData(data);
            
            await setDoc(doc(db, 'users', userId), {
                ...cleaned,
                onboardingCompleted: true,
                updatedAt: serverTimestamp(),
            },{ merge: true })
            router.push('/')
        } catch (err) {
            console.error('Failed to complete onboarding:', err)
        }finally{
            setIsLoading(false)
        }
    }

    const handleFinishOnboarding = (data:any) =>{
        const hasData =
        data.username.trim() !== '' ||
        data.whatsapp.trim() !== '' ||
        data.intent.trim() !== '' ||
        data.interests.length > 0

        
        if (hasData) {
            finishOnboarding(data)
        } else {
            router.push('/')
        }
    }

    const handleSkip = (data:any) => {
        const hasData =
        data.username.trim() !== '' ||
        data.intent.trim() !== '' ||
        data.interests.length > 0

        
        if (hasData) {
            finishOnboarding(data)
        } else {
            router.push('/')
        }
    
    }

    useEffect(() => {
        const id = Cookies.get('userId');
        if (!id) {
            console.error("userId not found in cookies");
            router.push('/signin'); 
        } else {
            setUserId(id);
        }
    }, []);

    useEffect(() => {
        const checkOnboarding = async () => {
            if (!userId) return;
            try {
                const userRef = doc(db, 'users', userId);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const data = userSnap.data();
                    if (data.onboardingCompleted) {
                        router.push('/'); 
                    }
                }
            } catch (err) {
                console.log('Error checking onboarding status:', err);
            }finally{
                setTimeout(()=>{
                    setPageLoading(false)
                }, 300)
            }
        };

        checkOnboarding();
    }, [userId]);


    if (pageLoading) {
        return <ThreeDotsLoader transparent={false}/>
    }

  return (
    <div className='bg-white h-[calc(100vh-48px)] rounded-xl  p-4 tny:p-6 vsm:p-8'>
        {
            isLoading && <ThreeDotsLoader/>
        }
        <ProgressBar currentStep={currentStep} />
        <div className="pt-6 flex full-h flex-col justify-between">
           {currentStep === 0 && <StepUsername data={formData} setData={setFormData} nextStep={()=> setCurrentStep(1)}  isValid={usernameValid} isTaken={usernameTaken} setIsValid={setUsernameValid} setIsTaken={setUsernameTaken}/>}
           {currentStep === 1 && <StepIntent data={formData} setData={setFormData} nextStep={()=> setCurrentStep(2)} prevStep={()=> setCurrentStep(0)}/>}
           {currentStep === 2 && <StepInterest data={formData} setData={setFormData} nextStep={()=>{}} finalStep={handleFinishOnboarding} prevStep={()=> setCurrentStep(1)} handleSkip={handleSkip}/>}
        </div>
    </div>
  )
}

export default page
function getCurrentUserId() {
    throw new Error('Function not implemented.');
}

