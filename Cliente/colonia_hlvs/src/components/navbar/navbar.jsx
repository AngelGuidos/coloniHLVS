import React from 'react';
import './navbar.css';
import Logo from '../../assets/images/Logo.png';
import useAuth from '../../hooks/useAuth';

function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <div className="logo">
        <img className='logo-img' src={Logo} alt="Logo" />
      </div>
      <div className="welcome-message">
        Bienvenido {user ? user.name : 'Invitado'}
      </div>
    </nav>
  );
}

export default Navbar;
