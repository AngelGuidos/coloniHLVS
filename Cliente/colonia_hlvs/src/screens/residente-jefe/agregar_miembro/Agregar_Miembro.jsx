import IconButton from '../../../components/buttons/IconButton/IconButton'
import Menu from "../../../components/menu/menu"

import residentInChargeBtn from '../../../assets/staticInfo/buttonEncargadoArray';
import CardContent from '@mui/material/CardContent';
import { TextField } from '@mui/material';
import { useState } from 'react';
import DataGridDemo from '../../../components/table/table';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { toast } from 'react-toastify';

import useAuth from '../../../hooks/useAuth';
import { useEffect } from 'react';
import axios from '../../../api/axios';

// Styles
import "../../resident/dashboard/dashboard.css"
import './Agregar_Miembro.css';
import Navbar from '../../../components/navbar/navbar';



const Agregar_Miembro = () => {
    const { token } = useAuth();
    const [rows, setRows] = useState([]);
    const [nuevoResidente, setNuevoResidente] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [capacidad, setCapacidad] = useState(0);

    const getResidentes = async () => {
        try {
            const response = await axios.get('/house/mine', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                const houseData = response.data.data;
                setHouseNumber(houseData.houseNumber);
                setCapacidad(houseData.capacity);

                const members = houseData.houseUser.map((member, index) => ({
                    id: member.user.id,
                    Contador: index + 1,
                    Nombre: member.user.name,
                    email: member.user.email,
                    isManager: member.manager  // Almacenar si el usuario es manager
                }));

                const emptySlots = houseData.capacity - members.length;
                for (let i = 0; i < emptySlots; i++) {
                    members.push({
                        id: `empty-${i}`,
                        Contador: members.length + 1,
                        Nombre: '-',
                    });
                }
                setRows(members);

            }
        } catch (error) {
            console.error('Error fetching house data:', error);
        }
    };



    const handleDelete = async (email, isManager) => {
        if (isManager) {
            toast.error("No se puede eliminar al residente encargado");
            return;
        }

        try {
            const response = await axios.post('/house/remove-member', {
                email: email,
                houseNumber: houseNumber
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            getResidentes();
            toast.success("Residente eliminado con éxito");

        } catch (error) {
            console.error('Error removing member:', error);
            toast.error("Error al eliminar residente");
        }
    };


    const handleResidenteChange = (event) => {
        setNuevoResidente(event.target.value);
    };

    const handleGuardarResidente = async () => {

        if (!nuevoResidente) {
            toast.error("El campo no puede estar vacío");
            return;
        }

        const currentMembersCount = rows.filter(row => row.Nombre !== '-').length;

        if (currentMembersCount >= capacidad) {
            toast.error("No se pueden agregar más residentes");
            return;
        }


        try {
            await axios.post('/house/add-member', {
                email: nuevoResidente,
                houseNumber: houseNumber
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setNuevoResidente('');
            toast.success("Residente agregado con éxito");
            getResidentes();

        } catch (error) {
            console.error('Error adding member:', error);
            toast.error("Error al agregar residente");
        }
    };

    useEffect(() => {
        getResidentes();
    }, []);

    const columns = [
        {
            field: 'Contador',
            headerName: 'Residente',
            type: 'number',
            flex: 0,
            headerAlign: 'center',
            align: 'center',
            editable: false,
        },
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
            field: 'Eliminar',
            headerName: '',
            flex: 0,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <IconButton
                    className="icon-delete"
                    onClick={() => handleDelete(params.row.email, params.row.isManager)} // Pasar email y estado de manager
                    icon={<DeleteOutlineIcon sx={{ color: '#0d1b2a' }} />}>
                </IconButton>
            ),
        }

    ];

    return (
        <>
            <Navbar menuButtons={residentInChargeBtn}/>
            <div className='father'>
                <div className='Left'>
                    <h2>Agregar miembro</h2>

                    <div className='casa-info-responsable-tabla residenteJ-cirt'>
                        <DataGridDemo className="formato" columns={columns} rows={rows} />
                    </div>

                    <div className="agregar-residente residenteJ-ar">
                        <CardContent className='CardContent'>
                            <h1 className='casa-title residenteJ-ct'>Agregar Residente</h1>
                            <div className='text-field-agregar'>
                                <TextField
                                    id="outlined-basic"
                                    label="Nombre del Residente"
                                    variant="outlined"
                                    onChange={handleResidenteChange}
                                    value={nuevoResidente}
                                />
                                <IconButton
                                    className="icon-save-info"
                                    text={"Guardar"}
                                    onClick={handleGuardarResidente}
                                />
                            </div>
                        </CardContent>
                    </div>
                </div>
                <div className='Right' id='hastaAbajoBaby'>
                    <Menu buttons={residentInChargeBtn} className='funca' />
                </div>
            </div>
        </>
    );
};

export default Agregar_Miembro;