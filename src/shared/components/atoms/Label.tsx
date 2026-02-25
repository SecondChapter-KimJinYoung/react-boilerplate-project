import { type LabelHTMLAttributes } from 'react';

import { cn } from '@/shared/utils/cn';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = ({ required = false, className, children, ...props }: LabelProps) => {
  return (
    <label className={cn('text-sm font-semibold text-gray-500', className)} {...props}>
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
};

export default Label;
