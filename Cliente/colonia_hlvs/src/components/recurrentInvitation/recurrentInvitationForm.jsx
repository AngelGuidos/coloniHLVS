import React from 'react';
import { TextField, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { LocalizationProvider, TimePicker, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import IconButton from '../buttons/IconButton/IconButton';

function RecurringInvitationForm({
    email,
    setEmail,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    weekDays,
    setWeekDays,
    weekDaysOptions,
    handleWeekDayChange,
    handleSubmit,
    formTitle,
  }) {
    return (
      <>
        <h2 className="mauri">{formTitle}</h2>
        <TextField
          variant="outlined"
          label="Email"
          className="input longText"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="longText input"
            label="Fecha Inicio"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
          />
          <DatePicker
            className="longText input"
            label="Fecha Fin"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
          />
        </LocalizationProvider>
        <div className="days">
          <p className="days_helper">Días de la semana</p>
          <FormGroup row>
            {weekDaysOptions.map((day, index) => (
              <FormControlLabel
                key={index}
                value={day.value}
                control={
                  <Checkbox
                    sx={{ color: '#0d1b2a', '&.Mui-checked': { color: '#0d1b2a' } }}
                    className="custom_box"
                    checked={weekDays.includes(day.value)}
                    onChange={handleWeekDayChange}
                  />
                }
                label={day.label}
                labelPlacement="bottom"
                className="custom_check"
              />
            ))}
          </FormGroup>
        </div>
        <div className="time_pickers">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Hora inicio"
              className="time input"
              value={startTime}
              onChange={(newValue) => setStartTime(newValue)}
            />
            <TimePicker
              label="Hora fin"
              className="time input"
              value={endTime}
              onChange={(newValue) => setEndTime(newValue)}
            />
          </LocalizationProvider>
        </div>
        <IconButton icon={null} text="Solicitar Invitacion" onClick={handleSubmit} />
      </>
    );
}
  
export default RecurringInvitationForm;