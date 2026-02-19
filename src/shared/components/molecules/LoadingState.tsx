import { cn } from '@/shared/utils/cn';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

const LoadingState = ({ message = '로딩 중...', className }: LoadingStateProps) => {
  return (
    <div className={cn('rounded-xl border border-gray-200 bg-white p-16 text-center', className)}>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
};

export default LoadingState;
