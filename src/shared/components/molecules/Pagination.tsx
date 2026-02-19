import Button from '@/shared/components/atoms/Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

const Pagination = ({ page, totalPages, onPageChange, disabled = false }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1 || disabled}
      >
        이전
      </Button>
      <span className="text-sm text-gray-600">
        {page} / {totalPages}
      </span>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages || disabled}
      >
        다음
      </Button>
    </div>
  );
};

export default Pagination;
