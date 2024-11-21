import Navbar from "../../../components/navbar/navbar";
import CardDetail from "../../../components/cards/cardDetail/cardDetail";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Menu from "../../../components/menu/menu";
import "./InvitacionA.css";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useNavigate } from "react-router-dom";
import IconButton from "../../../components/buttons/IconButton/IconButton";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import InsertInvitationRoundedIcon from "@mui/icons-material/InsertInvitationRounded";
import axios from "../../../api/axios";
import useAuth from "../../../hooks/useAuth";

import { Fab, useMediaQuery } from "@mui/material";
import WidgetsIcon from "@mui/icons-material/Widgets";

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

function InvitacionA() {
  const { id } = useParams();
  const [selectedCard, setSelectedCard] = useState(null);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const response = await axios.get(`/invitation/mine/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSelectedCard(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInvitation();
  }, [id, token]);

  function handlerQR() {
    navigate(`/invitadoHome/invitacion/${id}/mi-qr`);
  }

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
      <Navbar menuButtons={buttons}/>
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
          <h1 className="invitacionA-h1-visitante">Invitación a:</h1>
          <div className="card-style-mt div-visitant">
            {selectedCard && (
              <>
                <CardDetail
                  key={selectedCard.id}
                  title={selectedCard.houseNumber}
                  date={selectedCard.endDate}
                  time={selectedCard.finishTime}
                  isSelected={true}
                />

                <div className="invitacionA-button-container">
                  <IconButton
                    icon={<QrCode2RoundedIcon />}
                    text="Generar QR"
                    onClick={handlerQR}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className='Right' id='hastaAbajoBaby'>
          <Menu buttons={buttons} />
        </div>
      </div>
    </div>
  );
}

export default InvitacionA;
