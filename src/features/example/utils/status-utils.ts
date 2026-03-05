export const getExampleStatusLabel = (status: string): string => {
  switch (status) {
    case 'ACTIVE':
      return '활성';
    case 'INACTIVE':
      return '비활성';
    default:
      return status;
  }
};
