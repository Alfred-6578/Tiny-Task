import React, { useMemo, useState } from 'react'
import { Input } from '@/app/components/ui/Input';
import { Textarea } from '@/app/components/ui/Textarea';
import { ErrorMessage, Field, Form, Formik, useFormikContext } from 'formik'
import { Button } from '@/app/components/ui/Button';
import { CreateTaskFormValues } from '../page';
import * as Yup from "yup";

const Step1 = ({nextStep}:any) => {
    const { values, errors, touched, isSubmitting, setFieldValue, setFieldTouched, validateForm, setErrors, setTouched } = useFormikContext<CreateTaskFormValues>();


    const handleNext = async () => {
        const touchedFields = {
            title: true,
            description: true,
            price: true,
        };
        setTouched(touchedFields, true);

        const stepErrors = await validateForm();

        const hasErrors = Object.keys(stepErrors).some(key => key in touchedFields);

        if (!hasErrors) {
            nextStep();
        }
    };

       
  return (
    <div className='flex flex-col h-full flex-1 justify-between'>

        <div className="flex flex-col gap-5">
            <div className="">
                <p className="max-tny:text-sm font-medium mb-2">Task Title</p>
                <Field
                    name="title"
                    type="text"
                    as={Input}
                    className={`${errors.title && touched.title ? 'ring-error border-error' : 'focus:ring-border-focus'}`}
                    placeholder="Enter task title"
                    
                />
                <ErrorMessage name='title' component='p' className='text-xs font-light text-error mt-1'/>
            </div>
            <div className="">
                <p className="max-tny:text-sm font-medium mb-2">Description</p>
                <Field
                    name="description"
                    type="text"
                    as={Textarea}
                    className={`${errors.description && touched.description ? 'ring-error border-error' : 'focus:ring-border-focus'}`}
                    placeholder="Be clear about what you need, expected results and tools"
                    
                />
                <ErrorMessage name='description' component='p' className='text-xs font-light text-error mt-1'/>
            </div>
        
            <div className="w-full">
                <p className="max-tny:text-sm font-medium mb-2">Task Budget</p>
                <div className={`flex overflow-hidden rounded border focus:ring-1 ${errors.price && touched.price ? 'ring-error border-error' : 'focus:ring-border-focus border-gray-300'}`}>
                    <span className="h-10 z-2 font-semibold text-gray-400 tny:h-[41.34px] my-auto px-3 tny:px-4 bg-gray-200 rounded-l flex items-center justify-center">
                        ₦
                    </span>
                    <Field
                        name="price"
                        type="text"
                        as={Input}
                        className={`border-none focus-visible:ring-0`}
                        placeholder="Enter task price"
                        
                    />
                </div>
                
                <ErrorMessage name='price' component='p' className='text-xs font-light text-error mt-1'/>
            </div>

            <div className="flex items-center gap-2 mt-1">
                <div
                    onClick={()=> setFieldValue("isUrgent", !values.isUrgent)}
                    className="flex items-center justify-center cursor-pointer h-5 w-5 border border-gray-300 rounded-full p-[3px]"
                >
                    <div className={`h-full w-full rounded-full ${values.isUrgent ? 'bg-primary' : 'bg-transparent'}`}></div>
                </div>
                <p className='font-medium'>Is this task Urgent ?</p>
            </div>
        </div>
        <div className="flex justify-end">
            <Button 
               onClick={handleNext}
                type="button"
                variant={'primary'} 
                className="px-8"
            >
                Next
            </Button>
        </div>
           
    </div>
  )
}

export default Step1
