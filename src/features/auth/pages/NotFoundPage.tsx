/**
 * 404 페이지
 *
 * 존재하지 않는 경로에 접근했을 때 표시합니다.
 */

import { useNavigate } from 'react-router-dom';
import Button from '@/shared/components/atoms/Button';
import { ROUTES } from '@/routes/routes';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="mt-4 text-lg text-gray-500">페이지를 찾을 수 없습니다</p>
        <p className="mt-2 text-sm text-gray-400">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button variant="secondary" onClick={() => void navigate(-1)}>
            이전 페이지
          </Button>
          <Button onClick={() => void navigate(ROUTES.DASHBOARD)}>홈으로 이동</Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
