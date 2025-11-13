import { useState, useRef } from 'react';

export const useForm = (initialState = {}) => {
  const initialStateRef = useRef(initialState);
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const setFieldValue = (name, value) => {
    setValues({
      ...values,
      [name]: value
    });
  };

  const setFieldError = (name, error) => {
    setErrors({
      ...errors,
      [name]: error
    });
  };

  const reset = () => {
    setValues(initialStateRef.current);
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    setFieldValue,
    setFieldError,
    setErrors,
    setValues,
    reset
  };
};
