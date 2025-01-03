import React, { useState, useEffect, useRef } from 'react';
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Navbar from "../../../components/navbar/navbar";
import { Html5QrcodeScanner } from "html5-qrcode";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import ConfirmationView from "../../../components/estados/Confirmacion/ConfirmationView"; // Asegúrate de que la ruta sea correcta
import DeniedView from '../../../components/estados/Denegado/DeniedView';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./homeVigilante.css";
import { useNavigate } from "react-router-dom";
import useAuth from '../../../hooks/useAuth';
import axios from "../../../api/axios";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { LogoutRounded } from '@mui/icons-material';

const HomeVigilante = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [dui, setDui] = useState("");
  const [name, setName] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [comment, setComment] = useState("");
  const [qrError, setQrError] = useState(false);
  const [door, setDoor] = useState(1);
  const doorRef = useRef(door);
  const [errors, setErrors] = useState({});
  const [houses, setHouses] = useState([]);


  const navigate = useNavigate();
  const { logout, token } = useAuth();

  const validateEntrance = async (res_token) => {
    console.log("Sending request with door:", doorRef.current);
    try {
      const response = await axios.post('/entrance/validate-entrance', {
        token: res_token,
        door: doorRef.current
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        toast.success("Entrada registrada exitosamente!");
        setQrError(false);
      } else {
        toast.error("Error al registrar la entrada.");
        setQrError(true);
      }
    } catch (error) {
      toast.error("Error al registrar la entrada.");
      console.error('Error during QR validation:', error);
      setQrError(true);
    }
  };

  const validateFields = () => {
    const newErrors = {};

    // Validar campos vacíos
    if (!name.trim()) newErrors.name = "Campo nombre vacío";
    if (!houseNumber.trim()) newErrors.houseNumber = "Campo número de casa vacío";
    if (!dui.trim()) newErrors.dui = "Campo DUI vacío";
    if (!comment.trim()) newErrors.comment = "Campo comentario vacío";

    // Validar formato
    const nameRegex = /^[a-zA-Z\s]+$/;
    const houseNumberRegex = /^[a-zA-Z0-9\s]+$/;
    const duiRegex = /^[0-9]{8}-[0-9]{1}$/;
    const commentRegex = /^[a-zA-Z0-9\s]+$/;

    if (name && !nameRegex.test(name)) newErrors.name = "Solo se permiten letras";
    if (houseNumber && !houseNumberRegex.test(houseNumber)) {
      newErrors.houseNumber = "Revisar formato número de casa";
    } else if (
      houses.length > 0 &&
      !houses.some((house) => house.houseNumber === houseNumber)
    ) {
      newErrors.houseNumber = "El número de casa no existe.";
    }
    if (dui && !duiRegex.test(dui)) newErrors.dui = "Revisar formato. Ej: 12345678-9";
    if (comment && !commentRegex.test(comment)) newErrors.comment = "Solo se permite letras y números";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  const success = (result) => {
    //console.log("Scan result:", result); // Verifica el resultado del escaneo
    validateEntrance(result); // Llama a la función de validación con el resultado del escaneo
    setScanResult(result);
    setIsScanning(false);
    setShowConfirmation(true);

    // Volver al escáner después de mostrar la confirmación por unos segundos
    setTimeout(() => {
      setShowConfirmation(false);
      setScanResult(null);
      setIsScanning(true);
    }, 3000); // Mostrar la confirmación por 3 segundos
  };

  const error = (err) => {
    console.warn(err);
  };

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await axios.get("/house/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setHouses(response.data.data);
        } else {
          toast.error("No se pudo obtener la lista de casas.");
        }
      } catch (error) {
        toast.error("Error al obtener la lista de casas.");
        console.error(error);
      }
    };

    fetchHouses();
  }, [token]);

  useEffect(() => {
    if (isScanning) {
      const scanner = new Html5QrcodeScanner("reader", {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      });

      scanner.render(success, error);

      return () => {
        scanner.clear().catch((error) => console.error('Failed to clear the scanner:', error));
      };
    }
  }, [isScanning]);

  const handleScanClick = () => {
    setIsScanning(true);
  };

  const handleDuiChange = (event) => {
    const value = event.target.value;
    const regex = /^[0-9]{0,8}-?[0-9]{0,1}$/; // Allow up to 8 digits, an optional hyphen, and 1 digit after the hyphen
    if (regex.test(value)) {
      setDui(value);
    }
  };

  const clearInputFields = () => {
    setName("");
    setDui("");
    setHouseNumber("");
    setComment("");
  };

  const handleRegisterClick = async () => {
    if (!validateFields()) {
      toast.error("Por favor corrige los errores antes de continuar.");
      return;
    }

    const entranceData = {
      name,
      dui,
      comment,
      houseNumber,
      door
    };

    try {
      const response = await axios.post('/entrance/manual-entry', entranceData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        toast.success("Registro exitoso!");
        clearInputFields();
      } else {
        toast.error("Error al registrar la entrada.");
      }
    } catch (error) {
      toast.error("Error al registrar la entrada.");
      console.error('Error during manual entry registration:', error);
    }
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  const handleSwitchChange = (event) => {
    const isChecked = event.target.checked;
    setDoor(isChecked ? 2 : 1);
    doorRef.current = isChecked ? 2 : 1;
    console.log("Switch changed:", isChecked ? "Entrada Vehicular" : "Entrada Peatonal");
  };

  return (
    <div className="containerMain">
      <Navbar menuButtons={[{ icon: <LogoutRounded />, name: "Cerrar Sesion", path: "/", logout: true }]} />
      <div className="container-vigi">
        <div className="qr-scanner-container">
          <h2 className="h2-qr">Escanear QR</h2>
          <div className="qr-container-reader">
            {showConfirmation ? (
              qrError ? (
                <DeniedView message="Token no válido. Inténtalo de nuevo." />
              ) : (
                <ConfirmationView />
              )
            ) : (
              <div id="reader">
                {!isScanning && (
                  <div className="qr-icon-container" onClick={handleScanClick}>
                    <QrCodeScannerIcon className="qr-vigilante" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="login-form-container">
          <h2 className="h2-form">Ingresar entrada anónima</h2>
          <Box className="form-container" noValidate autoComplete="off">
            <div className="textFlied">
              <TextField
                id="outlined-name-input"
                label="Nombre"
                type="text"
                autoComplete="current-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name} // Marca error si existe un mensaje
                helperText={errors.name} // Muestra el mensaje de error
                style={errors.name ? { borderColor: 'red', borderWidth: 2 } : {}}
              />
            </div>
            <div className="textFlied">
              <TextField
                id="outlined-casa-input"
                label="Número de Casa"
                type="text"
                autoComplete="current-casa"
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
                error={!!errors.houseNumber}
                helperText={errors.houseNumber}
                style={errors.houseNumber ? { borderColor: 'red', borderWidth: 2 } : {}}
              />
            </div>
            <div className="textFlied">
              <TextField
                id="outlined-dui-input"
                label="DUI"
                type="text"
                autoComplete="current-dui"
                value={dui}
                onChange={handleDuiChange}
                error={!!errors.dui}
                helperText={errors.dui}
                style={errors.dui ? { borderColor: 'red', borderWidth: 2 } : {}}
              />
            </div>
            <div className="textFlied">
              <TextField
                id="outlined-comentario-input"
                label="Comentario"
                type="text"
                autoComplete="current-comentario"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                error={!!errors.comment}
                helperText={errors.comment}
                style={errors.comment ? { borderColor: 'red', borderWidth: 2 } : {}}
              />
            </div>
          </Box>
          <div className="switch-container">
            <FormControlLabel
              control={
                <Switch
                  checked={door === 2}
                  onChange={handleSwitchChange}
                  name="entranceType"
                />
              }
              label={door === 2 ? "Entrada Vehicular" : "Entrada Peatonal"}
            />
          </div>
          <div className='btn-buttom-vigi'>
            <button className="btn-vigilate" onClick={handleRegisterClick}>Registrar</button>
            <button className="btn-vigilate phantom" onClick={handleLogoutClick}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeVigilante;
