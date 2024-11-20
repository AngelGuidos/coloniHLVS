import IconButton from '../../../components/buttons/IconButton/IconButton';
import Menu from '../../../components/menu/menu';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../../../api/axios';
import useAuth from '../../../hooks/useAuth';

//MUI
import { Fab, useMediaQuery } from '@mui/material';
import WidgetsIcon from '@mui/icons-material/Widgets';

//Styles
import '../dashboard/dashboard.css';
import './Invitation.css';
import Navbar from '../../../components/navbar/navbar';

import residentButtons from '../../../assets/staticInfo/buttonsArray';
import InvitationForm from '../../../components/singleInvitation/singleInvitationForm';

function SingleInvitation() {
    const [email, setEmail] = useState('');
    const [date, setDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const { token } = useAuth();

    const notifySuccess = () => {
        toast.success("Invitación solicitada con éxito", {
            position: "top-right",
            closeOnClick: true
        });
    };

    const notifyError = (message) => {
        toast.error(message, {
            position: "top-right",
            closeOnClick: true
        });
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

    const handleSubmit = async () => {
        const data = {
            email: email, // Puedes reemplazarlo por el email del nombre si es necesario
            startDate: date ? date.format('YYYY-MM-DD') : '',
            endDate: date ? date.format('YYYY-MM-DD') : '', // Misma fecha para startDate y endDate
            startTime: startTime ? startTime.format('HH:mm:ss') : '',
            endTime: endTime ? endTime.format('HH:mm:ss') : '',
            type: 'unica'
        };

        try {
            const response = await axios.post('/invitation/grant', data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                notifySuccess();
                clearForm();
            }
        } catch (error) {
            notifyError('Error al solicitar la invitación');
        }
    };
    const clearForm = () => {
        setEmail('');
        setDate(null);
        setStartTime(null);
        setEndTime(null);
    };

    return (
        <>
            <Navbar />
            {matches && (
                <Fab size='medium' color='primary' className='fab' aria-label='Ir al menu' sx={fabStyle} onClick={handleClick}>
                    <WidgetsIcon />
                </Fab>
            )}
            <div className='father'>
                <div className='Left'>
                    <InvitationForm
                        title="Solicitar invitación única"
                        email={email}
                        setEmail={setEmail}
                        date={date}
                        setDate={setDate}
                        startTime={startTime}
                        setStartTime={setStartTime}
                        endTime={endTime}
                        setEndTime={setEndTime}
                        onSubmit={handleSubmit}
                    />
                </div>
                <div className='Right' id='hastaAbajoBaby'>
                    <Menu buttons={residentButtons} className='funca' />
                </div>
            </div>
            <ToastContainer />
        </>
    );
}

export default SingleInvitation;