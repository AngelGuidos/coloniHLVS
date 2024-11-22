import IconButton from "../../../components/buttons/IconButton/IconButton";
import "./qrVisitante.css";
import Menu from "../../../components/menu/menu";
import QRCode from "qrcode";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import InsertInvitationRoundedIcon from "@mui/icons-material/InsertInvitationRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useEffect, useState, useRef } from 'react';
import Navbar from "../../../components/navbar/navbar";
import { useParams } from "react-router-dom";
import axios from '../../../api/axios';
import useAuth from '../../../hooks/useAuth';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function QrVisitante() {
  const { id } = useParams();
  const { token } = useAuth();
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  const buttons = [
    { icon: <InsertInvitationRoundedIcon />, name: "Invitaciones", path: "/InvitadoHome" },
    { icon: <PersonRoundedIcon />, name: "Mi perfil", path: "/InvitadoHome/profileVisitante" },
    { icon: <LogoutRoundedIcon />, name: 'Cerrar sesión', path: '/login', logout: true },
  ];

  const handlerQrCodeChanger = async () => {
    try {
      const response = await axios.post('/entrance/guest/qr', { invitationId: id }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.status === 200 && response.data.data.token) {
        const qrText = response.data.data.token;
        setTimeLeft(response.data.data.graceTime * 60); 
        QRCode.toCanvas(
          document.getElementById("canvas-visitante"),
          qrText,
          { toSJISFunc: QRCode.toSJIS, width: 300 },
          function (error) {
            if (error) {
              console.error(error);
              toast.error("Error generando el código QR.");
            } else {
              console.log("¡Código QR generado con éxito!");
              // toast.success("¡Código QR generado con éxito!");
            }
          }
        );
      } else {
        // Si la API no devuelve un token, muestra una advertencia.
        toast.warning("No se pudo obtener el token para el código QR.");
      }
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    if (timeLeft === 0) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };


  useEffect(() => {
    handlerQrCodeChanger();
  }, [id]);

  return (
    <div>
      <Navbar menuButtons={buttons}/>
      <div className="father">
        <div className='Left' id='scroller'>
          <div className="lefQr-container">
            <h2> Tu codigo-QR</h2>
            <div className="Hint-visitante">
              <ErrorOutlineRoundedIcon className="icon" />
              Su codigo QR se ha generado exitosamente, acerquese al escaner
              para ingresar.
            </div>
            <canvas id="canvas-visitante" className="myQR-visitante" />
            <div className={timeLeft === 0? "countdownAlert": "countdown-timer"}>
            Tiempo restante: {formatTime(timeLeft)}
            </div>
            <IconButton
              icon={<QrCode2RoundedIcon />}
              text="Refrescar"
              onClick={handlerQrCodeChanger}
            />
          </div>
        </div>
        <div className='Right' id='hastaAbajoBaby'>
          <Menu buttons={buttons} className="funca-visitante" />
        </div>
      </div>
    </div>
  );
}

export default QrVisitante;
