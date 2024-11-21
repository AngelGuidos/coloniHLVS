import { useEffect, useState } from 'react';
import axios from '../../../api/axios';
import useAuth from '../../../hooks/useAuth';
import Menu from "../../../components/menu/menu";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import residentInChargeBtn from '../../../assets/staticInfo/buttonEncargadoArray';
import InvitacionUnica from '../solicitudes/InvitacionUnica/InvitacionUnica';
import InvitacionRecurrente from '../solicitudes/InvitacionRecurrente/InvitacionRecurrente';
import Navbar from '../../../components/navbar/navbar';

import './InvitacionesJefe.css';
import { FormControl } from '@mui/base';
import { MenuItem, Select } from '@mui/material';

const dayMapping = {
    MON: 'L',
    TUE: 'M',
    WED: 'X',
    THU: 'J',
    FRI: 'V',
    SAT: 'S',
    SUN: 'D'
};

const InvitacionesJefe = () => {
    const [activeInvitations, setActiveInvitations] = useState([]);
    const [pastInvitations, setPastInvitations] = useState([]);
    const [filter, setFilter] = useState('active');
    const { token } = useAuth();
    const [initialFetchDone, setInitialFetchDone] = useState(false);



    const notifyError = (message) => {
        toast.error(message, {
            position: "top-right",
            closeOnClick: true
        });
    };

    const fetchPastInvitations = async () => {
        try {
            const response = await axios.get('/invitation/old', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                const fetchedInvitations = response.data.data.map(inv => ({
                    id: inv.id,
                    tipo: inv.invitationType,
                    fecha: inv.startDate,
                    fechaInicio: inv.startDate,
                    fechaFin: inv.endDate,
                    hora: inv.starTime && inv.finishTime ? `${inv.starTime} - ${inv.finishTime}` : '',
                    nombre: inv.user.name,
                    dias: inv.weekDays.map(day => dayMapping[day.dayOfWeek])
                }));
                setPastInvitations(fetchedInvitations);

                if (fetchedInvitations.length === 0) {
                    toast.warn('No hay invitaciones pasadas');
                }
            }
        } catch (error) {
            notifyError('Error fetching past invitations');
            console.error('Error fetching past invitations:', error);
        }
    };

    const fetchActiveInvitations = async () => {
        try {
            const response = await axios.get('/invitation/approved', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                const fetchedInvitations = response.data.data.map(inv => ({
                    id: inv.id,
                    tipo: inv.invitationType,
                    fecha: inv.startDate,
                    fechaInicio: inv.startDate,
                    fechaFin: inv.endDate,
                    hora: inv.starTime && inv.finishTime ? `${inv.starTime} - ${inv.finishTime}` : '',
                    nombre: inv.user.name,
                    dias: inv.weekDays.map(day => dayMapping[day.dayOfWeek])
                }));
                setActiveInvitations(fetchedInvitations);

                if (fetchedInvitations.length === 0) {
                    toast.warn('No hay invitaciones activas');
                }
            }
        } catch (error) {
            notifyError('Error fetching active invitations');
            console.error('Error fetching active invitations:', error);
        }
    };

    if (!initialFetchDone) {
        fetchActiveInvitations();
        setInitialFetchDone(true);
    }


    const handleRechazar = async (id) => {
        try {
            const response = await axios.post('/invitation/update', {
                invitationId: id,
                action: 'delete'
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setActiveInvitations(activeInvitations.filter(invitacion => invitacion.id !== id));
                toast.success('Invitación cancelada');
            } else {
                notifyError('Error al cancelar la invitación');
            }
        } catch (error) {
            notifyError('Error al cancelar la invitación');
            console.error('Error canceling invitation:', error);
        }
    };

    const handleFilterChange = async (event) => {
        const selectedFilter = event.target.value;
        setFilter(selectedFilter);

        if (selectedFilter === 'active') {
            await fetchActiveInvitations();
        } else if (selectedFilter === 'past') {
            await fetchPastInvitations();
        }
    };


    const filteredInvitations = filter === 'active' ? activeInvitations : pastInvitations;

    return (
        <>
            <Navbar menuButtons={residentInChargeBtn}/>
            <ToastContainer />
            <div className='father'>
                <div className='Left' id='scroller'>
                    <FormControl>
                        <Select defaultValue={"active"} value={filter} onChange={handleFilterChange} className='IJ-dropdown'>
                            <MenuItem value="active">Invitaciones Activas</MenuItem>
                            <MenuItem value="past">Invitaciones Pasadas</MenuItem>
                        </Select>
                    </FormControl>

                    {filteredInvitations.map((invitacion) => {
                        if (invitacion.tipo === 'unica' && filter === 'active') {
                            return (
                                <div className="card-unica-recurrente" key={invitacion.id}>
                                    <InvitacionUnica
                                        fecha={invitacion.fecha}
                                        hora={invitacion.hora}
                                        nombre={invitacion.nombre}
                                    />
                                    <div className="centered-button">
                                        <button className="rechazar-button centered-reject"
                                            onClick={() => handleRechazar(invitacion.id)}>
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            );
                        } else if (invitacion.tipo === 'recurrente' && filter === 'active') {
                            return (
                                <div className="card-unica-recurrente" key={invitacion.id}>
                                    <InvitacionRecurrente
                                        fechaInicio={invitacion.fechaInicio}
                                        fechaFin={invitacion.fechaFin}
                                        hora={invitacion.hora}
                                        nombre={invitacion.nombre}
                                        dias={invitacion.dias}
                                    />
                                    <div className="centered-button">
                                        <button className="rechazar-button centered-reject"
                                            onClick={() => handleRechazar(invitacion.id)}>
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            );
                        } else if (invitacion.tipo === 'recurrente' && filter === 'past') {
                            return (
                                <div className="card-unica-recurrente" key={invitacion.id}>
                                    <InvitacionRecurrente
                                        fechaInicio={invitacion.fechaInicio}
                                        fechaFin={invitacion.fechaFin}
                                        hora={invitacion.hora}
                                        nombre={invitacion.nombre}
                                        dias={invitacion.dias}
                                    />
                                </div>
                            );
                        } else if (invitacion.tipo === 'unica' && filter === 'past') {
                            return (
                                <div className="card-unica-recurrente" key={invitacion.id}>
                                    <InvitacionUnica
                                        fecha={invitacion.fecha}
                                        hora={invitacion.hora}
                                        nombre={invitacion.nombre}
                                    />
                                </div>
                            );
                        } else {
                            return null;
                        }
                    })}
                </div>
                <div className='Right' id='hastaAbajoBaby'>
                    <Menu buttons={residentInChargeBtn} className='funca' />
                </div>
            </div>
        </>
    );
};

export default InvitacionesJefe;
