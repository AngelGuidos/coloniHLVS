import React, { useState } from 'react';
import DayButton from '../../../components/buttons/dayButton/dayButton';
import Menu from '../../../components/menu/menu';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//MUI
import { Fab, useMediaQuery } from '@mui/material';
import WidgetsIcon from '@mui/icons-material/Widgets';

//sTYLES
import './Invitation.css'
import '../dashboard/dashboard.css';
import Navbar from '../../../components/navbar/navbar';

import residentButtons from '../../../assets/staticInfo/buttonsArray'
import RecurringInvitationForm from '../../../components/recurrentInvitation/recurrentInvitationForm';
import useAuth from '../../../hooks/useAuth';
import axios from '../../../api/axios';


function RecurrntInvitation() {
    const { token } = useAuth();
    const [email, setEmail] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [weekDays, setWeekDays] = useState([]);

    const weekDaysOptions = [
        { name: 'Lunes', value: 'MON', label: 'L' },
        { name: 'Martes', value: 'TUE', label: 'M' },
        { name: 'Miércoles', value: 'WED', label: 'X' },
        { name: 'Jueves', value: 'THU', label: 'J' },
        { name: 'Viernes', value: 'FRI', label: 'V' },
        { name: 'Sábado', value: 'SAT', label: 'S' },
        { name: 'Domingo', value: 'SUN', label: 'D' }
    ];

    const notify = () => {
        console.log('Invitacion solicitada con exito')
        toast.success("Invitacion solicitada con exito", {
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


    const handleWeekDayChange = (event) => {
        const { value, checked } = event.target;
        setWeekDays((prev) =>
            checked ? [...prev, value] : prev.filter((day) => day !== value)
        );
    };

    const limpiarForm = () => {
        setEmail('');
        setStartDate(null);
        setEndDate(null);
        setStartTime(null);
        setEndTime(null);
        setWeekDays([]);
    };

    const handleSubmit = async () => {
        if (!email || !startDate || !endDate || !startTime || !endTime || weekDays.length === 0) {
            toast.error('Todos los campos son obligatorios');
            return;
        }

        const invitacionResidente = {
            email,
            startDate: startDate.format('YYYY-MM-DD'),
            endDate: endDate.format('YYYY-MM-DD'),
            startTime: startTime.format('HH:mm:ss'),
            endTime: endTime.format('HH:mm:ss'),
            type: 'recurrente',
            weekDays
        };

        try {
            const response = await axios.post('/invitation/grant', invitacionResidente, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                limpiarForm();
                toast.success("Invitación solicitada con éxito");
            } else {
                notifyError('Error al solicitar la invitación');
            }
        } catch (error) {
            notifyError('Error al solicitar la invitación');
            console.error('Error al solicitar la invitación:', error);
        }
    };


    const handleClick = () => {
        const element = document.getElementById('hastaAbajoBaby');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    }

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
                    <RecurringInvitationForm
                        email={email}
                        setEmail={setEmail}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        startTime={startTime}
                        setStartTime={setStartTime}
                        endTime={endTime}
                        setEndTime={setEndTime}
                        weekDays={weekDays}
                        setWeekDays={setWeekDays}
                        weekDaysOptions={weekDaysOptions}
                        handleWeekDayChange={handleWeekDayChange}
                        handleSubmit={handleSubmit}
                        formTitle="Solicitar invitación recurrente"
                    />
                </div>
                <div className='Right' id='hastaAbajoBaby'>
                    <Menu buttons={residentButtons} className='funca' />
                </div>
            </div>
        </>
    )
}

export default RecurrntInvitation;