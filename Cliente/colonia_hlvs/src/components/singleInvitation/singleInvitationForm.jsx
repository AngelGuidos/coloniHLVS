import React from 'react';
import { TextField } from '@mui/material';
import { LocalizationProvider, TimePicker, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import IconButton from '../buttons/IconButton/IconButton';

function InvitationForm({
    title,
    email,
    setEmail,
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    onSubmit,
}) {
    return (
        <>
            <h2 className='mauri'>{title}</h2>
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
                    label='Fecha'
                    value={date}
                    onChange={(newValue) => setDate(newValue)}
                />
            </LocalizationProvider>
            <div className='time_pickers'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                        label='Hora Inicio'
                        className='time input'
                        value={startTime}
                        onChange={(newValue) => setStartTime(newValue)}
                    />
                    <TimePicker
                        label='Hora Fin'
                        className='time input'
                        value={endTime}
                        onChange={(newValue) => setEndTime(newValue)}
                    />
                </LocalizationProvider>
            </div>
            <IconButton
                icon={null}
                text={'Solicitar Invitación'} // Texto fijo o dinámico si lo necesitas como prop
                onClick={onSubmit}
            />
        </>
    );
}

export default InvitationForm;