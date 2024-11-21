import React, { useState, useEffect } from 'react';
import './navbar.css';
import Logo from '../../assets/images/Logo.png';
import useAuth from '../../hooks/useAuth';
import { Avatar, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

function Navbar( {menuButtons} ) {

  const navigate = useNavigate();
  const { user } = useAuth();
  const { logout } = useAuth();
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  /* to set is as in the figma design
  sx={{ background: 'rgba(256, 256, 256, 0.1)', margin: '0px 0px 5px 0px', borderRadius: '8px', width: '260px',  }}
  */ 

  const handleButtonClick = (path) => {
    navigate(path);
  };
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const drawerList = (
    <Box sx={{ width: 280, flexDirection: 'column' }} role="presentation" onClick={toggleDrawer(false)} className="innerDrawer">
      <Avatar alt={user ? user.name : 'Photo'} src={user ? user.photoURL : 'UK'} sx={{ width: 50, height: 50, margin: '15px' }}/>
      <List>
      {menuButtons.map((button, index) => (
        <ListItem key={button.name} disablePadding >
          <ListItemButton
            onClick={() => {
              if (button.logout) {
                handleButtonClick(button.path);
                logout(button.logout);
              
              } else {
                handleButtonClick(button.path, button.logout); // Navigate to the path
              }
            }}
          >
            <ListItemIcon sx={{color: 'white'}}>{button.icon}</ListItemIcon>
            <ListItemText primary={button.name}/>
          </ListItemButton>
        </ListItem>
      ))}
      </List>
    </Box>
  )

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isMobile ? (
        <>
        <MenuRoundedIcon onClick={toggleDrawer(true)} className='burguer' sx={{backgroundColor: '#0d1b2a', width: '44px', height: '44px', borderRadius: '8px', margin: '8px', color: 'white', padding: '6px', position: 'sticky', top: '8px', zIndex: 1000}}/>
        <div>
          {/* <Button onClick={toggleDrawer(true)}>Open drawer</Button> */}
          <Drawer open={open} onClose={toggleDrawer(false)} className='drawer'>
            {drawerList}
          </Drawer>
        </div>
        </>
      ) : (
        <nav className="navbar">
        <div className="logo">
          <img className='logo-img' src={Logo} alt="Logo" />
        </div>
        <div className="welcome-message">
          Bienvenido {user ? user.name : 'Invitado'}
        </div>
      </nav>
      )}
    </>
  );
  
}

export default Navbar;

