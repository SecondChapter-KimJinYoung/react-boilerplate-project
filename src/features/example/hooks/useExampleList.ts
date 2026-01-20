/**
 * Example 목록 테이블 훅
 *
 * 테이블 상태 관리:
 * - 페이지네이션
 * - 검색/필터
 * - 선택 상태
 * - 모달 상태
 */

import { useState, useMemo } from 'react';
import { useExampleListQuery, useDeleteManyExamples } from './useExample';

type OrderBy = 'ASC' | 'DESC';

const PAGE_SIZE = 10;

export const useExampleList = () => {
  // ============ State ============
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [orderBy, setOrderBy] = useState<OrderBy>('ASC');
  const [sortInput, setSortInput] = useState('createdAt');
  const [orderByInput, setOrderByInput] = useState<OrderBy>('ASC');
  const [selected, setSelected] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [isDeleteItemModalOpen, setIsDeleteItemModalOpen] = useState(false);

  // ============ Data (API 사용) ============
  const query = useExampleListQuery({ page, size: PAGE_SIZE, keyword, sort, orderBy });
  const deleteManyMutation = useDeleteManyExamples();

  const list = query.data?.list || [];
  const total = query.data?.totalCount || 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const isLoading = query.isLoading;
  const isFetching = query.isFetching;
  const isError = query.isError;

  // ============ Selection ============
  const listIdSet = useMemo(() => new Set(list.map((item) => item.id)), [list]);

  // 현재 리스트에 없는 선택 항목 자동 필터링 (파생 상태)
  // listIds가 변경되면 자동으로 유효하지 않은 항목이 제거됨
  const filteredSelected = useMemo(
    () => selected.filter((id) => listIdSet.has(id)),
    [selected, listIdSet],
  );

  // selected를 항상 필터링된 상태로 유지 (listIds 변경 시 자동으로 필터링됨)
  const selectedToUse = filteredSelected;

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const filtered = prev.filter((itemId) => listIdSet.has(itemId));
      return filtered.includes(id) ? filtered.filter((item) => item !== id) : [...filtered, id];
    });
  };

  const toggleSelectAll = () => {
    if (!list.length) return;
    const currentSelected = filteredSelected;
    if (currentSelected.length === list.length) {
      setSelected([]);
    } else {
      setSelected(list.map((item) => item.id));
    }
  };

  // ============ Delete Actions ============
  const handleDelete = () => {
    if (!selected.length) return;
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selected.length) return;
    deleteManyMutation.mutate(selected, {
      onSuccess: () => {
        setSelected([]);
        setIsDeleteModalOpen(false);
      },
    });
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteItem = (id: number) => {
    setDeleteItemId(id);
    setIsDeleteItemModalOpen(true);
  };

  const handleConfirmDeleteItem = () => {
    if (!deleteItemId) return;
    deleteManyMutation.mutate([deleteItemId], {
      onSuccess: () => {
        setDeleteItemId(null);
        setIsDeleteItemModalOpen(false);
      },
    });
  };

  const handleCloseDeleteItemModal = () => {
    setDeleteItemId(null);
    setIsDeleteItemModalOpen(false);
  };

  // ============ Filter Actions ============
  const handleSortChange = (value: string) => {
    setSortInput(value);
  };

  const handleOrderByChange = (value: OrderBy) => {
    setOrderByInput(value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setKeyword(searchInput.trim());
    setSort(sortInput);
    setOrderBy(orderByInput);
    setPage(1);
  };

  const handleSearchClear = () => {
    setSearchInput('');
    if (keyword !== '') {
      setKeyword('');
      setPage(1);
    }
  };

  const handleReset = () => {
    setSearchInput('');
    setKeyword('');
    setSort('createdAt');
    setOrderBy('ASC');
    setSortInput('createdAt');
    setOrderByInput('ASC');
    setPage(1);
  };

  const handleRefetch = async () => {
    await query.refetch();
  };

  // ============ Return ============
  return {
    data: { list, total, page, totalPages },
    status: { isLoading, isFetching, isError },
    selection: { selected: selectedToUse, toggleSelect, toggleSelectAll },
    filter: {
      searchInput,
      setSearchInput,
      handleSearchClear,
      sort: sortInput,
      handleSortChange,
      orderBy: orderByInput,
      handleOrderByChange,
      handleSearchSubmit,
      handleReset,
    },
    actions: {
      handleRefetch,
      handleDelete,
      handleDeleteItem,
      isDeleting: deleteManyMutation.isPending,
    },
    pagination: { setPage },
    modals: {
      delete: {
        isOpen: isDeleteModalOpen,
        onClose: handleCloseDeleteModal,
        onConfirm: handleConfirmDelete,
      },
      deleteItem: {
        isOpen: isDeleteItemModalOpen,
        onClose: handleCloseDeleteItemModal,
        onConfirm: handleConfirmDeleteItem,
      },
    },
  };
};
