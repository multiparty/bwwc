import { FC } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { Stack } from '@mui/material';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

type nameProp = {
  name: string;
};

export const NavBar = () => {
  const drawerWidth = 200;

  const NavBarButtons: FC<nameProp> = ({ name }) => {
    const navigate = useNavigate();

    function handleClick() {
      if (name == 'Home') {
        navigate('/');
      } else {
        navigate('/' + name.toLowerCase());
      }
    }

    return (
      <Box
        style={{
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Button
          variant="outlined"
          color="secondary"
          style={{
            width: `${(drawerWidth * 90) / 100}px`, // 90% of drawerWidth
            color: 'gray',
            borderColor: 'gray'
          }}
          onClick={() => handleClick()}
          endIcon={<SendIcon />}
        >
          {name}
        </Button>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', width: '0%' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            justifyContent: 'space-between'
          }
        }}
        variant="permanent"
        anchor="left"
      >
        <Divider sx={{ background: 'white' }} variant="middle" />
        <Stack spacing={3} alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
          <NavBarButtons name="Home" />
          <NavBarButtons name="Create" />
          <NavBarButtons name="Manage" />
        </Stack>
        <Divider sx={{ background: 'white' }} variant="middle" />
      </Drawer>
    </Box>
  );
};
