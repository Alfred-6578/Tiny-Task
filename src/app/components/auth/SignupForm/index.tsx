import React, { useState } from 'react'
import Header from '../Header'
import GoogleSignupButton from '../GoogleSignupButton'
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { Input } from '../../ui/Input'
import { Button } from '../../ui/Button'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import { mapAuthFirebaseError } from '@/lib/utils'
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { useRouter } from 'next/navigation'
import { useToast } from '../../ui/Toast/ToastContext'
import { Signup } from '@/app/services/auth'


type FormValues = {
  fullName : string,
  email: string,
  password: string,
  agreeToTerms: boolean,
}


const validationSchema = Yup.object({
  fullName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Full name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  agreeToTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions'),
});


const SignupForm = () => {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false)
  const {showToast} = useToast()

  const handleSubmit = async( 
    values: FormValues,
    helpers: FormikHelpers<any>,
  ) =>{
    const {setSubmitting} = helpers

    try {
      setSubmitting(true)
      const { fullName, email, password } = values;
      const response = await Signup({fullName,email,password})

      showToast({
         message: "Your account has been created, please verify your email", 
         type: 'success', 
         duration: 1500 
      })
      
      setTimeout(() => {
        router.push("/success");
      }, 1600);
     
    } catch (error:any) {
      const errorCode = error.code || ""; 
      const errorMessage = mapAuthFirebaseError(errorCode);
      showToast({
         message: errorMessage || "Signup failed. Please try again.", 
         type: 'error', 
         duration: 3000 
      })
      
      
    }finally{
      // setSubmitting(false)
    }

  }

  return (
    <div className='flex flex-col gap-4 vsm:gap-6.5 bg-white p-8 max-tny:px-6 shadow-xl rounded-xl'>
        <div className="flex flex-col gap-4 vsm:gap-6">
            <Header title='Create your account' description='Post or complete small tasks — quick, easy, and rewarding.'/>
            <GoogleSignupButton/>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-[.8px] bg-gray-200 w-[50%]"></div>
          <p className="text-text-light">or</p>
          <div className="h-[.8px] bg-gray-200 w-[50%]"></div>
        </div>
        <div className="">
          <Formik 
            initialValues={{fullName:'', email: '', password: '', agreeToTerms: false,}}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({isSubmitting, errors, touched}) =>(
              <Form className='flex flex-col gap-3'>
                <div className="">
                  <p className="max-tny:text-sm mb-2">Full Name</p>
                  <Field
                    name="fullName"
                    type="text"
                    as={Input}
                    className={`${errors.fullName && touched.fullName ? 'ring-error border-error' : 'focus:ring-border-focus'}`}
                    placeholder="Enter your fullname"
                  
                  />
                  <ErrorMessage name='fullName' component='p' className='text-[11px] font-light text-error mt-1'/>
                </div>

                <div className="">
                  <p className="max-tny:text-sm mb-2">Email</p>
                  <Field
                    name="email"
                    type="email"
                    as={Input}
                    className={`${errors.email && touched.email ? 'ring-error border-error' : 'focus:ring-border-focus'}`}
                    placeholder="Enter your email"
                  
                  />
                  <ErrorMessage name='email' component='p' className='text-[11px] font-light text-error mt-1'/>
                </div>
                <div className="">
                  <p className="max-tny:text-sm mb-2">Password</p>
                  <div className="relative">
                    <Field
                      name="password"
                      type={!passwordVisible ? "password" : "text"}
                      as={Input}
                      className={`${errors.password && touched.password ? 'ring-error border-error' : 'focus:ring-border-focus'}`}
                      placeholder="Enter your password"
                    
                    />
                    <div className="absolute top-[35%] right-2 cursor-pointer" onClick={()=> setPasswordVisible(!passwordVisible)}>
                      {!passwordVisible ? <LuEyeClosed size={18}/> : <LuEye size={18}/> }
                    </div>
                  </div>
                 
                  <ErrorMessage name='password' component='p' className='text-[11px] font-light text-error mt-1'/>
                </div>


                <div className="flex flex-col gap-2 mt-1">
                   <div className="">
                      <div className="flex gap-1 items-start">
                        <Field
                          name="agreeToTerms"
                          type="checkbox"
                          className={`w-8 h-8 vsm:w-4 vsm:h-4 ${errors.agreeToTerms && touched.agreeToTerms ? 'border border-error' : 'focus:ring-[#009033]'}`}
                        />
                      <p className="max-tny:text-[12px] text-sm"> Yes, I understand and agree to the <Link href={'/'} className="text-primary underline">Terms and condition</Link ></p> 
                      </div>
                      <ErrorMessage name='agreeToTerms' component='p' className='text-[11px] font-light text-error mt-1'/>
                  </div>
                  <Button type="submit" variant={isSubmitting ? "disabled" : "primary"} className="w-full mt-1">
                    {isSubmitting ? 'Sigining up...' :'Sign up'}
                  </Button>
                  <h3 className="max-tny:text-sm">
                    Already have an account? <Link href={'/signin'} className='text-primary'>Log in</Link>
                  </h3>
                </div>
              </Form>
            )

            }
            
          </Formik>
        </div>
    </div>
  )
}

export default SignupForm
