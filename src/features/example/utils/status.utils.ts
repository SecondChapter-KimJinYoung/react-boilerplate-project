/**
 * Example 상태 관련 유틸리티 함수
 */

/**
 * 상태 값을 한글 라벨로 변환
 */
export const getExampleStatusLabel = (status: string): string => {
  switch (status) {
    case 'ACTIVE':
      return '활성';
    case 'INACTIVE':
      return '비활성';
    default:
      return status;
  }
};

/**
 * 상태에 따른 Chip 스타일 클래스 반환
 */
export const getExampleStatusColor = (status: string): string => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-50 text-green-700 border border-green-100';
    case 'INACTIVE':
      return 'bg-gray-50 text-gray-700 border border-gray-100';
    default:
      return 'bg-gray-50 text-gray-700 border border-gray-100';
  }
};
