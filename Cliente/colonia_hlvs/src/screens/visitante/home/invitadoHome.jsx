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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ErrorOutlineOutlined, Replay10Rounded, ReplayOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import { color } from "@mui/system";
import IconButton from "../../../components/buttons/IconButton/IconButton";


function InvitadoHome() {
    const buttons = [
        { icon: <InsertInvitationRoundedIcon />, name: "Invitaciones", path: "/InvitadoHome" },
        { icon: <PersonRoundedIcon />, name: "Mi perfil", path: "/InvitadoHome/profileVisitante" },
        { icon: <LogoutRoundedIcon />, name: 'Cerrar sesión', path: '/login', logout: true },
    ];

    const { token } = useAuth();
    const [invitations, setInvitations] = useState([]);
    const navigate = useNavigate();

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
                    // toast.warning('No tienes invitaciones disponibles');
                }
            } else {
                toast.error('Error al cargar las invitaciones');
            }
        } catch (error) {
            toast.error('Error al cargar las invitaciones');
            console.error(error);
        }
    };


    useEffect(() => {
        
        fetchInvitations();
    }, [token]);

    function handleCardClick(item) {
        navigate(`/invitadoHome/invitacion/${item.id}`);
    }

    return (
        <div>
            <Navbar menuButtons={buttons}/>
            <div className="father">
                <div className='Left' id='scroller'>
                    <h2 className="h2-invitation">Tus invitaciones</h2>
                    <div className="card-style-mt">
                        {invitations.length === 0 ? (
                            <>
                                <div className='Hint'>
                                    <ErrorOutlineOutlined className='icon' />
                                    Actualmente no tienes invitacione proximas a nuestra residencia.
                                </div>
                                <IconButton icon={<ReplayOutlined />} onClick={() => fetchInvitations()} text={'Recargar invitaciones'}/> 
                            </>
                        ) : (invitations.map((item) => (
                            <CardDetail 
                                key={item.id} 
                                title={item.houseNumber} 
                                date={item.endDate} 
                                time={item.finishTime} 
                                onClick={() => handleCardClick(item)} 
                                isSelected={false} 
                            />
                        )))}
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
