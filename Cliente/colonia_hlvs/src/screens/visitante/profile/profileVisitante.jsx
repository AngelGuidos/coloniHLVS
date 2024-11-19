import Navbar from "../../../components/navbar/navbar";
import Menu from "../../../components/menu/menu";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import { blue } from "@mui/material/colors";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import "./profileVisitante.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import InsertInvitationRoundedIcon from "@mui/icons-material/InsertInvitationRounded";
import axios from "../../../api/axios"; // Asegúrate de tener axios importado
import useAuth from "../../../hooks/useAuth";

import { Fab, useMediaQuery } from "@mui/material";
import WidgetsIcon from "@mui/icons-material/Widgets";

function ProfileVisitante() {
  const buttons = [
    {
      icon: <InsertInvitationRoundedIcon />,
      name: "Invitaciones",
      path: "/InvitadoHome",
    },
    {
      icon: <PersonRoundedIcon />,
      name: "Mi perfil",
      path: "/InvitadoHome/profileVisitante",
    },
    {
      icon: <LogoutRoundedIcon />,
      name: "Cerrar sesión",
      path: "/login",
      logout: true,
    },
  ];

  const { token } = useAuth();
  const [dui, setDui] = useState("");

  const handleDuiChange = (event) => {
    const value = event.target.value;
    const regex = /^[0-9]{0,8}-?[0-9]{0,1}$/; // Allow up to 8 digits, an optional hyphen, and 1 digit after the hyphen
    if (regex.test(value)) {
      setDui(value);
    }
  };

  const handleRegisterClick = async () => {
    try {
      const response = await axios.post(
        "/user/update-dui",
        { dui: dui },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Asegúrate de agregar el token si es necesario
          },
        }
      );

      if (response.status === 200) {
        toast.success("DUI actualizado exitosamente!");
        setDui("");
      } else {
        toast.error("Error al actualizar el DUI.");
      }
    } catch (error) {
      toast.error("Error al actualizar el DUI.");
      console.error("Error during DUI update:", error);
    }
  };

  const label = { inputProps: { "aria-label": "Soy Menor de edad" } };

  const fabStyle = {
    position: "fixed",
    bottom: 16,
    right: 16,
    backgroundColor: "#0d1b2a",
    "&:hover": { backgroundColor: "#D2E0FB" },
  };

  const matches = useMediaQuery("(max-width:768px)");

  const handleClick = () => {
    const element = document.getElementById("hastaAbajoBaby");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <Navbar />
      {matches && (
        <Fab
          size="medium"
          color="primary"
          className="fab"
          aria-label="Ir al menu"
          sx={fabStyle}
          onClick={handleClick}
        >
          <WidgetsIcon />
        </Fab>
      )}
      <div className="father">
        <div className='Left' id='scroller'>
          <h1 className="invitacionA-h1-visitante h1-profile">Mi perfil</h1>
          <div className="card-style-mt div-visitant">
            <div className="profileVisitante-hint profileVisitante-box-container">
              <ErrorOutlineRoundedIcon className="profileVisitante-icon" />
              Por seguridad solicitamos tu DUI, no te preocupes, esta
              información es confidencial
            </div>
            <div className="profileVisitante-box-container">
              <Box
                className="profileVisitante-form-container"
                noValidate
                autoComplete="off"
              >
                <div className="profileVisitante-text-field">
                  <TextField
                    id="outlined-dui-input"
                    label="DUI"
                    type="dui"
                    autoComplete="current-dui"
                    className="profileVisitante-text-field"
                    value={dui}
                    onChange={handleDuiChange}
                    inputProps={{
                      pattern: "^[0-9]{8}-[0-9]$", // Regex for DUI format: 8 digits, a hyphen, and 1 digit
                      maxLength: 10, // 8 digits + 1 hyphen + 1 digit = 10 characters
                    }}
                  />
                </div>
              </Box>
              <div>
                <Checkbox
                  {...label}
                  sx={{
                    color: blue[800],
                    "&.Mui-checked": {
                      color: blue[600],
                    },
                  }}
                />{" "}
                Soy menor de edad
              </div>
            </div>
            <div className="profileVisitante-button-container">
              <button
                className="profileVisitante-button-save"
                onClick={handleRegisterClick}
              >
                Guardar información
              </button>
            </div>
          </div>
        </div>
        <div className='Right' id='hastaAbajoBaby'>
          <Menu buttons={buttons} />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ProfileVisitante;
