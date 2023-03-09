import { FC } from 'react';
import { Stack } from '@mui/material';
import { CompanyInputForm } from '@components/company-input/company-input';

export const HomePage: FC = () => {
  return (
    <Stack>
      <CompanyInputForm />
    </Stack>
  );
};
