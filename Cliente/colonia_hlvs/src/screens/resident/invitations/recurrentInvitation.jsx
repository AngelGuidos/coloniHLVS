import React, { useState } from 'react';
import IconButton from '../../../components/buttons/IconButton/IconButton';
import DayButton from '../../../components/buttons/dayButton/dayButton';
import Menu from '../../../components/menu/menu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//MUI
import { Checkbox, FormControl, FormControlLabel, FormGroup, TextField, Fab, useMediaQuery } from '@mui/material';
import { LocalizationProvider, TimePicker, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import WidgetsIcon from '@mui/icons-material/Widgets';


//sTYLES
import './Invitation.css'
import '../dashboard/dashboard.css';
import Navbar from '../../../components/navbar/navbar';

import residentButtons from '../../../assets/staticInfo/buttonsArray'
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
                    <h2 className='mauri'>Solicitar invitación recurrente</h2>
                    <TextField
                        variant='outlined'
                        label='Email'
                        className='input longText'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            className='longText input'
                            label='Fecha Inicio'
                            value={startDate}
                            onChange={(newValue) => setStartDate(newValue)}
                        />
                        <DatePicker
                            className='longText input'
                            label='Fecha Fin'
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                        />
                    </LocalizationProvider>
                    <div className='days'>
                        <p className='days_helper'>Dias de la semana</p>
                        <FormGroup row>
                            {/* <FormControlLabel 
                                value="Monday"
                                control={<Checkbox sx={{color: '#0d1b2a', '&.Mui-checked': {color: '#0d1b2a'},}}/>}
                                label="L"
                                labelPlacement='bottom'
                            /> */}
                            {weekDaysOptions.map((day, index) => (
                                <FormControlLabel
                                    key={index}
                                    value={day.value}
                                    control={
                                        <Checkbox
                                            sx={{ color: '#0d1b2a', '&.Mui-checked': { color: '#0d1b2a' }, }}
                                            className='custom_box'
                                            checked={weekDays.includes(day.value)}
                                            onChange={handleWeekDayChange}
                                        />
                                    }
                                    label={day.label}
                                    labelPlacement='bottom'
                                    className='custom_check'
                                />
                            ))}
                        </FormGroup>

                    </div>
                    <div className='time_pickers'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                                label='Hora inicio'
                                className='time input'
                                value={startTime}
                                onChange={(newValue) => setStartTime(newValue)}
                            />
                            <TimePicker
                                label='Hora fin'
                                className='time input'
                                value={endTime}
                                onChange={(newValue) => setEndTime(newValue)}
                            />
                        </LocalizationProvider>
                    </div>
                    <IconButton icon={null} text={'Solicitar Invitacion'} onClick={handleSubmit} />
                </div>
                <div className='Right' id='hastaAbajoBaby'>
                    <Menu buttons={residentButtons} className='funca' />
                </div>
            </div>
        </>
    )
}

export default RecurrntInvitation;