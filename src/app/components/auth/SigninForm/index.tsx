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
import { Signin, Signup } from '@/app/services/auth'


type FormValues = {
  email: string,
  password: string,
}

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});


const SigninForm = () => {
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
            const {email, password } = values;
            const response = await Signin({email,password})

            showToast({
                message: "Login Succesful", 
                type: 'success', 
                duration: 1500 
            })
            
            setTimeout(() => {
            router.push("/");
            }, 1600);
            
        } catch (error:any) {
            const errorCode = error.code || ""; 
            const errorMessage = mapAuthFirebaseError(errorCode);
            showToast({
                message: errorMessage || "Login failed. Please try again.", 
                type: 'error', 
                duration: 3000 
            })
        }finally{
            setSubmitting(false)
        }
    }
    

  return (
    <div className='flex flex-col gap-4 bg-white p-8 max-tny:px-6 shadow-xl rounded-xl'>
        <div className="flex flex-col gap-4 vsm:gap-6">
            <Header title='Welcome Back!' description='Log in to access your dashboard and manage tasks with ease.'/>
            <GoogleSignupButton/>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-[.8px] bg-gray-200 w-[50%]"></div>
          <p className="text-text-light">or</p>
          <div className="h-[.8px] bg-gray-200 w-[50%]"></div>
        </div>
        <div className="">
          <Formik 
            initialValues={{email: '', password: ''}}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({isSubmitting, errors, touched}) =>(
              <Form className='flex flex-col gap-3'>
            
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
                   
                  <Button type="submit" variant={isSubmitting ? "disabled" : "primary"} className="w-full mt-1">
                    {isSubmitting ? 'Sigining in...' :'Sign in'}
                  </Button>
                  <h3 className="max-tny:text-sm">
                    Don't have an account? <Link href={'/signup'} className='text-primary'>Sign up</Link>
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

export default SigninForm
