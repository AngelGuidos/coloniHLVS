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
import residentButtons from '../../../assets/staticInfo/buttonsArray';
import residentInChargeBtn from '../../../assets/staticInfo/buttonEncargadoArray';
import axios from '../../../api/axios';
import useAuth from '../../../hooks/useAuth';

function ResidentQr() {
  const [qrText, setQrText] = useState('');
  const { token } = useAuth();
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
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

  const fabStyle = {
    position: 'fixed',
    bottom: 16,
    right: 16,
    backgroundColor: '#0d1b2a',
    '&:hover': { backgroundColor: '#D2E0FB' }
  };

  const matches = useMediaQuery('(max-width:768px)');

  const handleClick = () => {
    const element = document.getElementById('hastaAbajoBaby');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Navbar menuButtons={residentButtons}/>
      {matches && (
        <Fab size='medium' color='primary' className='fab' aria-label='Ir al menu' sx={fabStyle} onClick={handleClick}>
          <WidgetsIcon />
        </Fab>
      )}
      <div className='father'>
        <div className='Left'>
          <h2 className='h2-qr'>Tu código-QR</h2>
          <div className='Hint'>
            <ErrorOutlineRoundedIcon className='icon' />
            Su código QR se ha generado exitosamente, acerquese al escáner para ingresar.
          </div>
          <canvas id='canvas' className='myQR' />
          <div className={timeLeft === 0? "countdownAlert": "countdown-timer"}>
            Tiempo restante: {formatTime(timeLeft)}
          </div>
          <div className='btn-refresh'>
            <IconButton icon={<QrCode2RoundedIcon />} text='Refrescar' onClick={handlerQrCodeChanger} />
          </div>
        </div>
        <div className='Right' id='hastaAbajoBaby'>
          <Menu buttons={residentButtons} className='funca' />
        </div>
      </div>
    </>
  );
}

export default ResidentQr;
