import { ErrorMessage, Field, useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react'
import { CreateTaskFormValues } from '../page';
import { Button } from '@/app/components/ui/Button';
import { fetchNigeriaGeoData } from '@/app/services/location';
import {NIGERIA_LOCATIONS} from '@/utils/nigeriaLocations';
import { Input } from '@/app/components/ui/Input';

const Step4 = ({prevStep, nextStep}:any) => {
    const { values, errors, touched, isSubmitting, setFieldValue, setFieldTouched, validateForm, setTouched, handleSubmit } = useFormikContext<CreateTaskFormValues>();
    
    const [stateValue, setStateValue] = useState("") 
    const [cityValue, setCityValue] = useState("") 

    const states = Object.keys(NIGERIA_LOCATIONS).sort()
    const city = values.state ? NIGERIA_LOCATIONS[values.state] : []

//    const handleNext = async () => {
//         if (values.isRemote) {
//             nextStep();
            
//         }else{
//             const touchedFields = {
//                 state: true,
//                 city: true,
//                 location: true,
//             };
//             setTouched(touchedFields, true);

//             const stepErrors = await validateForm();

//             const hasErrors = Object.keys(stepErrors).some(key => key in touchedFields);

//             if (!hasErrors) {
//                 nextStep();
//             }
//         }
//     };

    const handleIsRmeote = async () => {
        const touchedFields = {
                state: false,
                city: false,
                location: false,
            };
        setTouched(touchedFields, false);

        // const stepErrors = await validateForm();
        setFieldValue("isRemote", !values.isRemote)
    }
   

  return (
     <div className='flex flex-col h-full flex-1 justify-between'>
        <div className="flex flex-col gap-6">
            <div className={`flex flex-col ${values.isRemote ? 'opacity-40':''}`}>
                <p className="max-tny:text-sm font-medium mb-2">Select State</p>

                <Field
                    name="state" 
                    as="select"
                    disabled={values.isRemote}
                    className={`text-sm p-2 rounded border focus:ring-1 max-h-10  ${errors.state && touched.state ? 'ring-error border-error' : 'focus:ring-border-focus border-gray-300'}`}
                    // onChange={handleStateChange}
                    // aria-label='State'
                >
                        <option value="" className='text-sm'>Select State</option>
                        {
                            states.map((s)=>(
                                <option key={s} value={s}>{s}</option>
                            ))
                        }
                </Field>
                <ErrorMessage name='state' component='p' className='text-xs font-light text-error mt-1'/>

            </div>
            <div className={`flex flex-col ${values.isRemote ? 'opacity-40':''}`}>
                <p className="max-tny:text-sm font-medium mb-2">Select City</p>

                <Field
                    name="city" 
                    as="select"
                    className={`text-sm p-2 rounded border focus:ring-1 max-h-10 ${!values.isRemote && !values.state ? 'bg-gray-100 text-gray-400' :''} ${errors.city && touched.city ? 'ring-error border-error' : 'focus:ring-border-focus border-gray-300'}`}

                    // aria-label='lga'
                    disabled={!values.state || values.isRemote}
                >
                        <option value="" className='text-sm'>Select City</option>
                        {
                            values.state && city.map((s:any)=>(
                                <option key={s} value={s}>{s}</option>
                            ))
                        }
                </Field>
                <ErrorMessage name='city' component='p' className='text-xs font-light text-error mt-1'/>

            </div>
            <div className={`flex flex-col ${values.isRemote ? 'opacity-40':''}`}>
                <p className="max-tny:text-sm font-medium mb-2">Location</p>
                <Field
                    name="location"
                    type="text"
                    as={Input}
                    disabled={values.isRemote}
                    className={`${errors.location && touched.location ? 'ring-error border-error' : 'focus:ring-border-focus'}`}
                    placeholder="Enter Location"
                    
                />
                <ErrorMessage name='location' component='p' className='text-xs font-light text-error mt-1'/>
            </div>
            <div className="flex items-center gap-2 mt-1">
                <div
                    onClick={handleIsRmeote}
                    className="flex items-center justify-center cursor-pointer h-5 w-5 border border-gray-300 rounded-full p-[3px]"
                >
                    <div className={`h-full w-full rounded-full ${values.isRemote ? 'bg-primary' : 'bg-transparent'}`}></div>
                </div>
                <p className='font-medium'>Is this task Remote ?</p>
            </div>
        </div>

        <div className="flex justify-between gap-4">
            <Button onClick={prevStep} variant={'primary'} className="px-8">
                Prev
            </Button>
            <Button 
                onClick={()=> handleSubmit()}
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

export default Step4
