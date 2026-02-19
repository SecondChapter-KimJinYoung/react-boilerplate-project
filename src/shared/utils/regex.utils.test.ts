import { describe, it, expect } from 'vitest';
import { validate, format, mask, extract, sanitize, getErrorMessage } from './regex.utils';

// ============================================================================
// validate
// ============================================================================
describe('validate', () => {
  describe('email', () => {
    it('올바른 이메일을 통과시킨다', () => {
      expect(validate.email('test@example.com')).toBe(true);
      expect(validate.email('user.name@domain.co.kr')).toBe(true);
    });

    it('잘못된 이메일을 거부한다', () => {
      expect(validate.email('invalid')).toBe(false);
      expect(validate.email('@domain.com')).toBe(false);
      expect(validate.email('test@')).toBe(false);
    });
  });

  describe('phone', () => {
    it('올바른 전화번호를 통과시킨다', () => {
      expect(validate.phone('01012345678')).toBe(true);
      expect(validate.phone('010-1234-5678')).toBe(true);
    });

    it('잘못된 전화번호를 거부한다', () => {
      expect(validate.phone('12345678')).toBe(false);
      expect(validate.phone('abc')).toBe(false);
    });
  });

  describe('url', () => {
    it('올바른 URL을 통과시킨다', () => {
      expect(validate.url('https://example.com')).toBe(true);
      expect(validate.url('http://localhost:3000')).toBe(true);
    });

    it('잘못된 URL을 거부한다', () => {
      expect(validate.url('not-a-url')).toBe(false);
      expect(validate.url('')).toBe(false);
    });
  });

  describe('businessNumber', () => {
    it('체크섬이 맞지 않는 번호를 거부한다', () => {
      expect(validate.businessNumber('1234567890')).toBe(false);
      expect(validate.businessNumber('1111111111')).toBe(false);
    });

    it('10자리가 아니면 거부한다', () => {
      expect(validate.businessNumber('123')).toBe(false);
      expect(validate.businessNumber('12345678901')).toBe(false);
    });
  });

  describe('passwordStrength', () => {
    it('매우 약한 비밀번호를 감지한다', () => {
      const result = validate.passwordStrength('abc');
      expect(result.score).toBeLessThanOrEqual(1);
      expect(result.feedback.length).toBeGreaterThan(0);
    });

    it('강한 비밀번호를 감지한다', () => {
      const result = validate.passwordStrength('MyStr0ng!Pass');
      expect(result.score).toBeGreaterThanOrEqual(3);
      expect(result.strength).toMatch(/strong|very-strong/);
    });

    it('연속 문자를 감점한다', () => {
      const result = validate.passwordStrength('Passaaaw0rd!');
      expect(result.feedback).toContain('연속된 문자를 피하세요 (예: aaa, 111)');
    });
  });

  describe('creditCard (Luhn)', () => {
    it('유효한 카드 번호를 통과시킨다 (Luhn 알고리즘)', () => {
      // 4111111111111111 은 Visa 테스트 번호 (Luhn 통과)
      expect(validate.creditCard('4111111111111111')).toBe(true);
    });

    it('잘못된 카드 번호를 거부한다', () => {
      expect(validate.creditCard('1234567890123456')).toBe(false);
    });

    it('길이가 범위 밖이면 거부한다', () => {
      expect(validate.creditCard('123')).toBe(false);
      expect(validate.creditCard('12345678901234567890')).toBe(false);
    });
  });
});

// ============================================================================
// format
// ============================================================================
describe('format', () => {
  describe('phone', () => {
    it('11자리 번호를 포맷팅한다', () => {
      expect(format.phone('01012345678')).toBe('010-1234-5678');
    });

    it('10자리 번호를 포맷팅한다', () => {
      expect(format.phone('0311234567')).toBe('031-123-4567');
    });

    it('서울 지역번호(02)를 포맷팅한다', () => {
      expect(format.phone('021234567')).toBe('02-123-4567');
    });

    it('매칭되지 않으면 원본을 반환한다', () => {
      expect(format.phone('123')).toBe('123');
    });
  });

  describe('businessNumber', () => {
    it('10자리를 123-45-67890 형태로 포맷팅한다', () => {
      expect(format.businessNumber('1234567890')).toBe('123-45-67890');
    });

    it('10자리가 아니면 원본을 반환한다', () => {
      expect(format.businessNumber('123')).toBe('123');
    });
  });

  describe('cardNumber', () => {
    it('16자리를 4자리씩 하이픈 구분한다', () => {
      expect(format.cardNumber('1234567890123456')).toBe('1234-5678-9012-3456');
    });

    it('16자리가 아니면 원본을 반환한다', () => {
      expect(format.cardNumber('1234')).toBe('1234');
    });
  });

  describe('price', () => {
    it('숫자를 천단위 콤마로 포맷팅한다', () => {
      expect(format.price(1234567)).toBe('1,234,567');
    });

    it('문자열 숫자도 포맷팅한다', () => {
      expect(format.price('1234567')).toBe('1,234,567');
    });

    it('통화 기호를 추가한다', () => {
      expect(format.price(1000, { currency: 'KRW' })).toBe('₩1,000');
      expect(format.price(1000, { currency: 'USD' })).toBe('$1,000');
    });

    it('소수점 자릿수를 지정한다', () => {
      expect(format.price(1234.5, { decimals: 2 })).toBe('1,234.50');
    });

    it('NaN이면 원본 문자열을 반환한다', () => {
      expect(format.price('abc')).toBe('abc');
    });
  });

  describe('date', () => {
    it('8자리를 YYYY-MM-DD로 포맷팅한다', () => {
      expect(format.date('20240115')).toBe('2024-01-15');
    });

    it('점(.) 구분자를 지원한다', () => {
      expect(format.date('20240115', 'YYYY.MM.DD')).toBe('2024.01.15');
    });

    it('슬래시(/) 구분자를 지원한다', () => {
      expect(format.date('20240115', 'YYYY/MM/DD')).toBe('2024/01/15');
    });

    it('8자리가 아니면 원본을 반환한다', () => {
      expect(format.date('2024')).toBe('2024');
    });
  });

  describe('residentNumber', () => {
    it('13자리를 6-7 형태로 포맷팅한다', () => {
      expect(format.residentNumber('9901011234567')).toBe('990101-1234567');
    });

    it('13자리가 아니면 원본을 반환한다', () => {
      expect(format.residentNumber('990101')).toBe('990101');
    });
  });
});

// ============================================================================
// mask
// ============================================================================
describe('mask', () => {
  describe('email', () => {
    it('이메일 앞 2자만 남기고 마스킹한다', () => {
      expect(mask.email('test@example.com')).toBe('te**@example.com');
    });

    it('긴 이메일도 처리한다', () => {
      expect(mask.email('longusername@domain.com')).toBe('lo**********@domain.com');
    });
  });

  describe('phone', () => {
    it('가운데 4자리를 마스킹한다', () => {
      expect(mask.phone('010-1234-5678')).toBe('010-****-5678');
    });

    it('하이픈 없는 번호도 마스킹한다', () => {
      expect(mask.phone('01012345678')).toBe('010-****-5678');
    });
  });

  describe('name', () => {
    it('3자 이름의 가운데를 마스킹한다', () => {
      expect(mask.name('홍길동')).toBe('홍*동');
    });

    it('2자 이름은 뒷자를 마스킹한다', () => {
      expect(mask.name('이수')).toBe('이*');
    });

    it('4자 이상 이름도 처리한다', () => {
      expect(mask.name('남궁민수')).toBe('남**수');
    });
  });

  describe('cardNumber', () => {
    it('16자리 가운데를 마스킹한다', () => {
      expect(mask.cardNumber('1234567890123456')).toBe('1234-****-****-3456');
    });

    it('16자리가 아니면 원본을 반환한다', () => {
      expect(mask.cardNumber('1234')).toBe('1234');
    });
  });

  describe('residentNumber', () => {
    it('뒷자리를 마스킹한다', () => {
      expect(mask.residentNumber('9901011234567')).toBe('990101-1******');
    });

    it('전체 마스킹 옵션을 지원한다', () => {
      expect(mask.residentNumber('9901011234567', true)).toBe('******-*******');
    });

    it('13자리가 아니면 원본을 반환한다', () => {
      expect(mask.residentNumber('990101')).toBe('990101');
    });
  });
});

// ============================================================================
// extract
// ============================================================================
describe('extract', () => {
  describe('emails', () => {
    it('텍스트에서 이메일을 추출한다', () => {
      expect(extract.emails('문의: test@example.com 또는 admin@site.com')).toEqual([
        'test@example.com',
        'admin@site.com',
      ]);
    });

    it('이메일이 없으면 빈 배열을 반환한다', () => {
      expect(extract.emails('이메일 없음')).toEqual([]);
    });
  });

  describe('phones', () => {
    it('텍스트에서 전화번호를 추출한다', () => {
      expect(extract.phones('연락처: 010-1234-5678, 01098765432')).toEqual([
        '010-1234-5678',
        '01098765432',
      ]);
    });
  });

  describe('hashtags', () => {
    it('해시태그를 추출한다', () => {
      expect(extract.hashtags('#React #개발 #TypeScript')).toEqual([
        '#React',
        '#개발',
        '#TypeScript',
      ]);
    });
  });

  describe('numbers', () => {
    it('텍스트에서 숫자 그룹을 추출한다', () => {
      expect(extract.numbers('가격: 1,000원 (할인 200원)')).toEqual(['1', '000', '200']);
    });
  });

  describe('korean', () => {
    it('한글만 추출한다', () => {
      expect(extract.korean('Hello 안녕하세요 World 세계')).toBe('안녕하세요세계');
    });
  });
});

// ============================================================================
// sanitize
// ============================================================================
describe('sanitize', () => {
  describe('numbersOnly', () => {
    it('숫자 외 문자를 제거한다', () => {
      expect(sanitize.numbersOnly('010-1234-5678')).toBe('01012345678');
    });
  });

  describe('alphanumeric', () => {
    it('영문+숫자 외 문자를 제거한다', () => {
      expect(sanitize.alphanumeric('Hello-World_123!')).toBe('HelloWorld123');
    });
  });

  describe('koreanOnly', () => {
    it('한글 외 문자를 제거한다', () => {
      expect(sanitize.koreanOnly('Hello 안녕 123')).toBe('안녕');
    });
  });

  describe('removeSpecialChars', () => {
    it('특수문자를 제거하고 한글/영문/숫자/공백은 유지한다', () => {
      expect(sanitize.removeSpecialChars('Hello! 안녕? 123#')).toBe('Hello 안녕 123');
    });
  });

  describe('normalizeWhitespace', () => {
    it('연속 공백을 하나로 줄이고 앞뒤를 트림한다', () => {
      expect(sanitize.normalizeWhitespace('  hello   world  ')).toBe('hello world');
    });
  });

  describe('stripHtml', () => {
    it('HTML 태그를 제거한다', () => {
      expect(sanitize.stripHtml('<p>Hello <b>World</b></p>')).toBe('Hello World');
    });
  });

  describe('escapeHtml', () => {
    it('HTML 특수문자를 이스케이프한다', () => {
      expect(sanitize.escapeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
      );
    });
  });

  describe('normalizeCase', () => {
    it('소문자로 변환한다', () => {
      expect(sanitize.normalizeCase('Hello World')).toBe('hello world');
    });

    it('대문자로 변환한다', () => {
      expect(sanitize.normalizeCase('Hello World', 'upper')).toBe('HELLO WORLD');
    });

    it('타이틀 케이스로 변환한다', () => {
      expect(sanitize.normalizeCase('hello world', 'title')).toBe('Hello World');
    });
  });
});

// ============================================================================
// getErrorMessage
// ============================================================================
describe('getErrorMessage', () => {
  it('타입별 에러 메시지를 반환한다', () => {
    expect(getErrorMessage('email')).toBe('올바른 이메일 형식이 아닙니다');
    expect(getErrorMessage('phone')).toBe('올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)');
  });

  it('등록되지 않은 타입은 기본 메시지를 반환한다', () => {
    expect(getErrorMessage('unknown')).toBe('입력값이 올바르지 않습니다');
  });

  it('min/max 옵션으로 길이 안내를 추가한다', () => {
    expect(getErrorMessage('email', { min: 5, max: 50 })).toBe(
      '올바른 이메일 형식이 아닙니다 (5-50자)',
    );
  });

  it('min만 있으면 최소 길이만 표시한다', () => {
    expect(getErrorMessage('email', { min: 5 })).toBe('올바른 이메일 형식이 아닙니다 (최소 5자)');
  });

  it('max만 있으면 최대 길이만 표시한다', () => {
    expect(getErrorMessage('email', { max: 50 })).toBe('올바른 이메일 형식이 아닙니다 (최대 50자)');
  });
});
