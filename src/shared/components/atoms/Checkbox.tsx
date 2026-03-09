import type { InputHTMLAttributes, Ref } from 'react';

import { cn } from '@/shared/utils/cn';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  ref?: Ref<HTMLInputElement>;
}

const Checkbox = ({ ref, className, ...props }: CheckboxProps) => {
  return (
    <input
      ref={ref}
      type="checkbox"
      className={cn('cursor-pointer accent-black disabled:cursor-not-allowed', className)}
      {...props}
    />
  );
};

export default Checkbox;
