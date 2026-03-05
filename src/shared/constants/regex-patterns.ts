// 이메일 (RFC 5322 간소화 버전)
export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const PASSWORD_REGEX = {
  NONE: /.*/,
  // 최소 8자, 영문+숫자 (특수문자 선택사항)
  BASIC: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
  // 최소 8자, 영문+숫자+특수문자
  STRONG: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  // 최소 8자, 대문자+소문자+숫자+특수문자
  VERY_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  // 연속된 문자 3개 이상 불가 (예: aaa, 111)
  NO_CONSECUTIVE: /^(?!.*(.)\1{2,}).+$/,
} as const;

export const PHONE_REGEX = {
  NONE: /.*/,
  // 휴대폰 (010-1234-5678, 01012345678)
  MOBILE: /^01[0-9]-?\d{3,4}-?\d{4}$/,
  // 일반 전화 (02-1234-5678, 031-123-4567)
  LANDLINE: /^0(2|[3-6]\d)-?\d{3,4}-?\d{4}$/,
  ALL: /^0\d{1,2}-?\d{3,4}-?\d{4}$/,
  // 국제번호 포함 (+82-10-1234-5678)
  INTERNATIONAL: /^\+?82-?0?1[0-9]-?\d{3,4}-?\d{4}$/,
  // 대표번호 (1588-1234, 1577-1234)
  REPRESENTATIVE: /^1[5-8]\d{2}-?\d{4}$/,
} as const;

// 주민등록번호
export const RESIDENT_NUMBER_REGEX = {
  FULL: /^\d{6}-?\d{7}$/,
  FRONT: /^\d{6}$/,
  GENDER: /^[1-4]$/,
} as const;

// 외국인등록번호 (뒷자리 첫째 5-8)
export const FOREIGNER_NUMBER_REGEX = /^\d{6}-?[5-8]\d{6}$/;

export const PASSPORT_REGEX = {
  // 단수여권 (M12345678)
  SINGLE: /^[A-Z]\d{8}$/,
  // 복수여권 (PM1234567)
  MULTIPLE: /^[A-Z]{2}\d{7}$/,
  ALL: /^[A-Z]{1,2}\d{7,8}$/,
} as const;

export const DRIVER_LICENSE_REGEX = {
  // 신형 (12-34-567890-12)
  NEW: /^\d{2}-\d{2}-\d{6}-\d{2}$/,
  // 구형 (서울 12-345678-90)
  OLD: /^[가-힣]{2}\s?\d{2}-\d{6}-\d{2}$/,
  ALL: /^([가-힣]{2}\s?)?\d{2}-\d{2,6}-?\d{6,8}-?\d{2}$/,
} as const;

// 사업자등록번호 (123-45-67890)
export const BUSINESS_NUMBER_REGEX = /^\d{3}-?\d{2}-?\d{5}$/;

// 법인등록번호 (123456-1234567)
export const CORPORATION_NUMBER_REGEX = /^\d{6}-?\d{7}$/;

// 통신판매업신고번호 (제2023-서울강남-1234호)
export const ONLINE_MARKETING_NUMBER_REGEX = /^제\d{4}-[가-힣]+-\d+호$/;

export const ACCOUNT_NUMBER_REGEX = {
  NONE: /.*/,
  // 숫자만 (10-14자리)
  GENERAL: /^\d{10,14}$/,
  WITH_HYPHEN: /^\d{3,6}-?\d{2,6}-?\d{3,6}$/,
} as const;

export const CREDIT_CARD_REGEX = {
  NONE: /.*/,
  WITH_HYPHEN: /^\d{4}-?\d{4}-?\d{4}-?\d{4}$/,
  NUMBER_ONLY: /^\d{16}$/,
  VISA: /^4\d{15}$/,
  MASTERCARD: /^5[1-5]\d{14}$/,
  AMEX: /^3[47]\d{13}$/,
} as const;

export const CAR_NUMBER_REGEX = {
  NONE: /.*/,
  // 일반 (12가1234)
  GENERAL: /^\d{2,3}[가-힣]\d{4}$/,
  // 신형 (123가1234)
  NEW: /^\d{3}[가-힣]\d{4}$/,
  OLD: /^[가-힣]\d{4}$/,
  ALL: /^(\d{2,3}[가-힣]\d{4}|[가-힣]\d{4})$/,
  // 전기차 (123거1234)
  ELECTRIC: /^\d{3}[거]\d{4}$/,
} as const;

export const POSTAL_CODE_REGEX = {
  NONE: /.*/,
  // 신우편번호 (5자리)
  NEW: /^\d{5}$/,
  // 구우편번호 (6자리, 123-456)
  OLD: /^\d{3}-?\d{3}$/,
} as const;

export const ADDRESS_REGEX = {
  ROAD: /^.+(시|도)\s.+(구|군)\s.+(로|길)\s\d+/,
  JIBUN: /^.+(시|도)\s.+(구|군)\s.+(동|가)\s\d+-?\d*/,
  BUILDING: /^.+(빌딩|타워|아파트|동|호)$/,
  DETAIL: /^\d+동\s?\d+호$/,
} as const;

export const NUMBER_ONLY_REGEX = /^\d+$/;

export const PRICE_REGEX = {
  NONE: /.*/,
  NUMBER_ONLY: /^\d+$/,
  // 쉼표 포함 (1,000)
  WITH_COMMA: /^[0-9,]+$/,
  // 소수점 포함 (1,234.56)
  WITH_DECIMAL: /^[0-9,]+(\.\d{1,2})?$/,
  WITH_WON: /^(₩|원)?\s?[0-9,]+(\.\d{1,2})?\s?(원)?$/,
  WITH_DOLLAR: /^(\$|USD|달러)?\s?[0-9,]+(\.\d{1,2})?\s?(USD|달러)?$/i,
  WITH_EURO: /^(€|EUR|유로)?\s?[0-9,]+(\.\d{1,2})?\s?(EUR|유로)?$/i,
  WITH_YEN: /^(¥|JPY|엔)?\s?[0-9,]+(\.\d{1,2})?\s?(JPY|엔)?$/i,
  WITH_POUND: /^(£|GBP|파운드)?\s?[0-9,]+(\.\d{1,2})?\s?(GBP|파운드)?$/i,
  WITH_CURRENCY:
    /^(₩|\$|€|¥|£|원|USD|EUR|JPY|GBP|달러|유로|엔|파운드)?\s?[0-9,]+(\.\d{1,2})?\s?(원|USD|EUR|JPY|GBP|달러|유로|엔|파운드)?$/i,
} as const;

export const DATE_REGEX = {
  NONE: /.*/,
  BASIC: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  DOT: /^\d{4}\.(0[1-9]|1[0-2])\.(0[1-9]|[12]\d|3[01])$/,
  SLASH: /^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/,
  COMPACT: /^\d{8}$/,
} as const;

export const TIME_REGEX = {
  NONE: /.*/,
  BASIC: /^([01]\d|2[0-3]):([0-5]\d)$/,
  WITH_SECONDS: /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
  AMPM: /^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM|am|pm)$/,
} as const;

export const KOREAN_ONLY_REGEX = /^[가-힣]+$/;
export const KOREAN_WITH_SPACE_REGEX = /^[가-힣\s]+$/;
export const ENGLISH_ONLY_REGEX = /^[A-Za-z]+$/;
export const ENGLISH_WITH_SPACE_REGEX = /^[A-Za-z\s]+$/;
export const ALPHANUMERIC_REGEX = /^[A-Za-z0-9]+$/;
export const NO_SPECIAL_CHAR_REGEX = /^[가-힣A-Za-z0-9]+$/;

export const NAME_REGEX = {
  NONE: /.*/,
  // 한글 (2-10자)
  KOREAN: /^[가-힣]{2,10}$/,
  // 영문 (2-50자, 공백 허용)
  ENGLISH: /^[A-Za-z\s]{2,50}$/,
  ALL: /^[가-힣A-Za-z\s]{2,50}$/,
} as const;

// 닉네임 (한글/영문/숫자, 2-20자)
export const NICKNAME_REGEX = /^[가-힣A-Za-z0-9._-]{2,20}$/;

// 아이디 (영문+숫자, 4-20자, 영문으로 시작)
export const USERNAME_REGEX = /^[A-Za-z][A-Za-z0-9]{3,19}$/;

export const KOREAN_VALIDATION = {
  COMPLETE: /^[가-힣]+$/,
  HAS_CONSONANT: /[ㄱ-ㅎ]/,
  HAS_VOWEL: /[ㅏ-ㅣ]/,
} as const;

export const URL_REGEX = {
  NONE: /.*/,
  BASIC: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  WITH_PROTOCOL: /^https?:\/\/([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  WITH_KOREAN: /^(https?:\/\/)?([\da-z가-힣.-]+)\.([a-z.]{2,6})([/\w가-힣 .-]*)*\/?$/,
  WITH_QUERY: /^https?:\/\/([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\??([^#\s]*)?$/,
} as const;

export const IP_REGEX = {
  NONE: /.*/,
  // IPv4 (0-255 범위 체크)
  V4: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  V6: /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,
} as const;

export const MAC_ADDRESS_REGEX = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

// 포트 번호 (1-65535)
export const PORT_REGEX =
  /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/;

export const FILE_EXTENSION_REGEX = {
  NONE: /.*/,
  IMAGE: /\.(jpg|jpeg|png|gif|bmp|webp|svg|ico|heic|heif)$/i,
  DOCUMENT: /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|hwp|txt|csv)$/i,
  ARCHIVE: /\.(zip|rar|7z|tar|gz|bz2)$/i,
  VIDEO: /\.(mp4|avi|mov|wmv|flv|mkv|webm|m4v)$/i,
  AUDIO: /\.(mp3|wav|flac|aac|ogg|m4a|wma)$/i,
  CODE: /\.(js|ts|jsx|tsx|py|java|cpp|c|go|rs|php|rb|swift)$/i,
} as const;

export const FILE_SIZE_REGEX = /^\d+(\.\d+)?\s?(B|KB|MB|GB|TB)$/i;

export const YOUTUBE_ID_REGEX =
  /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;

export const VERSION_REGEX = {
  BASIC: /^v?\d+\.\d+\.\d+$/,
  SEMVER:
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/,
} as const;

export const COLOR_REGEX = {
  NONE: /.*/,
  HEX: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  RGB: /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/,
  RGBA: /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0|1|0?\.\d+)\s*\)$/,
  HSL: /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/,
} as const;

export const DEVELOPER_REGEX = {
  GITHUB: /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i,
  NPM: /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/,
  ENV_VAR: /^[A-Z][A-Z0-9_]*$/,
  DOCKER_IMAGE: /^[a-z0-9]+(?:[._-][a-z0-9]+)*(?:\/[a-z0-9]+(?:[._-][a-z0-9]+)*)*$/,
  VARIABLE: /^[a-zA-Z_$][a-zA-Z0-9_$]*$/,
} as const;

export const HTML_TAG_REGEX = /<[^>]*>/g;
export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const BASE64_REGEX = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
export const JWT_REGEX = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;

export const EMAIL_DOMAIN_REGEX = {
  NAVER: /@naver\.com$/,
  DAUM: /@(daum\.net|kakao\.com)$/,
  GOOGLE: /@gmail\.com$/,
  NATE: /@nate\.com$/,
  HANMAIL: /@hanmail\.net$/,
  NAVER_WORKS: /@naver\.works$/,
} as const;

export const SOCIAL_MEDIA_REGEX = {
  INSTAGRAM: /^@?[A-Za-z0-9._]{1,30}$/,
  TWITTER: /^@?[A-Za-z0-9_]{1,15}$/,
  FACEBOOK: /^[A-Za-z0-9.]{5,}$/,
  KAKAO: /^[A-Za-z0-9._-]{4,20}$/,
  LINE: /^[A-Za-z0-9._-]{4,20}$/,
} as const;

export const COLLABORATION_REGEX = {
  SLACK_CHANNEL: /^#[a-z0-9-_]{1,80}$/,
  SLACK_MENTION: /^@[a-z0-9][a-z0-9._-]*$/,
  DISCORD_ID: /^\d{17,19}$/,
  NOTION_ID: /^[a-f0-9]{32}$/,
  JIRA_TICKET: /^[A-Z]+-\d+$/,
} as const;

export const SCHOOL_REGEX = {
  STUDENT_ID: /^\d{10}$/,
  CLASS: /^[1-6](-|\s?학년\s?)[1-9]\d?반?$/,
  NAME: /^.+(초등학교|중학교|고등학교|대학교|대학|유치원)$/,
  GRADE: /^[1-6]$/,
} as const;

export const COUPON_REGEX = {
  BASIC: /^[A-Z0-9]{6,16}$/,
  WITH_HYPHEN: /^[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+$/,
  UUID: /^[A-Z0-9]{8}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{12}$/,
} as const;

export const OTP_REGEX = {
  SIX_DIGIT: /^\d{6}$/,
  FOUR_DIGIT: /^\d{4}$/,
  EIGHT_DIGIT: /^\d{8}$/,
} as const;

export const SPECIAL_CHAR_ONLY_REGEX = /^[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/;

export const WHITESPACE_REGEX = {
  ALL: /\s/g,
  MULTIPLE: /\s+/g,
  TRIM: /^\s+|\s+$/g,
} as const;

export const HASHTAG_REGEX = /#[a-zA-Z가-힣0-9_]+/g;
export const MENTION_REGEX = /@[a-zA-Z가-힣0-9_]+/g;
