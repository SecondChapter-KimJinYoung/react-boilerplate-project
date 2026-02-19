import { type SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/utils/cn';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  error?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, error = false, className, ...props }, ref) => {
    return (
      <select
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
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  },
);

Select.displayName = 'Select';

export default Select;
