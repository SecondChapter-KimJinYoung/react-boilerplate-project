import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { STORAGE_KEYS } from '@/api/api.constants';
import { ROUTES } from '@/routes/routes';
import Button from '@/shared/components/atoms/Button';
import Checkbox from '@/shared/components/atoms/Checkbox';
import ErrorMessage from '@/shared/components/atoms/ErrorMessage';
import Input from '@/shared/components/atoms/Input';
import Label from '@/shared/components/atoms/Label';
import { EMAIL_REGEX } from '@/shared/constants/regex.patterns';
import { useAuthStore } from '@/shared/stores/auth.store';
import { showToast } from '@/shared/utils/toast.utils';

interface LoginErrors {
  email?: string;
  password?: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState(
    () => localStorage.getItem(STORAGE_KEYS.REMEMBERED_EMAIL) ?? '',
  );
  const [password, setPassword] = useState('');
  const [rememberEmail, setRememberEmail] = useState(
    () => !!localStorage.getItem(STORAGE_KEYS.REMEMBERED_EMAIL),
  );
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: LoginErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    if (rememberEmail) {
      localStorage.setItem(STORAGE_KEYS.REMEMBERED_EMAIL, email.trim());
    } else {
      localStorage.removeItem(STORAGE_KEYS.REMEMBERED_EMAIL);
    }

    setIsLoading(true);

    // TODO: 아래 시뮬레이션을 실제 로그인 API 호출로 교체하세요.
    // 예시: const response = await post(API_ENDPOINTS.AUTH.LOGIN, { email, password }, { skipAuth: true });
    setTimeout(() => {
      login(
        { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' },
        { id: 1, name: '관리자', email: email.trim() },
      );
      showToast({ message: '로그인되었습니다.', variant: 'success' });
      void navigate(ROUTES.DASHBOARD);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">로그인</h2>
        <p className="mt-2 text-sm text-gray-500">계정 정보를 입력해주세요</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={!!errors.email}
            autoComplete="email"
          />
          <ErrorMessage message={errors.email} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            error={!!errors.password}
            autoComplete="current-password"
          />
          <ErrorMessage message={errors.password} />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={rememberEmail}
            onChange={(e) => setRememberEmail(e.target.checked)}
          />
          <Label htmlFor="remember" className="cursor-pointer font-normal">
            이메일 저장
          </Label>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? '로그인 중...' : '로그인'}
        </Button>
      </form>

      <div className="flex justify-center gap-4 text-sm text-gray-500">
        <button
          type="button"
          className="hover:text-gray-700"
          onClick={() => void navigate(ROUTES.AUTH.FIND_ID)}
        >
          아이디 찾기
        </button>
        <span>|</span>
        <button
          type="button"
          className="hover:text-gray-700"
          onClick={() => void navigate(ROUTES.AUTH.FIND_PASSWORD)}
        >
          비밀번호 찾기
        </button>
        <span>|</span>
        <button
          type="button"
          className="hover:text-gray-700"
          onClick={() => void navigate(ROUTES.AUTH.SIGNUP)}
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
