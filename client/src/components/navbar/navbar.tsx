import { FC, useState } from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import { Stack, Toolbar, IconButton, Drawer,Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

type nameProp = {
  name: string;
};

export const NavBar = () => {
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center'
      }}
      
      >
        <Button
          variant="outlined"
          style={{
            width: `${(drawerWidth * 60) / 100}px`, // 90% of drawerWidth
            color: 'gray',
            borderColor: 'transparent'
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
    <Box sx={{ display: 'flex', width: '100%' }}>
    <AppBar
      position="static"
      sx={{
        height: '45px',
        width: '100%',
        backgroundColor: 'white',
        '& .MuiDrawer-paper': {
          height: '60px',
          width: '100%',
          justifyContent: 'space-between'
        }
      }}
    >
      <Toolbar variant="dense">
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={handleMenuClick}>
          <MenuIcon sx={{color:'grey'}}/>
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}><NavBarButtons name="Home" /></MenuItem>
          <MenuItem onClick={handleClose}><NavBarButtons name="Create" /></MenuItem>
          <MenuItem onClick={handleClose}><NavBarButtons name="Manage" /></MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  </Box>
);
};