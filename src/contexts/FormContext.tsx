import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FormData, EmbassyFormType, EMBASSY_FORMS } from '../types';

interface FormContextType {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  resetFormData: () => void;
  selectedFormType: EmbassyFormType;
  setSelectedFormType: (type: EmbassyFormType) => void;
  getSelectedFormInfo: () => typeof EMBASSY_FORMS[0];
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  fatherName: '',
  caseType: 'individual',
  familyCount: 1,
  passportNumber: '',
  dateOfBirth: '',
  sonsCount: 0,
  daughtersCount: 0,
  sonsNames: [],
  daughtersNames: [],
  country: 'افغانستان',
  province: 'کابل',
  whatsappNumber: '',
  emergencyContact: '',
  email: '',
  q1SecurityProblems: '',
  q2PriorFilings: '',
  q3ProofFiles: '',
  q4TransitBudget: '',
  q5PassportValidity: '',
  q6DocumentUpload: '',
  uploadedDocument: null,
  q7ReferenceChannel: [],
  q8AwarenessSource: [],
  q9LegalDocs: [],
  q10PortraitFiles: [],
  termsAccepted: '',
  rejectionReason: '',
  formType: 'australia'
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [selectedFormType, setSelectedFormType] = useState<EmbassyFormType>('australia');

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetFormData = () => {
    setFormData(initialFormData);
  };

  const getSelectedFormInfo = () => {
    return EMBASSY_FORMS.find(f => f.id === selectedFormType) || EMBASSY_FORMS[0];
  };

  return (
    <FormContext.Provider value={{
      formData,
      updateFormData,
      resetFormData,
      selectedFormType,
      setSelectedFormType,
      getSelectedFormInfo
    }}>
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within FormProvider');
  }
  return context;
}
