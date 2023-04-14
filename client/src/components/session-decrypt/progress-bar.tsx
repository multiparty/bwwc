import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export function LinearWithValueLabel({ progress }: { progress: number }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (progress >= 100) {
      navigate('/result');
    }
  }, [progress]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={progress} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(progress)}%`}</Typography>
      </Box>
    </Box>
  );
}
