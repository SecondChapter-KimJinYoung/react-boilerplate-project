import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';
import { useExampleList } from '../hooks/useExampleList';
import { EXAMPLE_TABLE_HEAD } from '../constants/example.constants';

const ExampleList = () => {
  const navigate = useNavigate();
  const table = useExampleList();

  const handleDetail = (id: number) => {
    void navigate(`${ROUTES.DASHBOARD}${ROUTES.EXAMPLE.DETAIL(id)}`);
  };

  if (table.status.isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-sm text-red-600">데이터를 불러오는 중 오류가 발생했습니다.</p>
        <button
          type="button"
          onClick={table.actions.handleRefetch}
          className="mt-4 px-4 py-2 bg-white border border-gray-200 rounded-md text-sm"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* 헤더 */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900">Example 목록</h1>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">전체 목록 수</span>
            <span className="text-sm font-semibold text-gray-900">
              {table.data.total.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <div>
              <form onSubmit={table.filter.handleSearchSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    value={table.filter.searchInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      table.filter.setSearchInput(e.target.value)
                    }
                    placeholder="검색어를 입력하세요"
                    className="px-4 py-2 border border-gray-200 rounded-md text-sm w-64"
                  />
                  {table.filter.searchInput && (
                    <button
                      type="button"
                      onClick={table.filter.handleSearchClear}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  )}
                </div>
              </form>
            </div>
            <button
              type="button"
              onClick={table.actions.handleDelete}
              disabled={table.selection.selected.length === 0 || table.actions.isDeleting}
              className="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm disabled:opacity-50"
            >
              선택항목 삭제
            </button>
            <button
              type="button"
              onClick={() => void navigate(`${ROUTES.DASHBOARD}${ROUTES.EXAMPLE.CREATE}`)}
              className="px-4 py-2 bg-black text-white rounded-md text-sm flex items-center gap-1"
            >
              추가하기
            </button>
          </div>
        </div>

        {/* 테이블 */}
        <div className="border-t border-gray-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="w-[40px] border-b border-gray-200 text-center">
                    <input
                      type="checkbox"
                      checked={
                        table.data.list.length > 0 &&
                        table.selection.selected.length === table.data.list.length
                      }
                      onChange={table.selection.toggleSelectAll}
                      className="cursor-pointer"
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
                  table.data.list.map((item) => (
                    <tr key={item.id} className="group transition-colors hover:bg-gray-50">
                      <td className="w-[40px] border-b border-gray-200 text-center">
                        <div className="flex items-center justify-center py-3">
                          <input
                            type="checkbox"
                            checked={table.selection.selected.includes(item.id)}
                            onChange={() => table.selection.toggleSelect(item.id)}
                            className="cursor-pointer"
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
                        <button
                          type="button"
                          onClick={() => handleDetail(item.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          상세보기
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 페이지네이션 */}
        {table.data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => table.pagination.setPage(Math.max(1, table.data.page - 1))}
              disabled={table.data.page === 1 || table.status.isFetching}
              className="px-3 py-1 border border-gray-200 rounded-md text-sm disabled:opacity-50"
            >
              이전
            </button>
            <span className="text-sm text-gray-600">
              {table.data.page} / {table.data.totalPages}
            </span>
            <button
              type="button"
              onClick={() =>
                table.pagination.setPage(Math.min(table.data.totalPages, table.data.page + 1))
              }
              disabled={table.data.page === table.data.totalPages || table.status.isFetching}
              className="px-3 py-1 border border-gray-200 rounded-md text-sm disabled:opacity-50"
            >
              다음
            </button>
          </div>
        )}
      </div>

      {/* 선택 항목 삭제 모달 */}
      {table.modals.delete.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">선택 항목 삭제</h3>
            <p className="text-sm text-gray-600 mb-6">
              선택한 {table.selection.selected.length}개의 항목을 삭제하시겠습니까?
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={table.modals.delete.onClose}
                className="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm"
              >
                취소
              </button>
              <button
                type="button"
                onClick={table.modals.delete.onConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 개별 항목 삭제 모달 */}
      {table.modals.deleteItem.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">항목 삭제</h3>
            <p className="text-sm text-gray-600 mb-6">이 항목을 삭제하시겠습니까?</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={table.modals.deleteItem.onClose}
                className="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm"
              >
                취소
              </button>
              <button
                type="button"
                onClick={table.modals.deleteItem.onConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExampleList;
