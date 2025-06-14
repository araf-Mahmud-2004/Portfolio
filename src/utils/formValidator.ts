import { ERROR } from './constants';
import { ContactSectionState } from '../components/ContactSection';

export interface FormField {
  value: string;
  error?: string;
  isValid?: boolean;
}

export interface FormState {
  name: FormField;
  email: FormField;
  message: FormField;
}

export const validateForm = (form: ContactSectionState): ContactSectionState => {
  const validatedState: ContactSectionState = {
    name: { ...form.name },
    email: { ...form.email },
    message: { ...form.message },
    isSubmitting: form.isSubmitting,
    lastSubmission: form.lastSubmission,
    submissionCount: form.submissionCount,
  };

  // Validate name
  if (!form.name.value.trim()) {
    validatedState.name = { ...form.name, error: ERROR.CONTACT_FORM.REQUIRED, isValid: false };
  } else {
    validatedState.name = { ...form.name, isValid: true };
  }

  // Validate email
  if (!form.email.value.trim()) {
    validatedState.email = { ...form.email, error: ERROR.CONTACT_FORM.REQUIRED, isValid: false };
  } else if (!/^\S+@\S+\.\S+$/.test(form.email.value)) {
    validatedState.email = { ...form.email, error: ERROR.CONTACT_FORM.EMAIL, isValid: false };
  } else {
    validatedState.email = { ...form.email, isValid: true };
  }

  // Validate message
  if (!form.message.value.trim()) {
    validatedState.message = { ...form.message, error: ERROR.CONTACT_FORM.REQUIRED, isValid: false };
  } else if (form.message.value.length < 10) {
    validatedState.message = { ...form.message, error: ERROR.CONTACT_FORM.MESSAGE, isValid: false };
  } else {
    validatedState.message = { ...form.message, isValid: true };
  }

  return validatedState;
};
