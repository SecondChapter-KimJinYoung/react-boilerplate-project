import type { InputHTMLAttributes, Ref } from 'react';

import { cn } from '@/shared/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  ref?: Ref<HTMLInputElement>;
}

const Input = ({ error = false, ref, className, ...props }: InputProps) => {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full px-3 py-2 border rounded-md text-sm transition-colors',
        'focus:outline-none focus:ring-1',
        error
          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-200 focus:border-gray-400 focus:ring-gray-400',
        'disabled:bg-gray-50 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  );
};

export default Input;
