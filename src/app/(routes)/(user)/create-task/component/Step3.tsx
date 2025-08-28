import React, { useState } from 'react'
import DatePicker from '@/app/components/ui/DatePicker';
import { CreateTaskFormValues } from '../page';
import { Button } from '@/app/components/ui/Button';
import { useFormikContext } from 'formik';


const Step3 = ({prevStep, nextStep}:any) => {
    const { values, errors, touched, isSubmitting, setFieldValue, setFieldTouched, validateForm, setTouched } = useFormikContext<CreateTaskFormValues>();

    const handleNext = async () => {
        const touchedFields = {
            applicationDeadline: true,
            taskDeadline: true,
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
        <div className="flex flex-col-reverse gap-6">  
          <DatePicker
              name='taskDeadline'
              label='Task Deadline'
              minDate={new Date()}
              showTimeSelect
          />

          <DatePicker
              name='applicationDeadline'
              label='Application Deadline'
              minDate={new Date()}
              showTimeSelect
          />

        </div>
        <div className="flex justify-between gap-5">
            <Button onClick={prevStep} variant={'primary'} className="px-8">
                Prev
            </Button>
            <Button 
              onClick={handleNext}
              variant='primary' 
              className="px-8"
            >
                  Next
            </Button>
        </div>
           
    </div>
  )
}

export default Step3
