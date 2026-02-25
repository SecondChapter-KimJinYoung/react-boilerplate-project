import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '@/shared/utils/cn';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="checkbox"
      className={cn('cursor-pointer accent-black disabled:cursor-not-allowed', className)}
      {...props}
    />
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
