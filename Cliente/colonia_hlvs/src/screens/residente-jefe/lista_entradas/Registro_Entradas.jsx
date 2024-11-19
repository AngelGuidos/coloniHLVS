import { useEffect, useState } from "react";
import Menu from "../../../components/menu/menu";
import './Registro_Entradas.css';

import residentInChargeBtn from '../../../assets/staticInfo/buttonEncargadoArray';
import DataGridDemo from '../../../components/table/table';
import Navbar from "../../../components/navbar/navbar";
import { Fab, useMediaQuery } from '@mui/material';
import WidgetsIcon from '@mui/icons-material/Widgets';
import axios from '../../../api/axios';
import useAuth from '../../../hooks/useAuth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Registro_Entradas = () => {
    const [rows, setRows] = useState([]);
    const { token } = useAuth();

    const columns = [
        {
            field: 'Nombre',
            headerName: 'Nombre',
            type: 'string',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            editable: false,
        },
        { 
            field: 'Fecha', 
            headerName: 'Fecha', 
            type: 'String', 
            flex: 1, 
            headerAlign: 'center', 
            align: 'center', 
            editable: false,
          },
          { 
            field: 'Hora', 
            headerName: 'Hora', 
            type: 'time', 
            flex: 1, 
            headerAlign: 'center', 
            align: 'center', 
            editable: false, 
          },
    ];

    const fetchEntrances = async () => {
        try {
            const response = await axios.get('/entrance/house-history', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data.data);
            if (response.status === 200 && response.data.data.length > 0) {
                const fetchedRows = response.data.data.map(entrance => ({
                    id: entrance.id,
                    Nombre: entrance.nombre,
                    Fecha: entrance.date.split('T')[0],
                    Hora: entrance.date.split('T')[1].split('.')[0],
                }));
                setRows(fetchedRows);
                //toast.success('Entradas cargadas correctamente');
            } else {
                toast.warning('No hay registros de entradas disponibles para esta casa');
            }
        } catch (error) {
            toast.error("Error al obtener los datos de entradas.");
        }
    };

    useEffect(() => {
        fetchEntrances();
    }, [token]);

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
    }

    return (
        <>
            <Navbar />
            <ToastContainer />
            {matches && (
                <Fab size='medium' color='primary' className='fab' aria-label='Ir al menu' sx={fabStyle} onClick={handleClick}>
                    <WidgetsIcon />
                </Fab>
            )}
            <div className='father'>
                <div className='Left'>
                    <h2>Registro entrada a casa</h2>
                    <div className="table-container table-container-secondary">
                        <DataGridDemo columns={columns} rows={rows} />
                    </div>
                </div>
                <div className='Right' id='hastaAbajoBaby'>
                    <Menu buttons={residentInChargeBtn} className='funca' />
                </div>
            </div>
        </>
    );
}

export default Registro_Entradas;
