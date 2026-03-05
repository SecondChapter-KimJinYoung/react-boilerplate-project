import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/routes/routes';
import Button from '@/shared/components/atoms/Button';
import Checkbox from '@/shared/components/atoms/Checkbox';
import ErrorMessage from '@/shared/components/atoms/ErrorMessage';
import Input from '@/shared/components/atoms/Input';
import Label from '@/shared/components/atoms/Label';

import { useLoginForm } from '../hooks/useLoginForm';

const LoginPage = () => {
  const navigate = useNavigate();
  const form = useLoginForm();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">로그인</h2>
        <p className="mt-2 text-sm text-gray-500">계정 정보를 입력해주세요</p>
      </div>

      <form onSubmit={form.handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            placeholder="이메일을 입력해주세요"
            value={form.email}
            onChange={form.onEmailChange}
            error={!!form.errors.email}
            autoComplete="email"
          />
          <ErrorMessage message={form.errors.email} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={form.password}
            onChange={form.onPasswordChange}
            error={!!form.errors.password}
            autoComplete="current-password"
          />
          <ErrorMessage message={form.errors.password} />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="remember" checked={form.rememberEmail} onChange={form.onRememberChange} />
          <Label htmlFor="remember" className="cursor-pointer font-normal">
            이메일 저장
          </Label>
        </div>

        <Button type="submit" className="w-full" disabled={form.isLoading}>
          {form.isLoading ? '로그인 중...' : '로그인'}
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
