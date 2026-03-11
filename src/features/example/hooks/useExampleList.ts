import { useMemo, useState } from 'react';

import type { ExampleItem } from '@/api/example/example-types';
import useDebounce from '@/shared/hooks/useDebounce';

import { useDeleteExample, useExampleListQuery } from './useExampleQueries';

type OrderBy = 'ASC' | 'DESC';

const PAGE_SIZE = 10;

export const useExampleList = () => {
  // ── State ──
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);
  const [sort, setSort] = useState('createdAt');
  const [orderBy, setOrderBy] = useState<OrderBy>('ASC');
  const [selected, setSelected] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // ── Query ──
  const keyword = debouncedSearch.trim();
  const query = useExampleListQuery({ page, size: PAGE_SIZE, keyword, sort, orderBy });
  const deleteMutation = useDeleteExample();

  // ── Derived ──
  const list = useMemo(() => query.data?.payload.list ?? [], [query.data?.payload.list]);
  const total = query.data?.payload.totalCount || 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const isLoading = query.isLoading;
  const isFetching = query.isFetching;
  const isError = query.isError;

  // ── Selection ──
  const listIdSet = useMemo(() => new Set(list.map((item: ExampleItem) => item.id)), [list]);

  const filteredSelected = useMemo(
    () => selected.filter((id) => listIdSet.has(id)),
    [selected, listIdSet],
  );

  const selectedSet = useMemo(() => new Set(filteredSelected), [filteredSelected]);

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const filtered = prev.filter((itemId) => listIdSet.has(itemId));
      return filtered.includes(id) ? filtered.filter((item) => item !== id) : [...filtered, id];
    });
  };

  const toggleSelectAll = () => {
    if (!list.length) return;
    if (filteredSelected.length === list.length) {
      setSelected([]);
    } else {
      setSelected(list.map((item: ExampleItem) => item.id));
    }
  };

  // ── Delete ──
  const handleDelete = () => {
    if (!filteredSelected.length) return;
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!filteredSelected.length) return;
    deleteMutation.mutate(
      { ids: filteredSelected },
      {
        onSuccess: () => {
          setSelected([]);
          setIsDeleteModalOpen(false);
        },
      },
    );
  };

  // ── Filter ──
  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(1);
  };

  const handleOrderByChange = (value: OrderBy) => {
    setOrderBy(value);
    setPage(1);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
  };

  const handleSearchClear = () => {
    setSearchInput('');
    if (keyword !== '') {
      setPage(1);
    }
  };

  const handleReset = () => {
    setSearchInput('');
    setSort('createdAt');
    setOrderBy('ASC');
    setPage(1);
  };

  const handleRefetch = async () => {
    await query.refetch();
  };

  return {
    data: { list, total, page, totalPages },
    status: { isLoading, isFetching, isError },
    selection: { selected: filteredSelected, selectedSet, toggleSelect, toggleSelectAll },
    filter: {
      searchInput,
      setSearchInput,
      handleSearchClear,
      sort,
      handleSortChange,
      orderBy,
      handleOrderByChange,
      handleSearchSubmit,
      handleReset,
    },
    actions: {
      handleRefetch,
      handleDelete,
      isDeleting: deleteMutation.isPending,
    },
    pagination: { setPage },
    modals: {
      delete: {
        isOpen: isDeleteModalOpen,
        onClose: () => setIsDeleteModalOpen(false),
        onConfirm: handleConfirmDelete,
      },
    },
  };
};
