import InsertInvitationRoundedIcon from '@mui/icons-material/InsertInvitationRounded';
import EventRepeatRoundedIcon from '@mui/icons-material/EventRepeatRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChecklistRtlRoundedIcon from '@mui/icons-material/ChecklistRtlRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import RoomPreferencesRoundedIcon from '@mui/icons-material/RoomPreferencesRounded';

// Residente Encargado
// Gestion Hogar

const residentInChargeBtn = [
    { icon: <HomeRoundedIcon />, name: 'Inicio', path: '/residente/encargado' },
    { icon: <RoomPreferencesRoundedIcon />, name: 'Gestionar hogar', path: '/residente/gestion' },
    { icon: <InsertInvitationRoundedIcon />, name: 'Invitacion Simple', path: '/residente/invitacion/unicae' },
    { icon: <EventRepeatRoundedIcon />, name: 'Invitacion Recurrente', path: '/residente/invitacion/recurrenten' },
    { icon: <ChecklistRtlRoundedIcon />, name: 'Solicitudes', path: '/residente/solicitudes' },
    { icon: <EventAvailableRoundedIcon />, name: 'Historial de invitaciones', path: '/residente/invitacion/lista' },    
    { icon: <PersonRoundedIcon />, name: 'Mi perfil', path: '/residente/perfile' },
    { icon: <LogoutRoundedIcon />, name: 'Cerrar Sesion', path: '/' , logout: true},
];

export default residentInChargeBtn;