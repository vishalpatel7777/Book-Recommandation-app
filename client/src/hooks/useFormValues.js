import { useState } from 'react';

export function useFormValues(initial) {
  const [values, setValues] = useState(initial);
  const change = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  return [values, change, setValues];
}
