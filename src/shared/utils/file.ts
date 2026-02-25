// XSS 및 Path Traversal 방지 — 사용자 업로드 파일명을 안전하게 정규화
export const sanitizeFilename = (filename?: string, fallback: string = 'file'): string => {
  if (!filename || typeof filename !== 'string') {
    return fallback;
  }

  let sanitized = filename.replace(/\.\./g, '').replace(/[/\\]/g, '_').replace(/^\.+/, '').trim();

  sanitized = sanitized.replace(/[^가-힣A-Za-z0-9._-]/g, '');

  if (sanitized.length > 255) {
    const ext = sanitized.split('.').pop();
    const nameWithoutExt = sanitized.substring(0, 255 - (ext ? ext.length + 1 : 0));
    sanitized = ext ? `${nameWithoutExt}.${ext}` : nameWithoutExt;
  }

  if (!sanitized || sanitized.length === 0) {
    return fallback;
  }

  return sanitized;
};

export const getMimeTypeFromFilename = (filename?: string): string | null => {
  if (!filename) return null;
  const ext = filename.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    heic: 'image/heic',
    mp4: 'video/mp4',
    webm: 'video/webm',
    ogg: 'video/ogg',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
  };
  return mimeTypes[ext || ''] || null;
};

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
