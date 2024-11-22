import IconButton from '../../../components/buttons/IconButton/IconButton'
import Menu from "../../../components/menu/menu"
import { useNavigate } from 'react-router-dom';
import { useEffect, useState} from 'react';
import axios from '../../../api/axios';
import useAuth from '../../../hooks/useAuth';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import residentInChargeBtn from '../../../assets/staticInfo/buttonEncargadoArray';

// Styles
import '../../resident/dashboard/dashboard.css'
import './gestion_hogar.css'
import Navbar from '../../../components/navbar/navbar';


const GestionHogar = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [houseData, setHouseData] = useState({ houseNumber: '', houseUser: [] });
 

    const  HouseInfo = async () => {
        try {
            const response = await axios.get('/house/mine', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setHouseData(response.data.data);   
            }
        } catch (error) {
            console.error('Error fetching house data:', error);
        }
    };

    useEffect(() => {
        HouseInfo();
    }, []);

    const onGoToAddMember = () => {
        navigate("/residente/agregar-miembro");
    }

    const onGoToEntries = () => {
        navigate("/residente/entradas");
    }

    return (
        <>
            <Navbar menuButtons={residentInChargeBtn}/>
            <div className='father'>
                <div className='Left'>
                    <h2>Gestionar mi hogar</h2>

                    <div className='members'>
                        <h3 className='membersTitle'>Integrantes Casa #{houseData.houseNumber}</h3>
                        {
                            houseData.houseUser.map(member => {
                                return <p key={member.user.id}> {member.user.name} </p>;
                            })
                        }
                    </div>

                    <IconButton icon={<AddRoundedIcon />} text={'Agregar miembro a familia'} className="samesize" onClick={onGoToAddMember} />
                    <IconButton icon={<FormatListBulletedRoundedIcon />} text={'Revisar lista de entrada'} className="samesize" onClick={onGoToEntries} />
                </div>
                <div className='Right' id='hastaAbajoBaby'>
                    <Menu buttons={residentInChargeBtn} className='funca' />
                </div>
            </div>
        </>
    )
}

export default GestionHogar;