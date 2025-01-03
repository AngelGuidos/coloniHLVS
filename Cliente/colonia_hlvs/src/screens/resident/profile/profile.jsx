import "../dashboard/dashboard.css";
import '../resident-qr/resident-qr.css';
import './profile.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import Menu from '../../../components/menu/menu';
import { toast} from "react-toastify";

//mui
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import { TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import IconButton from "../../../components/buttons/IconButton/IconButton";
import Navbar from "../../../components/navbar/navbar";
import residentButtons from '../../../assets/staticInfo/buttonsArray';
import useAuth from "../../../hooks/useAuth";
import axios from "../../../api/axios";

function Profile() {

  const [isChecked, setIsChecked] = useState(false);
  const [textFieldValue, setTextFieldValue] = useState('');
  const { token } = useAuth();

  // Función para obtener información del usuario
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('/user/whoami', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const userData = response.data.data;
        console.log("I'm printing: " + userData.dui);

        if (userData.dui) {
          setTextFieldValue(userData.dui);
          if (userData.dui === "00000000-0") {
            setIsChecked(true);
          }
        }
      }
    } catch (error) {
      console.error("Error al obtener información del usuario:", error);
      toast.error("Error al cargar información del usuario.");
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
    if (event.target.checked) {
      setTextFieldValue('00000000-0');
    } else {
      setTextFieldValue('');
    }
  };

  const handleRegisterClick = async () => {
    try {
      const response = await axios.post('/user/update-dui', { dui: textFieldValue }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setTextFieldValue(textFieldValue);
        toast.success("DUI actualizado exitosamente!");
      } else {
        toast.error("Error al actualizar el DUI.");
      }
    } catch (error) {
      toast.error("Error al actualizar el DUI.");
      console.error('Error during DUI update:', error);
    }
  };

  const handleTextFieldChange = (event) => {
    const value = event.target.value;
    const regex = /^[0-9]{0,8}-?[0-9]{0,1}$/;

      if (regex.test(value)) {
        setTextFieldValue(value);
      }
    };

    return (
      <>
        <Navbar menuButtons={residentButtons}/>
        <div className="father" id="testDAD">
          <div className="Left">
            <h2> Mi perfil</h2>
            <div className='Hint'>
              <ErrorOutlineRoundedIcon className='icon' />
              Por seguridad solicitamos tu DUI, no te preocupes, esta información es confidencial.
            </div>
            <div className="dui_field">
              <TextField className="white" label='DUI' disabled={isChecked} value={textFieldValue}
                onChange={handleTextFieldChange}
                inputProps={{ maxLength: 10 }}
                placeholder="00000000-0"
              />
              <FormControlLabel className="check_field"
                value="end"
                control={<Checkbox
                  sx={{ color: '#0d1b2a', '&.Mui-checked': { color: '#0d1b2a' }, }}
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />}
                label="Soy menor"
                labelPlacement="end"
              />
            </div>
            <IconButton text={'Guardar Informacion'} onClick={handleRegisterClick} />
          </div>
          <div className="Right">
            <Menu buttons={residentButtons} className="funca" />
          </div>
        </div>
    </>
  );
}

export default Profile;
