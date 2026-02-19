/**
 * 인증 페이지 레이아웃
 *
 * 로그인, 회원가입, 비밀번호 찾기 등 인증 관련 페이지에 사용합니다.
 * 화면 중앙에 카드 형태로 콘텐츠를 배치합니다.
 */

import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold text-gray-900">
            {import.meta.env.VITE_APP_NAME || '프로젝트'}
          </h1>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
