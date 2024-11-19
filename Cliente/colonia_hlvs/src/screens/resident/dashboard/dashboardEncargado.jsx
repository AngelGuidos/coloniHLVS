import './dashboard.css'
import { useNavigate } from 'react-router-dom';
import Menu from '../../../components/menu/menu';

//mui
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import Navbar from '../../../components/navbar/navbar';

import residentInChargeBtn from '../../../assets/staticInfo/buttonEncargadoArray';

function dashboard() {

  const navigate = useNavigate("");
  const handleSubmit = () => {
    navigate("mi-qr");
  };

  return (
    <>
      <Navbar />
      <div className="father" id="testDAD">
        <div className="Left">
          <h2> Bienvenido</h2>
          <button className="QR_Button" onClick={handleSubmit}>
            <QrCode2RoundedIcon className="icon" />
            <span>Generar QR</span>
          </button>
          <h4> Presione el boton para generar el codigo-QR</h4>
        </div>
        <div id="stay">
          <Menu buttons={residentInChargeBtn} className="funca" />
        </div>
      </div>
    </>
  );
}

export default dashboard;
