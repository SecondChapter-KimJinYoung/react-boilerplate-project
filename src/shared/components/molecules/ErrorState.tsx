import { cn } from '@/shared/utils/cn';
import Button from '@/shared/components/atoms/Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorState = ({
  message = '데이터를 불러오는 중 오류가 발생했습니다.',
  onRetry,
  className,
}: ErrorStateProps) => {
  return (
    <div className={cn('rounded-xl border border-red-200 bg-red-50 p-8 text-center', className)}>
      <p className="text-sm text-red-600">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="mt-4">
          다시 시도
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
