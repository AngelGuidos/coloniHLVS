import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import Menu from '../../../components/menu/menu';
import Navbar from '../../../components/navbar/navbar';
import DataGridDemo from '../../../components/table/table';
import './adminCasa.css';
import LogoutIcon from '@mui/icons-material/Logout';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import IconButton from '../../../components/buttons/IconButton/IconButton';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import useAuth from '../../../hooks/useAuth';

function AdminCasa() {
    const [rows, setRows] = useState([]);
    const { token } = useAuth();
    const navigate = useNavigate();

    const columns = [
       
        {
            field: 'Casa',
            headerName: 'Casa',
            type: 'string',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            editable: false,
        },
        {
            field: 'Capacidad',
            headerName: 'Capacidad',
            type: 'number',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            editable: false,
        },
        {
            field: 'Editar',
            headerName: 'Editar',
            type: 'number',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                return (
                    params.row.Casa !== '-' && params.row.Capacidad !== '-' ? (
                        <IconButton
                            className="icon-edit"
                            icon={<EditIcon sx={{ color: '#0d1b2a' }} />}
                            onClick={() => navigate(`editarinformacion/${params.row.houseNumber}`)} />
                    ) : null
                );
            }
        }
    ];

    const fetchHouses = async () => {
        try {
            const response = await axios.get('/house/all', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const houses = response.data.data;
            const rowsData = houses.map((house, index) => ({
                id: house.id,
                Casa: `#${house.houseNumber}`,
                Capacidad: house.capacity,
                houseNumber: house.houseNumber
            }));
            setRows(rowsData);
        } catch (error) {
            console.error('Error fetching houses', error);
        }
    };


    useEffect(() => {
        fetchHouses();
    }, [token]);

    const buttons = [
        { icon: <ShowChartIcon />, name: 'Panel de Control', path: '/admin' },
        { icon: <HolidayVillageIcon />, name: 'Administrar Casa', path: '/admin/administrar-casa' },
        { icon: <SettingsIcon />, name: 'Configuración', path: '/admin/configuracion' },
        { icon: <LogoutIcon />, name: 'Cerrar sesión', logout: true },
      ];


    return (
        <>
        <Navbar />
        <div className="father">            
            
            <div className="Left-2">
                <h1 id='title'>Administrar Casas</h1>
                <div className="button">
                    <IconButton icon='' text='Agregar / Eliminar casa' onClick={() => navigate('agregar-eliminar')} />
                </div>
                <h2 id='text'>Registro de Casas</h2>
                <div id='margenes'>
                    <DataGridDemo columns={columns} rows={rows} />
                </div>
            </div>
            <div className="Right">
                <Menu buttons={buttons} />
            </div>
            </div>
        </>
    
    );
}

export default AdminCasa;
