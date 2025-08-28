import React, { useState } from 'react'
import DatePicker from '@/app/components/ui/DatePicker';
import { Input } from '@/app/components/ui/Input';
import { TagSelector } from '@/app/components/ui/TagSelector';
import { Textarea } from '@/app/components/ui/Textarea';
import { ErrorMessage, Field, Form, Formik, useFormikContext } from 'formik'
import { TbArrowBadgeDown } from "react-icons/tb";
import * as yup from "yup";
import { CreateTaskFormValues } from '../page';
import { Button } from '@/app/components/ui/Button';


const defaultSkillTags = [
    'design', 'translation', 'tailoring', 'web developemnt', 'errands', 'delivery', 'editing','canva','errand','graphics','writing','physical'
]

const Step2 = ({prevStep, nextStep}:any) => {
    const { values, errors, touched, setTouched, setFieldValue, setFieldTouched, validateForm } = useFormikContext<CreateTaskFormValues>();

    const handleNext = async () => {
        const touchedFields = {
            skillTags: true,
            tierRequirement: true,
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
        <div className="flex flex-col gap-6">
            <div className="">
                <TagSelector
                    allTags={defaultSkillTags}
                    selectedTags={values.skillTags}
                    setSelectedTags={(tags)=>{ setFieldTouched("skillTags", true); setFieldValue("skillTags", tags)}}
                />
                <ErrorMessage name='skillTags' component='p' className='text-xs font-light text-error mt-1'/>
                
            </div>
            <div className=""> 
                <p className="max-tny:text-sm font-medium mb-2">Tier Requirement</p>
                <div className={`flex overflow-hidden rounded border focus:ring-1 ${errors.tierRequirement && touched.tierRequirement ? 'ring-error border-error' : 'focus:ring-border-focus border-gray-300'}`}>
                    <span className="h-9 z-2 font-semibold text-3xl text-gray-400 tny:h-[41.34px] my-auto px-1 tny:px-2 bg-gray-200 rounded-l flex items-center justify-center">
                        <TbArrowBadgeDown />
                    </span>
                    <Field
                        name="tierRequirement"
                        as="select"
                        className={`border-none w-full px-2`}
                        
                    > 
                        <option value="" disabled>Select tier requirement</option>
                        {
                            [...Array(3)].map((_, i)=>(
                                <option key={i} value={i+1} >Tier {i+1}</option>

                            ))
                        
                        }

                    </Field>
                </div>
                
                <ErrorMessage name='tierRequirement' component='p' className='text-xs font-light text-error mt-1'/>
                
            </div>
        </div>
        <div className="flex justify-between gap-4">
            <Button onClick={prevStep} variant={'primary'} className="px-8">
                Prev
            </Button>
            <Button 
                onClick={handleNext}
                type="button"
                variant='primary' 
                className="px-8"
            >
                Next
            </Button>
        </div>
    </div>
  )
}

export default Step2
