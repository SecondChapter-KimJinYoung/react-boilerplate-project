import { useState, useCallback } from 'react';

export interface ExampleFormValues {
  name: string;
  description: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface ExampleFormErrors {
  name?: string;
  description?: string;
  status?: string;
}

export const useExampleForm = (initialValues: ExampleFormValues) => {
  const [form, setForm] = useState<ExampleFormValues>(initialValues);
  const [errors, setErrors] = useState<ExampleFormErrors>({});

  const handleChange = useCallback(
    (field: keyof ExampleFormValues) =>
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
        setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
      },
    [],
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: ExampleFormErrors = {};
    const name = form.name.trim();
    const description = form.description.trim();

    if (!name) newErrors.name = '제목을 입력해주세요.';
    else if (name.length < 2) newErrors.name = '제목은 최소 2자 이상이어야 합니다.';
    else if (name.length > 100) newErrors.name = '제목은 최대 100자까지 입력 가능합니다.';

    if (!description) newErrors.description = '내용을 입력해주세요.';
    else if (description.length < 10) newErrors.description = '내용은 최소 10자 이상이어야 합니다.';
    else if (description.length > 1000)
      newErrors.description = '내용은 최대 1000자까지 입력 가능합니다.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form.name, form.description]);

  const resetForm = useCallback((values: ExampleFormValues) => {
    setForm(values);
    setErrors({});
  }, []);

  return { form, errors, handleChange, validateForm, resetForm };
};
