import React, { useState, useEffect } from 'react';
import Menu from '../../../components/menu/menu';
import Navbar from '../../../components/navbar/navbar';
import './editarInfoCasa.css';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '../../../components/buttons/IconButton/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import { TextField, CardContent } from '@mui/material';
import DataGridDemo from '../../../components/table/table';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import axios from '../../../api/axios';
import useAuth from '../../../hooks/useAuth';

function EditarInfoCasa() {
    const [editMode, setEditMode] = useState(false);

    const [residente, setResidente] = useState('');
    const [tempResidente, setTempResidente] = useState('');

    const [nuevoResidente, setNuevoResidente] = useState('');

    const [capacidad, setCapacidad] = useState('');
    const [tempCapacidad, setTempCapacidad] = useState('');

    const [rows, setRows] = useState([]);

    const { houseNumber } = useParams();
    const { token } = useAuth();

    

    const fetchHouseData = async () => {
        try {
            const response = await axios.get(`/house/${houseNumber}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const house = response.data.data;
            const managerUser = house.houseUser.find(user => user.manager);
            setResidente(managerUser ? managerUser.user.email : '');
            setTempResidente(managerUser ? managerUser.user.email : '');
            setCapacidad(house.capacity);
            setTempCapacidad(house.capacity);
            setRows(house.houseUser.map((user, index) => ({
                id: index + 1,
                Contador: index + 1,
                Nombre: user.user.email,
                Encargado: user.manager ? 'Sí' : 'No'
            })));
        } catch (error) {
            console.error('Error fetching house data', error);
        }
    };

    const handleGuardarResidente = async () => {
        if (rows.length >= capacidad) {
            toast.error('La capacidad de la casa ya está completa.');
            setNuevoResidente('');
            return;
        }
        if (nuevoResidente === residente) {
            toast.error('El usuario administrador no puede ser miembro de la casa.');
            setNuevoResidente('');
            return;
        }
        try {
            const response = await axios.post("/house/add-member", {
                email: nuevoResidente,
                houseNumber: houseNumber
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            fetchHouseData();
            setNuevoResidente('');
            toast.success('Se ha registrado un nuevo residente.');
            
        } catch (error) {
            console.error('Error adding member to house:', error);
            setNuevoResidente('');
            toast.error('Error al agregar miembro a la casa.');
        }
    };

    const handleDelete = async (email) => {
        try {
            const response = await axios.post("/house/remove-member", {
                email: email,
                houseNumber: houseNumber
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            fetchHouseData();
            toast.success('Se ha eliminado al residente.');

        } catch (error) {
            console.error('Error removing member from house:', error);
            toast.error('Error al eliminar al residente.');
        }
    };

    const handleEditHouse = async () => {
        if (!tempResidente || !tempCapacidad) {
            toast.error('Debe completar ambos campos antes de guardar.');
            return;
        }
        if (rows.length === 0) {
            toast.error('Debe haber al menos un residente registrado antes de asignar un encargado.');
            return;
        }
        if (tempCapacidad < rows.length) {
            toast.error('Debe eliminar a un residente antes de disminuir la capacidad de la casa.');
            return;
        }

        const data = {
            houseNumber: houseNumber,
            capacity: tempCapacidad,
            managerEmail: tempResidente || residente,
        };

        try {
            const response = await axios.post("/house/update", data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            fetchHouseData();
            toast.success('La casa ha sido actualizada.');

        } catch (error) {
            console.error('Error updating house:', error);
            toast.error('Error al actualizar la casa.');
        }
    };

    const handleSave = () => {
        if (editMode) {
            handleEditHouse();
            setEditMode(false);
        }
    };

    useEffect(() => {
        fetchHouseData();
    }, [houseNumber, token]);

    const handleEditClick = () => {
        setEditMode(prevEditMode => {
            if (!prevEditMode) {
                /* setTempResidente('');
                setTempCapacidad(''); */
            }
            return !prevEditMode;
        });
    };

    const handleCapacidadChange = (event) => {
        setTempCapacidad(Number(event.target.value));
    };

    const handleResidenteChange = (event) => {
        setNuevoResidente(event.target.value);
    };

    const handleResidenteChangeEdit = (event) => {
        setTempResidente(event.target.value);
    };

    const buttons = [
        { icon: <ShowChartIcon />, name: 'Panel de Control', path: '/admin' },
        { icon: <HolidayVillageIcon />, name: 'Administrar Casa', path: '/admin/administrar-casa' },
        { icon: <SettingsIcon />, name: 'Configuración', path: '/admin/configuracion' },
        { icon: <LogoutIcon />, name: 'Cerrar sesión', logout: true },
      ];

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
            headerName: 'Email',
            type: 'string',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            editable: false,
        },
        {
            field: 'Encargado',
            headerName: 'Encargado',
            type: 'string',
            flex: 0.5,
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
                    onClick={() => handleDelete(params.row.Nombre)}
                    icon={<DeleteOutlineIcon sx={{ color: '#0d1b2a' }} />}
                />
            ),
        },
    ];

    return (
        <>
        <Navbar menuButtons={buttons}/>

        <div className="father">
            <div className="Left-2">
                <h1 id='title'>Administrar Casas</h1>
                <h2 id='text'>Información sobre la Casa</h2>
                <div className="info-casa-container">
                    <CardContent className='CardContent'>
                        <div className='casa-edit'>
                            <h2 id='text'>Casa #{houseNumber}</h2>
                            <IconButton className="icon-edit-info" icon={<EditIcon />} onClick={handleEditClick} />
                        </div>

                        <div>
                            <div className='casa-info-responsable'>
                                <h2 className='titulo'>Residente Responsable</h2>
                            {editMode ? (
                                <TextField value={tempResidente} onChange={handleResidenteChangeEdit} />
                                
                            ) : (
                                <p>{residente || 'No hay un residente asignado'}</p>
                            )}

                            </div>
                        </div>

                        <div className='casa-info-capacidad'>
                            <div>
                                <h2 className='titulo'>Capacidad de la Casa</h2>
                            </div>
                            {editMode ? (
                                <div className='casa-info-cambio'>
                                <TextField type='number' onChange={handleCapacidadChange} value={tempCapacidad} />
                                </div>
                            ) : (
                                <p className='capacidad'>{capacidad}</p>
                            )}
                        </div>
                        {editMode && (
                            <div style={{ paddingTop: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <IconButton className="icon-save-info" text={"Guardar"} onClick={handleSave} />
                            </div>
                        )}
                    </CardContent>
                </div>

                <div className="agregar-residente">
                    <CardContent className='CardContent'>
                        <div className='casa-edit-residentes'>
                            <h2 id='text'>Agregar Residente</h2>
                        </div>
                        <div className='text-field-agregar'>
                            <TextField id="outlined-basic" label="Email del Residente" variant="outlined" onChange={handleResidenteChange} value={nuevoResidente} />
                            <div className='boton-guardar'>
                                <IconButton className="icon-save-info" text={"Guardar"} onClick={handleGuardarResidente} />
                            </div>
                        </div>
                    </CardContent>
                </div>

                <h2 id='text'>Residentes de la Casa</h2>
                <div>
                    <CardContent className='CardContent'>
                            <DataGridDemo className="formato" columns={columns} rows={rows} />
                    </CardContent>
                </div>
                
            </div>
            <div className="Right">
                <Menu buttons={buttons} />
            </div>
        </div>
        </>
    );
}

export default EditarInfoCasa;
