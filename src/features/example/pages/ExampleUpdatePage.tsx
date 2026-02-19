import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';
import { EXAMPLE_STATUS_OPTIONS } from '../constants/example.constants';
import { useExampleDetail, useUpdateExample } from '../hooks/useExample';
import { useExampleForm } from '../hooks/useExampleForm';
import Button from '@/shared/components/atoms/Button';
import Input from '@/shared/components/atoms/Input';
import Textarea from '@/shared/components/atoms/Textarea';
import Select from '@/shared/components/atoms/Select';
import FormField from '@/shared/components/molecules/FormField';
import LoadingState from '@/shared/components/molecules/LoadingState';
import ErrorState from '@/shared/components/molecules/ErrorState';

const ExampleUpdatePage = () => {
  const { id } = useParams<{ id: string }>();
  const exampleId = id ? Number(id) : 0;
  const navigate = useNavigate();

  const detailQuery = useExampleDetail(exampleId);
  const updateMutation = useUpdateExample();

  const defaultForm = useMemo(() => {
    if (detailQuery.data) {
      return {
        name: detailQuery.data.name,
        description: detailQuery.data.description || '',
        status: detailQuery.data.status as 'ACTIVE' | 'INACTIVE',
      };
    }
    return { name: '', description: '', status: 'ACTIVE' as const };
  }, [detailQuery.data]);

  const { form, errors, handleChange, validateForm, resetForm } = useExampleForm(defaultForm);

  useEffect(() => {
    if (detailQuery.data) {
      resetForm(defaultForm);
    }
  }, [detailQuery.data, defaultForm, resetForm]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    updateMutation.mutate(
      {
        id: exampleId,
        data: { name: form.name.trim(), description: form.description.trim(), status: form.status },
      },
      { onSuccess: () => void navigate(`${ROUTES.EXAMPLE.DETAIL(exampleId)}`) },
    );
  };

  if (detailQuery.isLoading) {
    return <LoadingState />;
  }

  if (detailQuery.isError || !detailQuery.data) {
    return <ErrorState onRetry={() => void detailQuery.refetch()} />;
  }

  return (
    <div className="space-y-6">
      <Button variant="link" onClick={() => void navigate(`${ROUTES.EXAMPLE.DETAIL(exampleId)}`)}>
        ← 뒤로가기
      </Button>

      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Example 수정</h2>

          <div className="space-y-6">
            <FormField label="제목" htmlFor="name" required error={errors.name}>
              <Input
                id="name"
                value={form.name}
                onChange={handleChange('name')}
                placeholder="제목이 들어갑니다."
                error={!!errors.name}
                disabled={updateMutation.isPending}
              />
            </FormField>

            <FormField label="내용" htmlFor="description" required error={errors.description}>
              <Textarea
                id="description"
                value={form.description}
                onChange={handleChange('description')}
                placeholder="내용을 입력해 주세요."
                rows={8}
                error={!!errors.description}
                disabled={updateMutation.isPending}
              />
            </FormField>

            <FormField label="상태" htmlFor="status">
              <Select
                id="status"
                value={form.status}
                onChange={handleChange('status')}
                options={EXAMPLE_STATUS_OPTIONS}
                disabled={updateMutation.isPending}
              />
            </FormField>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={updateMutation.isPending}>
            저장하기
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ExampleUpdatePage;
