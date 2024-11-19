import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const currencies = [
  {
    value: 'Casa #1',
    label: 'Casa #1',
  },
  {
    value: 'Casa #2',
    label: 'Casa #2',
  },
  {
    value: 'Casa #3',
    label: 'Casa #3',
  },
  {
    value: 'Casa #4',
    label: 'Casa #4',
  },
];

export default function SelectTextFields() {
  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '350px' },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          id="outlined-select-currency"
          select
          label="Seleccione una Casa"
          defaultValue=""
          sx={{
            fontFamily: 'Poppins',
            boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.10)',
          }}
        >
          <MenuItem value="">
            <p>Ninguna</p>
          </MenuItem>
          {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
    </Box>
  );
}
