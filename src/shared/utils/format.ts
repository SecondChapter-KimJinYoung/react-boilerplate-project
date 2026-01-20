/**
 * 데이터 포맷팅 유틸리티 함수 모음
 */

// 전화번호 포맷팅 (01012345678 → 010-1234-5678)
export const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');

  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};

// 사업자번호 포맷팅 (1234567890 → 123-45-67890)
export const formatBusinessNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, '');

  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 10)}`;
};

// 통화 포맷팅 (1000000 → 1,000,000)
export const formatCurrency = (value: number | string): string => {
  const num = typeof value === 'string' ? parseInt(value.replace(/\D/g, ''), 10) : value;
  if (isNaN(num)) return '0';
  return num.toLocaleString('ko-KR');
};

// 원화 포맷팅 (1000000 → 1,000,000원)
export const formatWon = (value: number | string): string => {
  return `${formatCurrency(value)}원`;
};

// 날짜 포맷팅 (20240101 → 2024-01-01)
export const formatDate = (value: string): string => {
  const numbers = value.replace(/\D/g, '');

  if (numbers.length <= 4) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
  return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`;
};

// 날짜 포맷팅 (Date → 2024.01.01)
export const formatDateDot = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

// 날짜+시간 포맷팅 (Date → 2024.01.01 14:30)
export const formatDateTime = (date: Date): string => {
  const dateStr = formatDateDot(date);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${dateStr} ${hours}:${minutes}`;
};

// ISO 8601 날짜 포맷팅 (2024-01-15T14:30:00Z → 2024년 1월 15일)
export const formatDateKorean = (isoString: string): string => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
};

// ISO 8601 날짜+시간 포맷팅 (2024-01-15T14:30:00Z → 2024년 1월 15일 14시 30분)
export const formatDateTimeKorean = (isoString: string): string => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
};

// 날짜+시간 포맷팅 (2024-01-15T14:30:00Z → 2024-01-15 14:30:00)
export const toDateTimeString = (value: string): string => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 카드번호 포맷팅 (1234567890123456 → 1234-5678-9012-3456)
export const formatCardNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, '');

  if (numbers.length <= 4) return numbers;
  if (numbers.length <= 8) return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
  if (numbers.length <= 12)
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 8)}-${numbers.slice(8)}`;
  return `${numbers.slice(0, 4)}-${numbers.slice(4, 8)}-${numbers.slice(8, 12)}-${numbers.slice(12, 16)}`;
};

// 카드번호 마스킹 (1234567890123456 → 1234-****-****-3456)
export const formatCardNumberMasked = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length < 16) return formatCardNumber(value);
  return `${numbers.slice(0, 4)}-****-****-${numbers.slice(12, 16)}`;
};

// 주민번호 포맷팅 (9901011234567 → 990101-1234567)
export const formatResidentNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, '');

  if (numbers.length <= 6) return numbers;
  return `${numbers.slice(0, 6)}-${numbers.slice(6, 13)}`;
};

// 주민번호 마스킹 (9901011234567 → 990101-1******)
export const formatResidentNumberMasked = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length < 13) return formatResidentNumber(value);
  return `${numbers.slice(0, 6)}-${numbers.slice(6, 7)}******`;
};

// 파일 크기 포맷팅 (1024 → 1 KB)
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

// 숫자만 추출
export const extractNumbers = (value: string): string => {
  return value.replace(/\D/g, '');
};

// 상대 시간 포맷팅 (2024-01-15T14:30:00Z → 방금 전, 5분 전, 2시간 전 등)
export const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString('ko-KR');
};
