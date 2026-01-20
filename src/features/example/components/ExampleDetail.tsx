import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';
import { useExampleDetail, useDeleteExample } from '../hooks/useExample';
import { getExampleStatusLabel } from '../utils/status.utils';

const ExampleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const exampleId = id ? Number(id) : 0;
  const navigate = useNavigate();

  const detailQuery = useExampleDetail(exampleId);
  const deleteMutation = useDeleteExample();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleBack = () => {
    void navigate(`${ROUTES.DASHBOARD}${ROUTES.EXAMPLE.LIST}`);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(exampleId, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        void navigate(`${ROUTES.DASHBOARD}${ROUTES.EXAMPLE.LIST}`);
      },
    });
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  if (detailQuery.isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-16 text-center">
        <p className="text-sm text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-sm text-red-600">데이터를 불러오는 중 오류가 발생했습니다.</p>
        <button
          type="button"
          onClick={() => void detailQuery.refetch()}
          className="mt-4 px-4 py-2 bg-white border border-gray-200 rounded-md text-sm"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const example = detailQuery.data;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={handleBack}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← 뒤로가기
          </button>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void navigate(`${ROUTES.DASHBOARD}${ROUTES.EXAMPLE.EDIT(example.id)}`)}
            className="px-4 py-2 bg-black text-white rounded-md text-sm"
          >
            수정하기
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm disabled:opacity-50"
          >
            삭제하기
          </button>
          <button
            type="button"
            onClick={() => void navigate(`${ROUTES.DASHBOARD}${ROUTES.EXAMPLE.LIST}`)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm"
          >
            목록으로
          </button>
        </div>
      </header>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Example 상세</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 py-2">
            <label className="text-sm font-semibold text-gray-500 w-32 shrink-0">제목</label>
            <p className="text-sm text-gray-900 text-left">{example.name || '-'}</p>
          </div>
          <div className="flex items-center gap-4 py-2">
            <label className="text-sm font-semibold text-gray-500 w-32 shrink-0">내용</label>
            <p className="text-sm text-gray-900 text-left">{example.description || '-'}</p>
          </div>
          <div className="flex items-center gap-4 py-2">
            <label className="text-sm font-semibold text-gray-500 w-32 shrink-0">상태</label>
            <p className="text-sm text-gray-900 text-left">
              {getExampleStatusLabel(example.status)}
            </p>
          </div>
        </div>
      </section>

      {/* 삭제 확인 모달 */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">항목 삭제</h3>
            <p className="text-sm text-gray-600 mb-6">이 항목을 삭제하시겠습니까?</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCloseDeleteModal}
                className="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExampleDetail;
