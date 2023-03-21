import { FC } from 'react';
import { Box, Button, Container, Grow, Typography } from '@mui/material';
import { Paths } from '@constants/paths';
import { useNavigate } from 'react-router-dom';
import { QuestionMarkTwoTone } from '@mui/icons-material';

export const Page404: FC = () => {
  const navigate = useNavigate();
  return (
    <Grow in>
      <Container
        sx={{
          display: 'flex',
          minHeight: '100%',
          alignItems: 'center',
          paddingTop: 10,
          paddingBottom: 10
        }}
      >
        <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
          <Typography variant="h3" paragraph>
            Sorry, page not found
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Sorry, we couldn't find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check your spelling.
          </Typography>
          <Box sx={{ m: 10 }}>
            <QuestionMarkTwoTone sx={{ fontSize: 300 }} />
          </Box>
          <Button size="large" variant="contained" onClick={() => navigate(Paths.HOME, { replace: true })}>
            Go to Home
          </Button>
        </Box>
      </Container>
    </Grow>
  );
};
