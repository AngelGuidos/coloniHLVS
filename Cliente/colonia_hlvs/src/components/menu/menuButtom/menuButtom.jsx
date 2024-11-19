import { useNavigate } from 'react-router-dom';
import './menuButtom.css'; // Asegúrate de definir estilos aquí
import useAuth from '../../../hooks/useAuth'; 
import { toast } from 'react-toastify';

const ButtonMenu = ({ icon, name, path, isSelected, onClick, logout}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    //console.log('Clic, path:', path); 
    if (logout) {
      logout();
      navigate('/login');
      //toast.success('Logout exitoso');
    } else {
      navigate(path);
    }
  };


  return (
    <div className={`button-menu ${isSelected ? 'selected' : ''}`} onClick={handleClick}>
      {icon}
      <span className="button-name">{name}</span>
    </div>
  );
};

export default ButtonMenu;
