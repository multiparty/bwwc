import { FC } from 'react';
import { Stack } from '@mui/material';
import { SessionCreateForm } from '@components/session-create/session-create';

export const CreatePage: FC = () => {
  return (
    <Stack spacing={5}>
      <SessionCreateForm />
    </Stack>
  );
};
