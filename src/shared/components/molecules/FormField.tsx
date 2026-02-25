import { type ReactNode } from 'react';

import ErrorMessage from '@/shared/components/atoms/ErrorMessage';
import Label from '@/shared/components/atoms/Label';
import { cn } from '@/shared/utils/cn';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  /** 레이아웃 방향 (기본값: horizontal) */
  direction?: 'horizontal' | 'vertical';
  /** horizontal 모드에서 라벨 너비 (기본값: w-32) */
  labelWidth?: string;
}

const FormField = ({
  label,
  htmlFor,
  required = false,
  error,
  children,
  direction = 'horizontal',
  labelWidth = 'w-32',
}: FormFieldProps) => {
  const isVertical = direction === 'vertical';

  return (
    <div className={cn(isVertical ? 'flex flex-col gap-1' : 'flex items-start gap-4')}>
      <Label
        htmlFor={htmlFor}
        required={required}
        className={cn(isVertical ? '' : `${labelWidth} shrink-0 pt-2`)}
      >
        {label}
      </Label>
      <div className={cn(isVertical ? '' : 'flex-1')}>
        {children}
        <ErrorMessage message={error} />
      </div>
    </div>
  );
};

export default FormField;
