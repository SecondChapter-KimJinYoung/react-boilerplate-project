/**
 * Example 더미 데이터
 * API 연동 전 개발/테스트용
 */

import type { ExampleItem } from '@/api/example/example.types';

export const mockExampleList: ExampleItem[] = [
  {
    id: 1,
    name: '닉네임',
    userId: 'UXUI/매니저',
    email: 'ooo@from.co.kr',
    status: 'ACTIVE',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 2,
    name: '닉네임',
    userId: 'UXUI/매니저',
    email: 'ooo@from.co.kr',
    status: 'ACTIVE',
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02',
  },
  {
    id: 3,
    name: '닉네임',
    userId: 'UXUI/매니저',
    email: 'ooo@from.co.kr',
    status: 'ACTIVE',
    createdAt: '2024-01-03',
    updatedAt: '2024-01-03',
  },
  {
    id: 4,
    name: '닉네임',
    userId: 'UXUI/매니저',
    email: 'ooo@from.co.kr',
    status: 'ACTIVE',
    createdAt: '2024-01-04',
    updatedAt: '2024-01-04',
  },
  {
    id: 5,
    name: '닉네임',
    userId: 'UXUI/매니저',
    email: 'ooo@from.co.kr',
    status: 'ACTIVE',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05',
  },
  {
    id: 6,
    name: '닉네임',
    userId: 'UXUI/매니저',
    email: 'ooo@from.co.kr',
    status: 'ACTIVE',
    createdAt: '2024-01-06',
    updatedAt: '2024-01-06',
  },
  {
    id: 7,
    name: '닉네임',
    userId: 'UXUI/매니저',
    email: 'ooo@from.co.kr',
    status: 'ACTIVE',
    createdAt: '2024-01-07',
    updatedAt: '2024-01-07',
  },
  {
    id: 8,
    name: '닉네임',
    userId: 'UXUI/매니저',
    email: 'ooo@from.co.kr',
    status: 'ACTIVE',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08',
  },
  {
    id: 9,
    name: '닉네임',
    userId: 'UXUI/매니저',
    email: 'ooo@from.co.kr',
    status: 'ACTIVE',
    createdAt: '2024-01-09',
    updatedAt: '2024-01-09',
  },
  {
    id: 10,
    name: '닉네임',
    userId: 'UXUI/매니저',
    email: 'ooo@from.co.kr',
    status: 'ACTIVE',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
];

export const mockExampleTotalCount = 10;

/**
 * Example 상세 더미 데이터 생성
 * Detail과 Update 페이지에서 사용
 */
export const getMockExampleDetail = (id: number) => ({
  id,
  name: `Example ${id}`,
  description: `Example ${id}에 대한 설명입니다.`,
  status: id % 2 === 0 ? 'ACTIVE' : 'INACTIVE',
  createdAt: '2024-01-01 00:00:00',
  updatedAt: '2024-01-01 00:00:00',
});
