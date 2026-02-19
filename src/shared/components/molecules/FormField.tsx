import { type ReactNode } from 'react';
import Label from '@/shared/components/atoms/Label';
import ErrorMessage from '@/shared/components/atoms/ErrorMessage';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

const FormField = ({ label, htmlFor, required = false, error, children }: FormFieldProps) => {
  return (
    <div className="flex items-start gap-4">
      <Label htmlFor={htmlFor} required={required} className="w-32 shrink-0 pt-2">
        {label}
      </Label>
      <div className="flex-1">
        {children}
        <ErrorMessage message={error} />
      </div>
    </div>
  );
};

export default FormField;
