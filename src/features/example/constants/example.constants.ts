import type { SelectOption } from '@/shared/components/atoms/Select';

interface TableHead {
  id: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export const EXAMPLE_STATUS_OPTIONS: SelectOption[] = [
  { value: 'ACTIVE', label: '활성' },
  { value: 'INACTIVE', label: '비활성' },
];

export const EXAMPLE_TABLE_HEAD: TableHead[] = [
  { id: 'name', label: '닉네임', width: 'auto', align: 'left' },
  { id: 'userId', label: '아이디', width: '200px', align: 'left' },
  { id: 'email', label: '이메일', width: '250px', align: 'left' },
  { id: 'detail', label: '상세 보기', width: '100px', align: 'center' },
];
