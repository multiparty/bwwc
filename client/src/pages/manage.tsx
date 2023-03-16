import { FC } from 'react';
import { Stack } from '@mui/material';
import { SessionManage } from '@components/session-manage/session-manage';

export const ManagePage: FC = () => {
  return (
    <Stack spacing={5}>
      <SessionManage />
    </Stack>
  );
};
