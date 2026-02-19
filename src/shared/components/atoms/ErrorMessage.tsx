import { cn } from '@/shared/utils/cn';

interface ErrorMessageProps {
  message?: string;
  className?: string;
}

const ErrorMessage = ({ message, className }: ErrorMessageProps) => {
  if (!message) return null;

  return <p className={cn('mt-1 text-sm text-red-600', className)}>{message}</p>;
};

export default ErrorMessage;
