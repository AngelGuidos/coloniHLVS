import { useEffect, useState } from "react";
import Menu from "../../../components/menu/menu";
import './SolicitudesVisitas.css';
import residentInChargeBtn from '../../../assets/staticInfo/buttonEncargadoArray';
import InvitacionUnica from "./InvitacionUnica/InvitacionUnica";
import InvitacionRecurrente from "./InvitacionRecurrente/InvitacionRecurrente";
import SolicitudButton from "./AuxButtons/SolicitudButton";
import Navbar from "../../../components/navbar/navbar";
import axios from "../../../api/axios";
import useAuth from "../../../hooks/useAuth";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ErrorOutlineRounded, ReplayOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import IconButton from "../../../components/buttons/IconButton/IconButton";

const dayMapping = {
    MON: 'L',
    TUE: 'M',
    WED: 'X',
    THU: 'J',
    FRI: 'V',
    SAT: 'S',
    SUN: 'D'
};

const SolicitudVisitas = () => {
    const [invitaciones, setInvitaciones] = useState([]);
    const { token } = useAuth();

    const fetchInvitations = async () => {
        try {
            const response = await axios.get('/invitation/pending', {
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
                    nombre: inv.host.name,
                    dias: inv.weekDays.map(day => dayMapping[day.dayOfWeek])
                }));
                setInvitaciones(fetchedInvitations);

            }
        } catch (error) {
            toast.error('Error fetching active invitations');
            console.error('Error fetching active invitations:', error);
        }
    };

    const handleAceptar = async (id) => {
        try {
            const response = await axios.post('/invitation/update', {
                invitationId: id,
                action: 'accept'
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setInvitaciones(invitaciones.filter(invitacion => invitacion.id !== id));
                toast.success('Invitación aceptada');
            } else {
                toast.error('Error al aceptar la invitación');
            }
        } catch (error) {
            toast.error('Error al aceptar la invitación');
            console.error('Error accepting invitation:', error);
        }
    };

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
                setInvitaciones(invitaciones.filter(invitacion => invitacion.id !== id));
                toast.success('Invitación Rechazada');
            } else {
                toast.error('Error al cancelar la invitación');
            }
        } catch (error) {
            toast.error('Error al cancelar la invitación');
            console.error('Error canceling invitation:', error);
        }
    };

    useEffect(() => {
        fetchInvitations();
    }, [token]);

    return (
        <>
            <Navbar menuButtons={residentInChargeBtn}/>
            <div className='father'>
                <div className='Left' id='scroller'>
                    <h2 className="scroll_padd">Solicitudes de visita</h2>

                    {invitaciones.length === 0 ? (
                        <>
                            <div className='Hint'>
                                <ErrorOutlineRounded className='icon' />
                                Actualmente no tienes solicitudes de ningun miembro de tu familia.
                            </div>
                            <IconButton icon={<ReplayOutlined />} onClick={() => fetchInvitations()} text={'Recargar solicitudes'} className={'margin'}/>
                        </>
                    ) : (invitaciones.map((invitacion) => {
                        if (invitacion.tipo === 'unica') {
                            return (
                                <div className="card-unica-recurrente" key={invitacion.id}>
                                    <InvitacionUnica
                                        fecha={invitacion.fecha}
                                        hora={invitacion.hora}
                                        nombre={invitacion.nombre}
                                    />
                                    <SolicitudButton
                                        onAceptar={() => handleAceptar(invitacion.id)}
                                        onRechazar={() => handleRechazar(invitacion.id)}
                                    />
                                </div>
                            );
                        } else if (invitacion.tipo === 'recurrente') {
                            return (
                                <div className="card-unica-recurrente" key={invitacion.id}>
                                    <InvitacionRecurrente
                                        fechaInicio={invitacion.fechaInicio}
                                        fechaFin={invitacion.fechaFin}
                                        hora={invitacion.hora}
                                        nombre={invitacion.nombre}
                                        dias={invitacion.dias}
                                    />
                                    <SolicitudButton
                                        onAceptar={() => handleAceptar(invitacion.id)}
                                        onRechazar={() => handleRechazar(invitacion.id)}
                                    />
                                </div>
                            );
                        } else {
                            return null;
                        }
                    }))}
                </div>
                <div className='Right' id='hastaAbajoBaby'>
                    <Menu buttons={residentInChargeBtn} className='funca' />
                </div>
            </div>
        </>
    );
};

export default SolicitudVisitas;
