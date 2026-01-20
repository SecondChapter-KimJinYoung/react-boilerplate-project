import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';
import { EXAMPLE_STATUS_OPTIONS } from '../constants/example.constants';
import { useExampleDetail, useUpdateExample } from '../hooks/useExample';

interface FormErrors {
  name?: string;
  description?: string;
  status?: string;
}

const ExampleUpdate = () => {
  const { id } = useParams<{ id: string }>();
  const exampleId = id ? Number(id) : 0;
  const navigate = useNavigate();

  const detailQuery = useExampleDetail(exampleId);
  const updateMutation = useUpdateExample();

  // detailQuery.data를 기반으로 form 초기값 계산
  const defaultForm = useMemo(() => {
    if (detailQuery.data) {
      return {
        name: detailQuery.data.name,
        description: detailQuery.data.description || '',
        status: detailQuery.data.status as 'ACTIVE' | 'INACTIVE',
      };
    }
    return {
      name: '',
      description: '',
      status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    };
  }, [detailQuery.data]);

  // key를 사용하여 detailQuery.data가 변경될 때 컴포넌트 리셋
  const formKey = detailQuery.data?.id || 0;

  // key가 변경되면 form이 자동으로 리셋됨 (useState 초기값은 key 변경 시 재설정됨)
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const handleSelectChange = (value: string | number) => {
    setForm((prev) => ({ ...prev, status: value as 'ACTIVE' | 'INACTIVE' }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = '제목을 입력해주세요.';
    } else if (form.name.trim().length < 2) {
      newErrors.name = '제목은 최소 2자 이상이어야 합니다.';
    } else if (form.name.trim().length > 100) {
      newErrors.name = '제목은 최대 100자까지 입력 가능합니다.';
    }

    if (!form.description.trim()) {
      newErrors.description = '내용을 입력해주세요.';
    } else if (form.description.trim().length < 10) {
      newErrors.description = '내용은 최소 10자 이상이어야 합니다.';
    } else if (form.description.trim().length > 1000) {
      newErrors.description = '내용은 최대 1000자까지 입력 가능합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    updateMutation.mutate(
      {
        id: exampleId,
        data: {
          name: form.name.trim(),
          description: form.description.trim(),
          status: form.status,
        },
      },
      {
        onSuccess: () => {
          void navigate(`${ROUTES.DASHBOARD}${ROUTES.EXAMPLE.DETAIL(exampleId)}`);
        },
      },
    );
  };

  const handleBack = () => {
    void navigate(`${ROUTES.DASHBOARD}${ROUTES.EXAMPLE.DETAIL(exampleId)}`);
  };

  if (detailQuery.isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-16 text-center">
        <p className="text-sm text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-sm text-red-600">데이터를 불러오는 중 오류가 발생했습니다.</p>
        <button
          type="button"
          onClick={() => void detailQuery.refetch()}
          className="mt-4 px-4 py-2 bg-white border border-gray-200 rounded-md text-sm"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6" key={formKey}>
      <button
        type="button"
        onClick={handleBack}
        className="text-sm text-gray-600 hover:text-gray-900"
      >
        ← 뒤로가기
      </button>

      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Example 수정</h2>

          <div className="space-y-6">
            {/* 제목 필드 */}
            <div className="flex items-start gap-4">
              <label
                htmlFor="name"
                className="w-32 shrink-0 text-sm font-semibold text-gray-500 pt-2"
              >
                제목 <span className="text-red-500">*</span>
              </label>
              <div className="flex-1">
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange('name')}
                  placeholder="제목이 들어갑니다."
                  className="w-full px-3 py-2 border border-gray-200 rounded-md"
                  disabled={updateMutation.isPending}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
            </div>

            {/* 내용 필드 */}
            <div className="flex items-start gap-4">
              <label
                htmlFor="description"
                className="w-32 shrink-0 text-sm font-semibold text-gray-500"
              >
                내용 <span className="text-red-500">*</span>
              </label>
              <div className="flex-1">
                <textarea
                  id="description"
                  value={form.description}
                  onChange={handleChange('description')}
                  placeholder="내용을 입력해 주세요."
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md"
                  disabled={updateMutation.isPending}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
            </div>

            {/* 상태 필드 */}
            <div className="flex items-start gap-4">
              <label
                htmlFor="status"
                className="w-32 shrink-0 text-sm font-semibold text-gray-500 pt-2"
              >
                상태
              </label>
              <div className="flex-1">
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) => handleSelectChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md"
                  disabled={updateMutation.isPending}
                >
                  {EXAMPLE_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 저장하기 버튼 */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-4 py-2 bg-black text-white rounded-md disabled:opacity-50"
          >
            저장하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExampleUpdate;
