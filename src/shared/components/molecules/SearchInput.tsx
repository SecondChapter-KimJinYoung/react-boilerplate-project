import { type FormEvent } from 'react';

import Input from '@/shared/components/atoms/Input';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
  placeholder?: string;
  className?: string;
}

const SearchInput = ({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder = '검색어를 입력하세요',
  className,
}: SearchInputProps) => {
  return (
    <form onSubmit={onSubmit} className={className}>
      <div className="relative">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-64 pr-8"
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchInput;
