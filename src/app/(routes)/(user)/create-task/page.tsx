"use client"
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import * as yup from "yup";
import Step1 from './component/Step1';
import Step2 from './component/Step2';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/app/components/ui/Button';
import Step3 from './component/Step3';
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import Step4 from './component/Step4';
import { cleanData, mapAuthFirebaseError } from '@/lib/utils';
import Cookies from 'js-cookie';
import ThreeDotsLoader from '@/app/components/ui/ThreeDotsLoader';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Popup from '@/app/components/ui/Popup';
import { useToast } from '@/app/components/ui/Toast/ToastContext';



export interface CreateTaskFormValues {
  title: string;
  description: string;
  price: number;
  taskDeadline: string; 
  applicationDeadline: string; 
  location: string; 
  isRemote: boolean;
  skillTags: string[]; 
  tierRequirement: number | null;
  isUrgent: boolean;
  state: string;
  city: string;

  locationNote?: string; 
}

export const initialValues = {
  title: '',
  description: '',
  price: 0,
  taskDeadline: '', 
  applicationDeadline: '', 
  location: '', 
  isRemote: false,
  state: '',
  city: '',
  skillTags: [], 
  tierRequirement: 1,
  isUrgent: false,
  locationNote: '', 
}


const createTaskSchema = yup.object().shape({
  // step1
  title: yup
    .string()
    .required("Title is required")
    .max(80, "Title should not exceed 80 characters"),

  description: yup
    .string()
    .required("Description is required")
    .max(1000, "Description should not exceed 1000 characters"),

  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .min(500, "Minimum price is ₦500")
    .max(30000, "Maximum price is ₦30,000"),

  isUrgent: yup.boolean(),
  
    // step3
  taskDeadline: yup
    .date()
    .typeError("Invalid Date")
    .required("Task deadline is required")
    .min(new Date(), "Deadline must be in the future"),

  applicationDeadline: yup
    .date()
    .typeError("Invalid Date")
    .required("Application deadline is required")
    .max(yup.ref('taskDeadline'), "Must be before the task deadline"),

  //Step4
  location: yup
    .string()
    .when("isRemote", {
      is: false,
      then: (schema) =>
        schema.required("Location is required for non-remote tasks"),
      otherwise: (schema) => schema.notRequired(),
    }),

  state: yup
    .string()
    .when("isRemote", {
      is: false,
      then: (schema) =>
        schema.required("State is required for non-remote tasks"),
      otherwise: (schema) => schema.notRequired(),
    }),

  city: yup
    .string()
    .when("isRemote", {
      is: false,
      then: (schema) =>
        schema.required("City is required for non-remote tasks"),
      otherwise: (schema) => schema.notRequired(),
    }),
  
  isRemote: yup.boolean(),
  

  //step2
  skillTags: yup
    .array()
    .of(
      yup
        .string()
        .max(15, "Each tag should not exceed 15 characters")
    )
    .min(1, "At least one skill tag is required")
    .max(5, "You can add up to 5 skill tags"),

  tierRequirement: yup
    .number()
    .nullable()
    .min(0)
    .max(3)
    .typeError("Invalid tier requirement"),

});

// Step 1 Schema
export const step1Schema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .max(80, "Title should not exceed 80 characters"),

  description: yup
    .string()
    .required("Description is required")
    .max(1000, "Description should not exceed 1000 characters"),

  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .min(500, "Minimum price is ₦500")
    .max(30000, "Maximum price is ₦30,000"),

  isUrgent: yup.boolean(),
});

// Step 2 Schema
export const step2Schema = yup.object().shape({
  skillTags: yup
    .array()
    .of(
      yup
        .string()
        .max(15, "Each tag should not exceed 15 characters")
    )
    .min(1, "At least one skill tag is required")
    .max(5, "You can add up to 5 skill tags"),

  tierRequirement: yup
    .number()
    .nullable()
    .min(0)
    .max(3)
    .typeError("Invalid tier requirement"),
});

// Step 3 Schema
export const step3Schema = yup.object().shape({
  taskDeadline: yup
    .date()
    .typeError("Invalid Date")
    .required("Task deadline is required")
    .min(new Date(), "Deadline must be in the future"),

  applicationDeadline: yup
    .date()
    .typeError("Invalid Date")
    .required("Application deadline is required")
    .max(yup.ref("taskDeadline"), "Must be before the task deadline"),
});

// Step 4 Schema
export const step4Schema = yup.object().shape({
  location: yup.string().when("isRemote", {
    is: false,
    then: (schema) =>
      schema.required("Location is required for non-remote tasks"),
    otherwise: (schema) => schema.notRequired(),
  }),

  state: yup
    .string()
    .required("State is required for non-remote tasks"),

  city: yup
    .string()
    .required("City is required for non-remote tasks"),

  isRemote: yup.boolean(),
});

const stepSchemas = [
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
];
const page = () => {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [showConfirmExit, setShowConfirmExit] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [userId, setUserId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState<boolean>(true)
    const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(false)
    const [popup, setPopup] = useState(false)
    const {showToast} = useToast()
    
  
    const handleBackArrowClick = () => {
        if (currentStep === 1) {
            router.back();
        } else {
            setShowConfirmExit(true);
        }
    };

    const createTask = async (data:any) => {
      if(!userId) return;
      if (onboardingCompleted) {
        
        try {
            setIsLoading(true)
            const cleaned = cleanData(data);
            
            await addDoc(collection(db, 'tasks'), {
                ...cleaned,
                 postedBy: {
                  userId: user.uid,
                  displayName: user.username || user.displayName,
                  profilePicUrl: user.avatarUrl || false,
                },
                // posterId: user.uid,
                // posterName: user.username || user.displayName,
                // posterAvatar: user.avatarUrl,
                taskCompletion: {
                  confirmedByPoster: false,
                  confirmedByTasker: false,
                  completedAt: null,
                },
                createdAt: Timestamp.fromDate(new Date()),
                status: "open",
                applicationCount: 0,
                likesCount: 0,
            })

            showToast({
              message: 'Task created succesfully',
              type: 'success',
              duration: 1500
            })

            setTimeout(() => {
              router.push('/')
              
            }, 1600);
        } catch (error:any) {
          const errorCode = error.code || ""; 
          const errorMessage = mapAuthFirebaseError(errorCode);
          showToast({
              message: errorMessage || "Task creation failed. Please try again.", 
              type: 'error', 
              duration: 3000 
          })

        }finally{
            setIsLoading(false)
        }
      }else{
          setPopup(true)
      }
      
    }


    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          setUserId(null);
          setPageLoading(false);
          return;
        }

        setUserId(user.uid); 
        setUser(user); 

        (async () => {
          try {
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              const data = userSnap.data();
              if (data.onboardingCompleted) setOnboardingCompleted(true);
            } else {
              console.log('[onboarding] no user doc found for', user.uid);
            }
          } catch (err) {
            console.error('[onboarding] error:', err);
          } finally {
            // keep your loading UX consistent
            setTimeout(() => setPageLoading(false), 300);
          }
      })();
    });

  return () => unsubscribe();
    }, []); 


  
  if (pageLoading) {
      return <ThreeDotsLoader transparent={false}/>
  }

  return (
    <div className='bg-white rounded-xl min-h-[calc(100vh-48px)] max-tny:px-4 max-tny:py-6 p-6 py-8 flex flex-col'>
       { popup &&  <Popup closePopup={()=>setPopup(false)}></Popup>}
        <div onClick={handleBackArrowClick} className="flex gap-2 items-center cursor-pointer">
            <div className="pt-0 font-semibold text-xl ">
              <BsArrowLeft/>
            </div>
            <div className="max-vsm:flex-1 max-vsm:text-center max-vsm:-ml-6">
                <h1 className="font-semibold text-lg vsm:text-xl">Create Task</h1>
                {/* <p className="text-gray-300 text-sm">Post a short task and get it done fast.</p> */}
            </div>
        </div>
        <div className="mt-6 px-2 h-full flex flex-1 flex-col ">
            <Formik initialValues={initialValues} validationSchema={createTaskSchema} onSubmit={(values)=> createTask(values)}>
                <Form className='contents'>

                    {currentStep === 1 && <Step1 nextStep={()=> setCurrentStep(2)}/>}
                    {currentStep === 2 && <Step2 prevStep={()=> setCurrentStep(1)} nextStep={()=> setCurrentStep(3)}/>}
                    {currentStep === 3 && <Step3 prevStep={()=> setCurrentStep(2)} nextStep={()=> setCurrentStep(4)}/>}
                    {currentStep === 4 && <Step4 prevStep={()=> setCurrentStep(3)} nextStep={()=> setCurrentStep(5)}/>}
                </Form>
            </Formik>
        </div>
        {showConfirmExit && (
           <Dialog open={showConfirmExit} onOpenChange={setShowConfirmExit}>
              <DialogContent className="sm:max-w-md max-tny:px-5">
                <DialogHeader>
                  <DialogTitle>Discard Task?</DialogTitle>
                  <DialogDescription>Your progress will be lost.</DialogDescription>
                </DialogHeader>
                <DialogFooter className='max-md:flex-col'>
                  <Button variant="outline" onClick={() => setShowConfirmExit(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={() => router.back()}>
                    Discard
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        )}

    </div>
  )
}

export default page
