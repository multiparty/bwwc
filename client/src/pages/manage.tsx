import { FC } from 'react';
import Box from '@mui/material/Box';
import { SessionManage } from '@components/session-manage/session-manage';
import { Layout } from '@layouts/layout';
import { NavBar } from '@components/navbar/navbar';

export const ManagePage: FC = () => {
  const drawerWidth = 20;
  return (
    <Layout title="Trusted Party" subtitle="Live Session Manager" maxWidth="lg">
      <NavBar />
      <Box sx={{ ml: drawerWidth }}>
        <SessionManage />
      </Box>
    </Layout>
  );
};
