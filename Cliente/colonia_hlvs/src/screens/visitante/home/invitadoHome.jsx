import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Menu from "../../../components/menu/menu";
import Navbar from "../../../components/navbar/navbar";
import CardDetail from "../../../components/cards/cardDetail/cardDetail";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import InsertInvitationRoundedIcon from '@mui/icons-material/InsertInvitationRounded';
import axios from '../../../api/axios';
import useAuth from '../../../hooks/useAuth';
import "./invitadoHome.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Fab, useMediaQuery } from '@mui/material';
import WidgetsIcon from '@mui/icons-material/Widgets';


function InvitadoHome() {
    const buttons = [
        { icon: <InsertInvitationRoundedIcon />, name: "Invitaciones", path: "/InvitadoHome" },
        { icon: <PersonRoundedIcon />, name: "Mi perfil", path: "/InvitadoHome/profileVisitante" },
        { icon: <LogoutRoundedIcon />, name: 'Cerrar sesión', path: '/login', logout: true },
    ];

    const { token } = useAuth();
    const [invitations, setInvitations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInvitations = async () => {
            try {
                const response = await axios.get('/invitation/mine', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response.data.data)
                if (response.status === 200) {
                    const invitationsData = response.data.data;
                    if (invitationsData && invitationsData.length > 0) {
                        setInvitations(invitationsData);
                    } else {
                        toast.warning('No tienes invitaciones disponibles');
                    }
                } else {
                    toast.error('Error al cargar las invitaciones');
                }
            } catch (error) {
                toast.error('Error al cargar las invitaciones');
                console.error(error);
            }
        };

        fetchInvitations();
    }, [token]);

    function handleCardClick(item) {
        navigate(`/invitadoHome/invitacion/${item.id}`);
    }

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
        <div>
            <ToastContainer />
            <Navbar />
            {matches && (
                <Fab size='medium' color='primary' className='fab' aria-label='Ir al menu' sx={fabStyle} onClick={handleClick}>
                    <WidgetsIcon />
                </Fab>
            )}
            <div className="father">
                <div className='Left' id='scroller'>
                    <h2 className="h2-invitation">Tus invitaciones</h2>
                    <div className="card-style-mt">
                        {invitations.map((item) => (
                            <CardDetail 
                                key={item.id} 
                                title={item.houseNumber} 
                                date={item.endDate} 
                                time={item.finishTime} 
                                onClick={() => handleCardClick(item)} 
                                isSelected={false} 
                            />
                        ))}
                    </div>
                </div>
                <div className='Right' id='hastaAbajoBaby'>
                    <Menu buttons={buttons} />
                </div>
            </div>
        </div>
    );
}

export default InvitadoHome;
