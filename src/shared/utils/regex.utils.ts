import {
  EMAIL_REGEX,
  HTML_TAG_REGEX,
  PHONE_REGEX,
  YOUTUBE_ID_REGEX,
} from '@/shared/constants/regex.patterns';

export const validate = {
  email: (email: string): boolean => {
    return EMAIL_REGEX.test(email);
  },

  phone: (phone: string): boolean => {
    return PHONE_REGEX.ALL.test(phone);
  },

  // 주민등록번호 체크섬 검증
  residentNumber: (num: string): boolean => {
    const cleaned = num.replace(/-/g, '');
    if (cleaned.length !== 13) return false;

    const weights = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
    let sum = 0;

    for (let i = 0; i < 12; i++) {
      const digit = cleaned[i];
      const weight = weights[i];
      if (digit === undefined || weight === undefined) return false;
      sum += parseInt(digit) * weight;
    }

    const checkDigit = (11 - (sum % 11)) % 10;
    const lastDigit = cleaned[12];
    if (lastDigit === undefined) return false;
    return checkDigit === parseInt(lastDigit);
  },

  // 사업자등록번호 체크섬 검증
  businessNumber: (num: string): boolean => {
    const cleaned = num.replace(/-/g, '');
    if (cleaned.length !== 10) return false;

    const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
    let sum = 0;

    for (let i = 0; i < 9; i++) {
      const digit = cleaned[i];
      const weight = weights[i];
      if (digit === undefined || weight === undefined) return false;
      sum += parseInt(digit) * weight;
    }

    const eighthDigit = cleaned[8];
    if (eighthDigit === undefined) return false;
    sum += Math.floor((parseInt(eighthDigit) * 5) / 10);
    const checkDigit = (10 - (sum % 10)) % 10;

    const ninthDigit = cleaned[9];
    if (ninthDigit === undefined) return false;
    return checkDigit === parseInt(ninthDigit);
  },

  // 법인등록번호 체크섬 검증
  corporationNumber: (num: string): boolean => {
    const cleaned = num.replace(/-/g, '');
    if (cleaned.length !== 13) return false;

    const weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
    let sum = 0;

    for (let i = 0; i < 12; i++) {
      const digit = cleaned[i];
      const weight = weights[i];
      if (digit === undefined || weight === undefined) return false;
      const temp = parseInt(digit) * weight;
      sum += Math.floor(temp / 10) + (temp % 10);
    }

    const checkDigit = (10 - (sum % 10)) % 10;
    const lastDigit = cleaned[12];
    if (lastDigit === undefined) return false;
    return checkDigit === parseInt(lastDigit);
  },

  // 신용카드번호 Luhn 알고리즘
  creditCard: (num: string): boolean => {
    const cleaned = num.replace(/\D/g, '');
    if (cleaned.length < 13 || cleaned.length > 19) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      const char = cleaned[i];
      if (char === undefined) return false;
      let digit = parseInt(char);

      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  },

  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  passwordStrength: (
    password: string,
  ): {
    score: number;
    feedback: string[];
    strength: 'very-weak' | 'weak' | 'medium' | 'strong' | 'very-strong';
  } => {
    let score = 0;
    const feedback: string[] = [];

    if (password.length >= 8) score++;
    else feedback.push('최소 8자 이상 입력하세요');

    if (password.length >= 12) score++;

    if (/[a-z]/.test(password)) score++;
    else feedback.push('소문자를 포함하세요');

    if (/[A-Z]/.test(password)) score++;
    else feedback.push('대문자를 포함하세요');

    if (/\d/.test(password)) score++;
    else feedback.push('숫자를 포함하세요');

    if (/[@$!%*#?&]/.test(password)) score++;
    else feedback.push('특수문자를 포함하세요');

    if (/(.)\1{2,}/.test(password)) {
      score--;
      feedback.push('연속된 문자를 피하세요 (예: aaa, 111)');
    }

    if (/abc|bcd|cde|def|123|234|345|456/i.test(password)) {
      score--;
      feedback.push('순차적인 문자를 피하세요 (예: abc, 123)');
    }

    const finalScore = Math.min(Math.max(score, 0), 4);
    const strengthMap: Array<'very-weak' | 'weak' | 'medium' | 'strong' | 'very-strong'> = [
      'very-weak',
      'weak',
      'medium',
      'strong',
      'very-strong',
    ];

    const strength = strengthMap[finalScore] ?? 'very-weak';

    return {
      score: finalScore,
      feedback,
      strength,
    };
  },
} as const;

export const format = {
  // 01012345678 -> 010-1234-5678
  phone: (phone: string): string => {
    const cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    } else if (cleaned.length === 9 && cleaned.startsWith('02')) {
      return cleaned.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    return phone;
  },

  // 1234567890 -> 123-45-67890
  businessNumber: (num: string): string => {
    const cleaned = num.replace(/[^0-9]/g, '');
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
    }
    return num;
  },

  // 1234561234567 -> 123456-1234567
  corporationNumber: (num: string): string => {
    const cleaned = num.replace(/[^0-9]/g, '');
    if (cleaned.length === 13) {
      return cleaned.replace(/(\d{6})(\d{7})/, '$1-$2');
    }
    return num;
  },

  // 1234567890123456 -> 1234-5678-9012-3456
  cardNumber: (num: string): string => {
    const cleaned = num.replace(/[^0-9]/g, '');
    if (cleaned.length === 16) {
      return cleaned.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1-$2-$3-$4');
    }
    return num;
  },

  accountNumber: (num: string, bankCode?: string): string => {
    const cleaned = num.replace(/[^0-9]/g, '');

    const formats: Record<string, RegExp> = {
      '004': /(\d{3})(\d{6})(\d{2})/, // KB국민
      '088': /(\d{4})(\d{6})(\d{2})/, // 신한
      '020': /(\d{3})(\d{2})(\d{6})/, // 우리
    };

    if (bankCode && formats[bankCode]) {
      return cleaned.replace(formats[bankCode], '$1-$2-$3');
    }

    if (cleaned.length >= 10) {
      return cleaned.replace(/(\d{3,4})(\d{6})(\d{2,3})/, '$1-$2-$3');
    }
    return num;
  },

  // 1234567 -> 1,234,567
  price: (price: number | string, options?: { currency?: string; decimals?: number }): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price.replace(/,/g, '')) : price;

    if (isNaN(numPrice)) return price.toString();

    const formatted = numPrice
      .toFixed(options?.decimals ?? 0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (options?.currency) {
      const symbols: Record<string, string> = {
        KRW: '₩',
        USD: '$',
        EUR: '€',
        JPY: '¥',
        GBP: '£',
      };
      return `${symbols[options.currency] || options.currency}${formatted}`;
    }

    return formatted;
  },

  // 20240101 -> 2024-01-01
  date: (
    date: string,
    format: 'YYYY-MM-DD' | 'YYYY.MM.DD' | 'YYYY/MM/DD' = 'YYYY-MM-DD',
  ): string => {
    const cleaned = date.replace(/[^0-9]/g, '');
    if (cleaned.length === 8) {
      const year = cleaned.slice(0, 4);
      const month = cleaned.slice(4, 6);
      const day = cleaned.slice(6, 8);

      const separator = format.includes('-') ? '-' : format.includes('.') ? '.' : '/';
      return `${year}${separator}${month}${separator}${day}`;
    }
    return date;
  },

  // 1234561234567 -> 123456-1234567
  residentNumber: (num: string): string => {
    const cleaned = num.replace(/[^0-9]/g, '');
    if (cleaned.length === 13) {
      return cleaned.replace(/(\d{6})(\d{7})/, '$1-$2');
    }
    return num;
  },

  carNumber: (num: string): string => {
    return num.replace(/\s+/g, '').toUpperCase();
  },

  // 1000000 → 1,000,000
  currency: (value: number | string): string => {
    const num = typeof value === 'string' ? parseInt(value.replace(/\D/g, ''), 10) : value;
    if (isNaN(num)) return '0';
    return num.toLocaleString('ko-KR');
  },

  // 1000000 → 1,000,000원
  won: (value: number | string): string => {
    const num = typeof value === 'string' ? parseInt(value.replace(/\D/g, ''), 10) : value;
    if (isNaN(num)) return '0원';
    return `${num.toLocaleString('ko-KR')}원`;
  },

  // Date → 2024.01.15
  dateDot: (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  },

  // Date → 2024.01.15 14:30
  dateTime: (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  },

  // ISO 8601 → 2024년 1월 15일
  dateKorean: (isoString: string): string => {
    const d = new Date(isoString);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  },

  // ISO 8601 → 2024년 1월 15일 14시 30분
  dateTimeKorean: (isoString: string): string => {
    const d = new Date(isoString);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${d.getHours()}시 ${d.getMinutes()}분`;
  },

  // ISO 8601 → 2024-01-15 14:30:00
  toDateTimeString: (value: string): string => {
    const d = new Date(value);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  },

  // 1024 → 1 KB
  fileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  },

  // ISO → 방금 전, 5분 전, 2시간 전 등
  timeAgo: (dateString: string): string => {
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
  },
} as const;

export const mask = {
  // 123456-1234567 -> 123456-1******
  residentNumber: (num: string, maskAll = false): string => {
    const cleaned = num.replace(/[^0-9]/g, '');
    if (cleaned.length === 13) {
      if (maskAll) {
        return cleaned.replace(/(\d{6})(\d{7})/, '******-*******');
      }
      return cleaned.replace(/(\d{6})(\d{1})(\d{6})/, '$1-$2******');
    }
    return num;
  },

  // test@example.com -> te**@example.com
  email: (email: string): string => {
    return email.replace(/^(.{2})(.*)(@.*)$/, (_, start, middle, domain) => {
      return start + '*'.repeat(middle.length) + domain;
    });
  },

  // 010-1234-5678 -> 010-****-5678
  phone: (phone: string): string => {
    return phone.replace(/(\d{3})-?(\d{4})-?(\d{4})/, '$1-****-$3');
  },

  // 홍길동 -> 홍*동
  name: (name: string): string => {
    if (name.length <= 2) {
      return name[0] + '*';
    }
    return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
  },

  // 1234-5678-9012-3456 -> 1234-****-****-3456
  cardNumber: (num: string): string => {
    const cleaned = num.replace(/[^0-9]/g, '');
    if (cleaned.length === 16) {
      return cleaned.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1-****-****-$4');
    }
    return num;
  },

  // 123-456789-01 -> 123-******-01
  accountNumber: (num: string): string => {
    return num.replace(/(\d{3,4})-?(\d+)-?(\d{2,3})/, (_, start, middle, end) => {
      return `${start}-${'*'.repeat(middle.length)}-${end}`;
    });
  },
} as const;

export const extract = {
  emails: (text: string): string[] => {
    const matches = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
    return matches || [];
  },

  phones: (text: string): string[] => {
    const matches = text.match(/01[0-9]-?\d{3,4}-?\d{4}/g);
    return matches || [];
  },

  urls: (text: string): string[] => {
    const matches = text.match(/https?:\/\/[^\s]+/g);
    return matches || [];
  },

  hashtags: (text: string): string[] => {
    const matches = text.match(/#[a-zA-Z가-힣0-9_]+/g);
    return matches || [];
  },

  mentions: (text: string): string[] => {
    const matches = text.match(/@[a-zA-Z가-힣0-9_]+/g);
    return matches || [];
  },

  numbers: (text: string): string[] => {
    const matches = text.match(/\d+/g);
    return matches || [];
  },

  korean: (text: string): string => {
    return text.replace(/[^가-힣]/g, '');
  },

  youtubeId: (url: string): string | null => {
    const match = url.match(YOUTUBE_ID_REGEX);
    return match && match[1] ? match[1] : null;
  },
} as const;

export const sanitize = {
  numbersOnly: (str: string): string => {
    return str.replace(/\D/g, '');
  },

  alphanumeric: (str: string): string => {
    return str.replace(/[^A-Za-z0-9]/g, '');
  },

  koreanOnly: (str: string): string => {
    return str.replace(/[^가-힣]/g, '');
  },

  englishOnly: (str: string): string => {
    return str.replace(/[^A-Za-z]/g, '');
  },

  removeSpecialChars: (str: string): string => {
    return str.replace(/[^가-힣A-Za-z0-9\s]/g, '');
  },

  removeWhitespace: (str: string): string => {
    return str.replace(/\s/g, '');
  },

  normalizeWhitespace: (str: string): string => {
    return str.replace(/\s+/g, ' ').trim();
  },

  stripHtml: (str: string): string => {
    return str.replace(HTML_TAG_REGEX, '');
  },

  // XSS 방어
  escapeHtml: (str: string): string => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return str.replace(/[&<>"']/g, (char) => map[char] ?? char);
  },

  normalizePhone: (phone: string): string => {
    return phone.replace(/[^0-9]/g, '');
  },

  normalizeCase: (str: string, type: 'lower' | 'upper' | 'title' = 'lower'): string => {
    switch (type) {
      case 'upper':
        return str.toUpperCase();
      case 'title':
        return str.replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
        );
      case 'lower':
      default:
        return str.toLowerCase();
    }
  },
} as const;

export const getErrorMessage = (type: string, options?: { min?: number; max?: number }): string => {
  const messages: Record<string, string> = {
    email: '올바른 이메일 형식이 아닙니다',
    phone: '올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)',
    password: '비밀번호는 8자 이상, 영문+숫자를 포함해야 합니다',
    passwordStrong: '비밀번호는 8자 이상, 영문+숫자+특수문자를 포함해야 합니다',
    residentNumber: '올바른 주민등록번호가 아닙니다',
    businessNumber: '올바른 사업자등록번호가 아닙니다',
    corporationNumber: '올바른 법인등록번호가 아닙니다',
    cardNumber: '올바른 카드번호가 아닙니다',
    accountNumber: '올바른 계좌번호가 아닙니다',
    name: '이름은 2-10자의 한글이어야 합니다',
    nameEnglish: '이름은 2-50자의 영문이어야 합니다',
    nickname: '닉네임은 2-20자의 한글/영문/숫자여야 합니다',
    username: '아이디는 4-20자의 영문+숫자여야 합니다',
    url: '올바른 URL 형식이 아닙니다',
    date: '올바른 날짜 형식이 아닙니다 (예: 2024-01-01)',
    time: '올바른 시간 형식이 아닙니다 (예: 14:30)',
    price: '올바른 금액 형식이 아닙니다',
    postalCode: '올바른 우편번호가 아닙니다 (5자리 숫자)',
    carNumber: '올바른 차량번호가 아닙니다',
    coupon: '올바른 쿠폰 코드가 아닙니다',
    otp: '올바른 인증번호가 아닙니다',
  };

  let message = messages[type] || '입력값이 올바르지 않습니다';

  if (options?.min !== undefined || options?.max !== undefined) {
    if (options.min && options.max) {
      message += ` (${options.min}-${options.max}자)`;
    } else if (options.min) {
      message += ` (최소 ${options.min}자)`;
    } else if (options.max) {
      message += ` (최대 ${options.max}자)`;
    }
  }

  return message;
};
