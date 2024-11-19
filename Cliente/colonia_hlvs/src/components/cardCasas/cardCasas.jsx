import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import IconButton from '../buttons/IconButton/IconButton';
import './cardCasas.css';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';

export function BasicCard({ fetchHouses }) {
  const { token } = useAuth();  
  const [houseNumber, setHouseNumber] = useState('');
  const [houseCapacity, setHouseCapacity] = useState('');
  const [isUpdated, setIsUpdated] = useState(false);
  const buttonClass = isUpdated ? 'button-update-enabled' : 'button-update-disabled';

  const handleHouseNumberChange = (event) => {
    setHouseNumber(event.target.value);
    checkIfUpdated(event.target.value, houseCapacity);
  };

  const handleHouseCapacityChange = (event) => {
    setHouseCapacity(event.target.value);
    checkIfUpdated(houseNumber, event.target.value);
  };

  const checkIfUpdated = (houseNumber, houseCapacity) => {
    if (houseNumber && houseCapacity) {
      setIsUpdated(true);
    } else {
      setIsUpdated(false);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await axios.post('/house/create', {
        number: houseNumber,
        capacity: houseCapacity
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('La casa se agregó correctamente');
      fetchHouses(); 

    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error('La casa ya existe');
      } else {
        toast.error('Error al agregar la casa');
      }
      console.error('Error al agregar la casa:', error);
    }

    setHouseNumber('');
    setHouseCapacity('');
    setIsUpdated(false);

    
  };

  return (
    <Card className="card">
      <CardContent>
        <Box className="container">
          <h1>Agregar Casa</h1>

          <TextField
            type='text'
            variant='outlined'
            label='Numero de casa'
            className='input longText'
            inputProps={{ style: { textAlign: 'center' } }}
            value={houseNumber}
            onChange={handleHouseNumberChange}
          />

          <TextField
            type='number'
            variant='outlined'
            label='Capacidad de la casa'
            className='text-field longText'
            inputProps={{ style: { textAlign: 'center' } }}
            value={houseCapacity}
            onChange={handleHouseCapacityChange}
          />

          <IconButton
            className={buttonClass}
            icon=''
            text='Agregar'
            disabled={!houseNumber || !houseCapacity}
            onClick={handleAdd}
          />

        </Box>
      </CardContent>
    </Card>
  );
}


export function SingleTextFieldCard({ fetchHouses }) {
  const { token } = useAuth();  
  const [inputValue, setInputValue] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const buttonClass = isUpdated ? 'button-delete-enabled' : 'button-delete-disabled';

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    checkIfUpdated(event.target.value, isChecked);
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
    checkIfUpdated(inputValue, event.target.checked);
  };

  const checkIfUpdated = (inputValue, isChecked) => {
    if (inputValue && isChecked) {
      setIsUpdated(true);
    } else {
      setIsUpdated(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.post(`/house/delete/${inputValue}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

        toast.success('La casa se eliminó correctamente');
        fetchHouses();
        
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error('Casa no encontrada');
      } else {
        toast.error('Error al eliminar la casa');
      }
      console.error('Error al eliminar la casa:', error);
    }

    setInputValue('');
    setIsChecked(false);
    setIsUpdated(false);
  };

  return (
    <Card className='card'>
      <CardContent>
        <Box className="container">
          <h1>Eliminar Casa</h1>

          <TextField
            type='text'
            variant='outlined'
            label='Numero de casa'
            className='input longText'
            inputProps={{ style: { textAlign: 'center' } }}
            value={inputValue}
            onChange={handleInputChange}
          />

          <FormControlLabel
            control={<Checkbox sx={{ mr: 0 }} checked={isChecked} onChange={handleCheckboxChange} />}
            label={
              <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                Estoy seguro de eliminar esta casa
              </Typography>
            }
            sx={{ maxWidth: '75%', mt: 0, mb: 2 }}
          />

          <IconButton
            className={buttonClass}
            icon=''
            text='Eliminar'
            disabled={!inputValue || !isChecked}
            onClick={handleDelete}
          />

        </Box>
      </CardContent>
    </Card>
  );
}