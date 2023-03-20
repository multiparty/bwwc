import { FC } from 'react';
import { Stack } from '@mui/material';
import { SessionManage } from '@components/session-manage/session-manage';
import { Layout } from '@layouts/layout';

export const ManagePage: FC = () => {
  return (
    <Layout title="Trusted Party" subtitle="Live Session Manager">
      <Stack spacing={5}>
        <SessionManage />
      </Stack>
    </Layout>
  );
};
