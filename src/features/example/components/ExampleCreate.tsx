import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';
import { useCreateExample } from '../hooks/useExample';

interface FormErrors {
  name?: string;
  description?: string;
}

const ExampleCreate = () => {
  const navigate = useNavigate();
  const createMutation = useCreateExample();

  const [form, setForm] = useState({
    name: '',
    description: '',
  });
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

    createMutation.mutate(
      {
        name: form.name.trim(),
        description: form.description.trim(),
      },
      {
        onSuccess: () => {
          void navigate(`${ROUTES.DASHBOARD}${ROUTES.EXAMPLE.LIST}`);
        },
      },
    );
  };

  const handleBack = () => {
    void navigate(`${ROUTES.DASHBOARD}${ROUTES.EXAMPLE.LIST}`);
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={handleBack}
        className="text-sm text-gray-600 hover:text-gray-900"
      >
        ← 뒤로가기
      </button>

      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Example 등록</h2>

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
                  disabled={createMutation.isPending}
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
                  disabled={createMutation.isPending}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 저장하기 버튼 */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-4 py-2 bg-black text-white rounded-md disabled:opacity-50"
          >
            저장하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExampleCreate;
