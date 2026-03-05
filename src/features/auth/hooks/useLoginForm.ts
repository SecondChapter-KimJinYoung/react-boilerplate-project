import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { STORAGE_KEYS } from '@/api/api-constants';
import { ROUTES } from '@/routes/routes';
import { EMAIL_REGEX } from '@/shared/constants/regex-patterns';
import { useAuthStore } from '@/shared/stores/auth-store';
import { showToast } from '@/shared/utils/toast-utils';

interface LoginFormErrors {
  email?: string;
  password?: string;
}

export const useLoginForm = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState(
    () => localStorage.getItem(STORAGE_KEYS.REMEMBERED_EMAIL) ?? '',
  );
  const [password, setPassword] = useState('');
  const [rememberEmail, setRememberEmail] = useState(
    () => !!localStorage.getItem(STORAGE_KEYS.REMEMBERED_EMAIL),
  );
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
  };

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
  };

  const onRememberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRememberEmail(e.target.checked);
  };

  const validate = (): boolean => {
    const newErrors: LoginFormErrors = {};
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

  return {
    email,
    password,
    rememberEmail,
    errors,
    isLoading,
    onEmailChange,
    onPasswordChange,
    onRememberChange,
    handleSubmit,
  };
};
