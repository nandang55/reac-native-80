// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import React, { createContext, useState } from 'react';

type FormRegisterValues = {
  fullname: string;
  phone: string;
  phone_cc: string;
  email: string;
};

export const initialFormRegisterValues = {
  fullname: '',
  phone: '',
  phone_cc: '',
  email: '',
  is_email_notification: false
};

type FormRegisterContextType = {
  formValues: FormRegisterValues;
  setFormValues: React.Dispatch<React.SetStateAction<FormRegisterValues>>;
};

export const FormRegisterContext = createContext<FormRegisterContextType>({
  formValues: initialFormRegisterValues,
  setFormValues: () => undefined
});

const AppFormRegisterContext = ({ children }: { children: React.ReactNode }) => {
  const [formValues, setFormValues] = useState<FormRegisterValues>(initialFormRegisterValues);
  return (
    <FormRegisterContext.Provider value={{ formValues, setFormValues }}>
      {children}
    </FormRegisterContext.Provider>
  );
};

export default AppFormRegisterContext;
