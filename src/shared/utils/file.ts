/**
 * 파일 관련 유틸리티 함수
 */

/**
 * 파일명을 안전하게 검증하고 정제합니다.
 * XSS 및 Path Traversal 공격을 방지합니다.
 * @param filename - 원본 파일명
 * @param fallback - 검증 실패 시 사용할 기본 파일명
 * @returns 검증된 안전한 파일명
 */
export const sanitizeFilename = (filename?: string, fallback: string = 'file'): string => {
  if (!filename || typeof filename !== 'string') {
    return fallback;
  }

  // 경로 조작 문자 제거 (Path Traversal 방지)
  let sanitized = filename
    .replace(/\.\./g, '') // .. 제거
    .replace(/[/\\]/g, '_') // /, \ 를 _ 로 변경
    .replace(/^\.+/, '') // 앞의 . 제거
    .trim();

  // 허용된 문자만 남기기 (한글, 영문, 숫자, 일부 특수문자: ._-)
  sanitized = sanitized.replace(/[^가-힣A-Za-z0-9._-]/g, '');

  // 파일명 길이 제한 (255자)
  if (sanitized.length > 255) {
    const ext = sanitized.split('.').pop();
    const nameWithoutExt = sanitized.substring(0, 255 - (ext ? ext.length + 1 : 0));
    sanitized = ext ? `${nameWithoutExt}.${ext}` : nameWithoutExt;
  }

  // 빈 문자열이면 fallback 반환
  if (!sanitized || sanitized.length === 0) {
    return fallback;
  }

  return sanitized;
};

/**
 * 파일 확장자로부터 MIME 타입을 추론합니다.
 * @param filename - 파일명 (예: "video.mp4")
 * @returns MIME 타입 (예: "video/mp4") 또는 null
 */
export const getMimeTypeFromFilename = (filename?: string): string | null => {
  if (!filename) return null;
  const ext = filename.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    // 이미지
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    heic: 'image/heic',
    // 영상
    mp4: 'video/mp4',
    webm: 'video/webm',
    ogg: 'video/ogg',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
  };
  return mimeTypes[ext || ''] || null;
};

/**
 * base64 문자열을 Blob으로 변환합니다.
 * @param base64String - base64로 인코딩된 문자열
 * @param mimeType - MIME 타입 (예: "video/mp4")
 * @returns Blob 객체
 */
export const base64ToBlob = (
  base64String: string,
  mimeType: string = 'application/octet-stream',
): Blob => {
  const byteCharacters = atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};
