import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';
import { useCreateExample } from '../hooks/useExample';
import { useExampleForm } from '../hooks/useExampleForm';
import Button from '@/shared/components/atoms/Button';
import Input from '@/shared/components/atoms/Input';
import Textarea from '@/shared/components/atoms/Textarea';
import FormField from '@/shared/components/molecules/FormField';

const ExampleCreatePage = () => {
  const navigate = useNavigate();
  const createMutation = useCreateExample();
  const { form, errors, handleChange, validateForm } = useExampleForm({
    name: '',
    description: '',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    createMutation.mutate(
      { name: form.name.trim(), description: form.description.trim() },
      { onSuccess: () => void navigate(`${ROUTES.EXAMPLE.LIST}`) },
    );
  };

  return (
    <div className="space-y-6">
      <Button variant="link" onClick={() => void navigate(`${ROUTES.EXAMPLE.LIST}`)}>
        ← 뒤로가기
      </Button>

      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Example 등록</h2>

          <div className="space-y-6">
            <FormField label="제목" htmlFor="name" required error={errors.name}>
              <Input
                id="name"
                value={form.name}
                onChange={handleChange('name')}
                placeholder="제목이 들어갑니다."
                error={!!errors.name}
                disabled={createMutation.isPending}
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
                disabled={createMutation.isPending}
              />
            </FormField>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={createMutation.isPending}>
            저장하기
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ExampleCreatePage;
