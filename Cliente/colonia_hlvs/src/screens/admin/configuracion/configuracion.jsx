import React from 'react';
import Menu from '../../../components/menu/menu';
import Navbar from '../../../components/navbar/navbar';
import '../../admin/home/adminHome.css';
import BasicBars from '../../../components/chart/chart';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CardContent from '@mui/material/CardContent';
import { TextField } from '@mui/material';
import QuantityInput from '../../../components/numberImput/numberImput';
import IconButton from '../../../components/buttons/IconButton/IconButton';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from '../../../hooks/useAuth';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import axios from '../../../api/axios';
import './configuracion.css';

function Configuracion() {
    const { token } = useAuth();
    const [qrGracePeriod, setQrGracePeriod] = useState(0);
    const [entranceGracePeriod, setEntranceGracePeriod] = useState(0);
    const [isQrUpdated, setIsQrUpdated] = useState(false);
    const [isEntranceUpdated, setIsEntranceUpdated] = useState(false);

    const buttons = [
        { icon: <ShowChartIcon />, name: 'Panel de Control', path: '/admin' },
        { icon: <HolidayVillageIcon />, name: 'Administrar Casa', path: '/admin/administrar-casa' },
        { icon: <SettingsIcon />, name: 'Configuración', path: '/admin/configuracion' },
        { icon: <LogoutIcon />, name: 'Cerrar sesión', logout: true },
      ];


      useEffect(() => {
        const fetchData = async () => {
            try {
                const qrResponse = await axios.get('/config/qr-period', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setQrGracePeriod(qrResponse.data.data);
    
                const entranceResponse = await axios.get('/config/entrace-grace-period', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEntranceGracePeriod(entranceResponse.data.data);
            } catch (error) {
                toast.error('Error al obtener los datos');
            }
        };
        fetchData();
    }, [token]);
    
    const handleQrUpdateClick = async () => {
        try {
            await axios.post('/config/qr-period', { codes: qrGracePeriod }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            setIsQrUpdated(false);
            toast.success(`El período de gracia de QR se actualizó a ${qrGracePeriod} minutos`);
        } catch (error) {
            toast.error('Error al actualizar el período de gracia de QR');
        }
    };
    
    const handleEntranceUpdateClick = async () => {
        try {
            await axios.post('/config/entrace-grace-period', { minutesGracePeriod: entranceGracePeriod }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            setIsEntranceUpdated(false);
            toast.success(`El período de gracia de entrada se actualizó a ${entranceGracePeriod} minutos`);
        } catch (error) {
            toast.error('Error al actualizar el período de gracia de entrada');
        }
    };
    

    return (
        <div className="parent">
            <div className="navbar">
                <Navbar menuButtons={buttons}/>
            </div>
            <div className="content">
                <h1 className='title'>Configuración</h1>
                <h1 className='title-r'>Tiempo de gracia de QR</h1>
                <div className='duracion-config'>
                    <QuantityInput value={qrGracePeriod} onChange={(e, newValue) => {
                        setQrGracePeriod(newValue);
                        setIsQrUpdated(true);
                    }} />
                    <IconButton className={isQrUpdated ? 'button-update-enabled' : 'button-update-disabled'}
                        icon='' text='Actualizar' onClick={handleQrUpdateClick} disabled={!isQrUpdated} />
                </div>
                <h1 className='title-r'>Tiempo de vigencia de entradas</h1>
                <div className='duracion-config'>
                    <QuantityInput value={entranceGracePeriod} onChange={(e, newValue) => {
                        setEntranceGracePeriod(newValue);
                        setIsEntranceUpdated(true);
                    }} />
                    <IconButton className={isEntranceUpdated ? 'button-update-enabled' : 'button-update-disabled'}
                        icon='' text='Actualizar' onClick={handleEntranceUpdateClick} disabled={!isEntranceUpdated} />
                </div>
            </div>
            <div className="menu-content">
                <Menu buttons={buttons} />
            </div>
        </div>
    );
}

export default Configuracion;
