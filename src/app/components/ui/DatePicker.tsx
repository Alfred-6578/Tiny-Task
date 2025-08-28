import React from "react";
import DatePicker from "react-datepicker";
import { useField, useFormikContext } from "formik";
import { Calendar } from "lucide-react";

interface DatePickerFieldProps {
  name: string;
  label: string;
  minDate?: Date;
  maxDate?: Date;
  showTimeSelect?: boolean;
  placeholder?: string;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  name,
  label,
  minDate,
  maxDate,
  showTimeSelect = false,
  placeholder = "Select a date",
}) => {
  const [field, meta] = useField(name);
  const {
    setFieldValue,
    setFieldTouched,
    validateForm
  } = useFormikContext();

  const handleChange = async (val: Date | null) => {
    if (val) {
      const updatedDate = new Date(val);

      if (
        updatedDate.getHours() === 0 &&
        updatedDate.getMinutes() === 0 &&
        updatedDate.getSeconds() === 0
      ) {
        updatedDate.setHours(12, 0, 0, 0);
      }

      await setFieldValue(name, updatedDate.toISOString(), true);
      await setFieldTouched(name, true, true);
      await validateForm(); // force full form validation immediately
    } else {
      await setFieldValue(name, null, true);
      await setFieldTouched(name, true, true);
      await validateForm();
    }
  };

  return (
    <div className="w-full">
      <label htmlFor={name} className="block font-medium max-tny:text-sm mb-2">
        {label}
      </label>

      <div
        className={`flex items-center border rounded-md focus:outline-none focus:ring-2 ${
          meta.touched && meta.error
            ? "border-red-500 focus:ring-red-300"
            : "border-gray-300 focus:ring-blue-300"
        }`}
      >
        <span className="h-9 tny:h-[41.34px] my-auto px-3 tny:px-4 bg-gray-200 rounded-l flex items-center justify-center">
          <Calendar className="max-tny:w-[20px] text-gray-400" />
        </span>

        <DatePicker
          id={name}
          selected={field.value ? new Date(field.value) : null}
          onChange={handleChange}
          onBlur={() => setFieldTouched(name, true, true)}
          dateFormat={showTimeSelect ? "Pp" : "yyyy-MM-dd"}
          placeholderText={placeholder}
          className="w-full px-3 py-2 text-sm"
          minDate={minDate}
          maxDate={maxDate}
          showTimeSelect={showTimeSelect}
        />
      </div>

      {meta.touched && meta.error && (
        <div className="text-xs font-light text-red-500 mt-1">
          {meta.error}
        </div>
      )}
    </div>
  );
};

export default DatePickerField;
