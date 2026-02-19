import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';
import { useExampleList } from '../hooks/useExampleList';
import { EXAMPLE_TABLE_HEAD } from '../constants/example.constants';
import type { ExampleItem } from '@/api/example/example.types';
import Button from '@/shared/components/atoms/Button';
import Checkbox from '@/shared/components/atoms/Checkbox';
import SearchInput from '@/shared/components/molecules/SearchInput';
import Pagination from '@/shared/components/molecules/Pagination';
import ErrorState from '@/shared/components/molecules/ErrorState';
import ConfirmDialog from '@/shared/components/organisms/ConfirmDialog';

const ExampleListPage = () => {
  const navigate = useNavigate();
  const table = useExampleList();

  const handleDetail = (id: number) => {
    void navigate(`${ROUTES.EXAMPLE.DETAIL(id)}`);
  };

  if (table.status.isError) {
    return <ErrorState onRetry={table.actions.handleRefetch} />;
  }

  return (
    <>
      <div className="space-y-4">
        {/* 헤더 */}
        <h1 className="text-2xl font-bold text-gray-900">Example 목록</h1>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">전체 목록 수</span>
            <span className="text-sm font-semibold text-gray-900">
              {table.data.total.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <SearchInput
              value={table.filter.searchInput}
              onChange={table.filter.setSearchInput}
              onSubmit={table.filter.handleSearchSubmit}
              onClear={table.filter.handleSearchClear}
            />
            <Button
              variant="secondary"
              onClick={table.actions.handleDelete}
              disabled={table.selection.selected.length === 0 || table.actions.isDeleting}
            >
              선택항목 삭제
            </Button>
            <Button onClick={() => void navigate(`${ROUTES.EXAMPLE.CREATE}`)}>추가하기</Button>
          </div>
        </div>

        {/* 테이블 */}
        <div className="border-t border-gray-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="w-[40px] border-b border-gray-200 text-center">
                    <Checkbox
                      checked={
                        table.data.list.length > 0 &&
                        table.selection.selected.length === table.data.list.length
                      }
                      onChange={table.selection.toggleSelectAll}
                    />
                  </th>
                  {EXAMPLE_TABLE_HEAD.map((column) => (
                    <th
                      key={column.id}
                      className="border-b border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.status.isLoading ? (
                  <tr>
                    <td
                      colSpan={EXAMPLE_TABLE_HEAD.length + 1}
                      className="p-16 text-center text-sm text-gray-500"
                    >
                      로딩 중...
                    </td>
                  </tr>
                ) : table.data.list.length === 0 ? (
                  <tr>
                    <td
                      colSpan={EXAMPLE_TABLE_HEAD.length + 1}
                      className="p-16 text-center text-sm text-gray-500"
                    >
                      데이터가 없습니다.
                    </td>
                  </tr>
                ) : (
                  table.data.list.map((item: ExampleItem) => (
                    <tr key={item.id} className="group transition-colors hover:bg-gray-50">
                      <td className="w-[40px] border-b border-gray-200 text-center">
                        <div className="flex items-center justify-center py-3">
                          <Checkbox
                            checked={table.selection.selected.includes(item.id)}
                            onChange={() => table.selection.toggleSelect(item.id)}
                          />
                        </div>
                      </td>
                      <td className="border-b border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900">
                        {item.name || '-'}
                      </td>
                      <td className="border-b border-gray-200 px-4 py-3 text-left text-sm text-gray-600">
                        {item.userId || '-'}
                      </td>
                      <td className="border-b border-gray-200 px-4 py-3 text-left text-sm text-gray-600">
                        {item.email || '-'}
                      </td>
                      <td className="border-b border-gray-200 px-4 py-3 text-center">
                        <Button variant="link" onClick={() => handleDetail(item.id)}>
                          상세보기
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 페이지네이션 */}
        <Pagination
          page={table.data.page}
          totalPages={table.data.totalPages}
          onPageChange={table.pagination.setPage}
          disabled={table.status.isFetching}
        />
      </div>

      {/* 선택 항목 삭제 모달 */}
      <ConfirmDialog
        isOpen={table.modals.delete.isOpen}
        title="선택 항목 삭제"
        description={`선택한 ${table.selection.selected.length}개의 항목을 삭제하시겠습니까?`}
        confirmLabel="삭제"
        onConfirm={table.modals.delete.onConfirm}
        onCancel={table.modals.delete.onClose}
      />

      {/* 개별 항목 삭제 모달 */}
      <ConfirmDialog
        isOpen={table.modals.deleteItem.isOpen}
        title="항목 삭제"
        description="이 항목을 삭제하시겠습니까?"
        confirmLabel="삭제"
        onConfirm={table.modals.deleteItem.onConfirm}
        onCancel={table.modals.deleteItem.onClose}
      />
    </>
  );
};

export default ExampleListPage;
