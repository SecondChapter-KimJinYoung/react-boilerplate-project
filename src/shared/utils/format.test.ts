import { describe, it, expect } from 'vitest';
import {
  formatPhone,
  formatBusinessNumber,
  formatCurrency,
  formatWon,
  formatDate,
  formatDateDot,
  formatDateTime,
  formatFileSize,
  extractNumbers,
  formatCardNumber,
  formatCardNumberMasked,
  formatResidentNumber,
  formatResidentNumberMasked,
} from './format';

// ============================================================================
// formatPhone
// ============================================================================
describe('formatPhone', () => {
  it('11자리 휴대폰 번호를 포맷팅한다', () => {
    expect(formatPhone('01012345678')).toBe('010-1234-5678');
  });

  it('3자리 이하는 그대로 반환한다', () => {
    expect(formatPhone('010')).toBe('010');
    expect(formatPhone('01')).toBe('01');
  });

  it('4~7자리는 앞 3자리-나머지로 포맷팅한다', () => {
    expect(formatPhone('0101234')).toBe('010-1234');
    expect(formatPhone('0101')).toBe('010-1');
  });

  it('하이픈이 포함된 입력도 숫자만 추출하여 포맷팅한다', () => {
    expect(formatPhone('010-1234-5678')).toBe('010-1234-5678');
  });
});

// ============================================================================
// formatBusinessNumber
// ============================================================================
describe('formatBusinessNumber', () => {
  it('10자리 사업자번호를 포맷팅한다', () => {
    expect(formatBusinessNumber('1234567890')).toBe('123-45-67890');
  });

  it('3자리 이하는 그대로 반환한다', () => {
    expect(formatBusinessNumber('123')).toBe('123');
  });

  it('4~5자리는 앞 3자리-나머지로 포맷팅한다', () => {
    expect(formatBusinessNumber('12345')).toBe('123-45');
  });
});

// ============================================================================
// formatCurrency
// ============================================================================
describe('formatCurrency', () => {
  it('숫자를 천단위 콤마로 포맷팅한다', () => {
    expect(formatCurrency(1000000)).toBe('1,000,000');
  });

  it('문자열 숫자도 포맷팅한다', () => {
    expect(formatCurrency('1000000')).toBe('1,000,000');
  });

  it('NaN이면 0을 반환한다', () => {
    expect(formatCurrency('abc')).toBe('0');
  });

  it('0을 올바르게 처리한다', () => {
    expect(formatCurrency(0)).toBe('0');
  });

  it('1000 미만은 콤마 없이 반환한다', () => {
    expect(formatCurrency(999)).toBe('999');
  });
});

// ============================================================================
// formatWon
// ============================================================================
describe('formatWon', () => {
  it('원화 포맷팅 (숫자 + 원)', () => {
    expect(formatWon(1000000)).toBe('1,000,000원');
  });

  it('문자열 입력도 처리한다', () => {
    expect(formatWon('50000')).toBe('50,000원');
  });
});

// ============================================================================
// formatDate
// ============================================================================
describe('formatDate', () => {
  it('8자리 숫자를 YYYY-MM-DD로 포맷팅한다', () => {
    expect(formatDate('20240101')).toBe('2024-01-01');
  });

  it('4자리 이하는 그대로 반환한다', () => {
    expect(formatDate('2024')).toBe('2024');
  });

  it('5~6자리는 YYYY-MM로 포맷팅한다', () => {
    expect(formatDate('202401')).toBe('2024-01');
  });
});

// ============================================================================
// formatDateDot
// ============================================================================
describe('formatDateDot', () => {
  it('Date 객체를 YYYY.MM.DD로 포맷팅한다', () => {
    const date = new Date(2024, 0, 15); // 2024-01-15
    expect(formatDateDot(date)).toBe('2024.01.15');
  });

  it('월과 일이 한 자리일 때 0으로 패딩한다', () => {
    const date = new Date(2024, 0, 1); // 2024-01-01
    expect(formatDateDot(date)).toBe('2024.01.01');
  });
});

// ============================================================================
// formatDateTime
// ============================================================================
describe('formatDateTime', () => {
  it('Date 객체를 YYYY.MM.DD HH:MM으로 포맷팅한다', () => {
    const date = new Date(2024, 0, 15, 14, 30);
    expect(formatDateTime(date)).toBe('2024.01.15 14:30');
  });

  it('시간이 한 자리일 때 0으로 패딩한다', () => {
    const date = new Date(2024, 0, 1, 9, 5);
    expect(formatDateTime(date)).toBe('2024.01.01 09:05');
  });
});

// ============================================================================
// formatFileSize
// ============================================================================
describe('formatFileSize', () => {
  it('0 Bytes를 올바르게 표시한다', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
  });

  it('바이트 단위를 표시한다', () => {
    expect(formatFileSize(500)).toBe('500 Bytes');
  });

  it('KB 단위를 표시한다', () => {
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
  });

  it('MB 단위를 표시한다', () => {
    expect(formatFileSize(1048576)).toBe('1 MB');
  });

  it('GB 단위를 표시한다', () => {
    expect(formatFileSize(1073741824)).toBe('1 GB');
  });
});

// ============================================================================
// extractNumbers
// ============================================================================
describe('extractNumbers', () => {
  it('문자열에서 숫자만 추출한다', () => {
    expect(extractNumbers('010-1234-5678')).toBe('01012345678');
  });

  it('숫자가 없으면 빈 문자열을 반환한다', () => {
    expect(extractNumbers('abc')).toBe('');
  });

  it('숫자만 있으면 그대로 반환한다', () => {
    expect(extractNumbers('12345')).toBe('12345');
  });
});

// ============================================================================
// formatCardNumber
// ============================================================================
describe('formatCardNumber', () => {
  it('16자리 카드번호를 4자리씩 하이픈으로 구분한다', () => {
    expect(formatCardNumber('1234567890123456')).toBe('1234-5678-9012-3456');
  });

  it('4자리 이하는 그대로 반환한다', () => {
    expect(formatCardNumber('1234')).toBe('1234');
  });

  it('5~8자리는 4-나머지로 포맷팅한다', () => {
    expect(formatCardNumber('12345678')).toBe('1234-5678');
  });
});

// ============================================================================
// formatCardNumberMasked
// ============================================================================
describe('formatCardNumberMasked', () => {
  it('16자리 카드번호의 가운데를 마스킹한다', () => {
    expect(formatCardNumberMasked('1234567890123456')).toBe('1234-****-****-3456');
  });

  it('16자리 미만이면 일반 포맷팅을 적용한다', () => {
    expect(formatCardNumberMasked('123456789012')).toBe('1234-5678-9012');
  });
});

// ============================================================================
// formatResidentNumber
// ============================================================================
describe('formatResidentNumber', () => {
  it('13자리 주민번호를 하이픈으로 구분한다', () => {
    expect(formatResidentNumber('9901011234567')).toBe('990101-1234567');
  });

  it('6자리 이하는 그대로 반환한다', () => {
    expect(formatResidentNumber('990101')).toBe('990101');
  });
});

// ============================================================================
// formatResidentNumberMasked
// ============================================================================
describe('formatResidentNumberMasked', () => {
  it('13자리 주민번호의 뒷자리를 마스킹한다', () => {
    expect(formatResidentNumberMasked('9901011234567')).toBe('990101-1******');
  });

  it('13자리 미만이면 일반 포맷팅을 적용한다', () => {
    expect(formatResidentNumberMasked('990101')).toBe('990101');
  });
});
