import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ROUTES } from '@/routes/routes';
import Button from '@/shared/components/atoms/Button';
import Label from '@/shared/components/atoms/Label';
import ErrorState from '@/shared/components/molecules/ErrorState';
import LoadingState from '@/shared/components/molecules/LoadingState';
import ConfirmDialog from '@/shared/components/organisms/ConfirmDialog';

import { useDeleteExample, useExampleDetail } from '../hooks/useExample';
import { getExampleStatusLabel } from '../utils/status.utils';

const ExampleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const exampleId = id ? Number(id) : 0;
  const navigate = useNavigate();

  const detailQuery = useExampleDetail(exampleId);
  const deleteMutation = useDeleteExample();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleConfirmDelete = () => {
    deleteMutation.mutate(exampleId, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        void navigate(`${ROUTES.EXAMPLE.LIST}`);
      },
    });
  };

  if (detailQuery.isLoading) {
    return <LoadingState />;
  }

  if (detailQuery.isError || !detailQuery.data) {
    return <ErrorState onRetry={() => void detailQuery.refetch()} />;
  }

  const example = detailQuery.data;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <Button variant="link" onClick={() => void navigate(`${ROUTES.EXAMPLE.LIST}`)}>
          ← 뒤로가기
        </Button>
        <div className="flex gap-2">
          <Button onClick={() => void navigate(`${ROUTES.EXAMPLE.EDIT(example.id)}`)}>
            수정하기
          </Button>
          <Button
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={deleteMutation.isPending}
          >
            삭제하기
          </Button>
          <Button variant="secondary" onClick={() => void navigate(`${ROUTES.EXAMPLE.LIST}`)}>
            목록으로
          </Button>
        </div>
      </header>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Example 상세</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 py-2">
            <Label className="w-32 shrink-0">제목</Label>
            <p className="text-sm text-gray-900">{example.name || '-'}</p>
          </div>
          <div className="flex items-center gap-4 py-2">
            <Label className="w-32 shrink-0">내용</Label>
            <p className="text-sm text-gray-900">{example.description || '-'}</p>
          </div>
          <div className="flex items-center gap-4 py-2">
            <Label className="w-32 shrink-0">상태</Label>
            <p className="text-sm text-gray-900">{getExampleStatusLabel(example.status)}</p>
          </div>
        </div>
      </section>

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="항목 삭제"
        description="이 항목을 삭제하시겠습니까?"
        confirmLabel="삭제"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default ExampleDetailPage;
