import { useEffect, useState, useRef } from 'react';
import IconButton from '../../../components/buttons/IconButton/IconButton';
import './resident-qr.css';
import Menu from '../../../components/menu/menu';
import QRCode from "qrcode";
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import { Fab, useMediaQuery } from '@mui/material';
import WidgetsIcon from '@mui/icons-material/Widgets';
import Navbar from '../../../components/navbar/navbar';
import residentInChargeBtn from '../../../assets/staticInfo/buttonEncargadoArray';
import axios from '../../../api/axios';
import useAuth from '../../../hooks/useAuth';

function ResidentQr() {
  const [qrText, setQrText] = useState('');
  const { token } = useAuth();
  const [timeLeft, setTimeLeft] = useState(0); // 3 minutes in seconds
  const timerRef = useRef(null);

  const fetchQrCode = async () => {
    try {
      const response = await axios.post('/entrance/resident/qr', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setQrText(response.data.data.token);
      setTimeLeft(response.data.data.graceTime * 60); // Reset the timer to 3 minutes
    } catch (error) {
      console.error(error);
    }
  };

  const handlerQrCodeChanger = async () => {
    await fetchQrCode();
    if (qrText) {
      QRCode.toCanvas(document.getElementById('canvas'), qrText, { width: 300 }, function (error) {
        // if (error) console.error(error);
        // else console.log('QR code generated successfully!');
      });
    }
  };

  useEffect(() => {
    handlerQrCodeChanger();
  }, []);

  useEffect(() => {
    if (qrText) {
      QRCode.toCanvas(document.getElementById('canvas'), qrText, { width: 300 }, function (error) {
        // if (error) console.error(error);
        // else console.log('QR code generated successfully!');
      });
    }
  }, [qrText]);

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

  return (
    <>
      <Navbar menuButtons={residentInChargeBtn}/>
      <div className='father'>
        <div className='Left'>
          <h2>Tu código-QR</h2>
          <div className='Hint'>
            <ErrorOutlineRoundedIcon className='icon' />
            Su código QR se ha generado exitosamente, acerquese al escáner para ingresar.
          </div>
          <canvas id='canvas' className='myQR' />
          <div className={timeLeft === 0? "countdownAlert": "countdown-timer"}>
            Tiempo restante: {formatTime(timeLeft)}
          </div>
          <IconButton icon={<QrCode2RoundedIcon />} text='Refrescar' onClick={handlerQrCodeChanger} />
        </div>
        <div className='Right' id='hastaAbajoBaby'>
          <Menu buttons={residentInChargeBtn} className='funca' />
        </div>
      </div>
    </>
  );
}

export default ResidentQr;
