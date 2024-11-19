import InsertInvitationRoundedIcon from '@mui/icons-material/InsertInvitationRounded';
import EventRepeatRoundedIcon from '@mui/icons-material/EventRepeatRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChecklistRtlRoundedIcon from '@mui/icons-material/ChecklistRtlRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import RoomPreferencesRoundedIcon from '@mui/icons-material/RoomPreferencesRounded';

const residentButtons = [
    { icon: <HomeRoundedIcon />, name: "Inicio", path: "/residente"},
    { icon: <InsertInvitationRoundedIcon />, name: "Invitacion Simple", path: "/residente/invitacion/unica",},
    { icon: <EventRepeatRoundedIcon />, name: "Invitacion Recurrente", path: "/residente/invitacion/recurrente",},
    { icon: <PersonRoundedIcon />, name: "Mi perfil", path: "/residente/perfil" },
    { icon: <LogoutRoundedIcon />, name: "Cerrar Sesion", path: "/", logout: true },
];

export default residentButtons;