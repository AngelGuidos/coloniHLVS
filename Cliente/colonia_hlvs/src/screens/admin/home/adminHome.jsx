import React from "react";
import Menu from "../../../components/menu/menu";
import Navbar from "../../../components/navbar/navbar";
import DataGridDemo from "../../../components/table/table";
import "./adminHome.css";
import BasicBars from "../../../components/chart/chart";
import LogoutIcon from "@mui/icons-material/Logout";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CardContent from "@mui/material/CardContent";
import { TextField } from "@mui/material";
import IconButton from "../../../components/buttons/IconButton/IconButton";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "../../../api/axios";
import useAuth from "../../../hooks/useAuth";
import SettingsIcon from "@mui/icons-material/Settings";
import { Fab, useMediaQuery } from "@mui/material";
import WidgetsIcon from "@mui/icons-material/Widgets";

function AdminHome() {
  const [rowsVigilantes, setRowsVigilantes] = useState([]);
  const [nuevoVigilante, setNuevoVigilante] = useState("");
  const [rows, setRows] = useState([]);
  const { token } = useAuth();

  const columns = [
    {
      field: "Casa",
      headerName: "Casa",
      type: "number",
      flex: 1,
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      field: "Nombre",
      headerName: "Nombre",
      type: "string",
      flex: 1,
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      field: "Fecha",
      headerName: "Fecha",
      type: "String",
      flex: 1,
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      field: "Hora",
      headerName: "Hora",
      type: "time",
      flex: 1,
      headerAlign: "center",
      align: "center",
      editable: false,
    },
  ];

  const columnsVigilantes = [
    {
      field: "Contador",
      headerName: "Vigilante",
      type: "number",
      flex: 0,
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      field: "NombreVigilante",
      headerName: "Email",
      type: "string",
      flex: 1,
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      field: "Eliminar",
      headerName: "",
      flex: 0,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <IconButton
          className="icon-delete"
          onClick={() => handleDelete(params.row.NombreVigilante)}
          icon={<DeleteOutlineIcon sx={{ color: "#0d1b2a" }} />}
        />
      ),
    },
  ];

  const buttons = [
    { icon: <ShowChartIcon />, name: "Panel de Control", path: "/admin" },
    {
      icon: <HolidayVillageIcon />,
      name: "Administrar Casa",
      path: "/admin/administrar-casa",
    },
    {
      icon: <SettingsIcon />,
      name: "Configuración",
      path: "/admin/configuracion",
    },
    { icon: <LogoutIcon />, name: "Cerrar sesión", logout: true },
  ];

  const fetchVigilantes = async () => {
    try {
      const response = await axios.get("/user/keeper", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const vigilantes = response.data.data;
      const rowsData = vigilantes.map((vigilante, index) => ({
        id: vigilante.id,
        Contador: index + 1,
        NombreVigilante: vigilante.email,
      }));
      setRowsVigilantes(rowsData);
    } catch (error) {
      console.error("Error fetching vigilantes", error);
    }
  };

  const handleGuardarVigilante = async () => {
    try {
      const response = await axios.post(
        "/user/set-role",
        {
          identifier: nuevoVigilante,
          role: ["KEEP"],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setNuevoVigilante("");
      toast.success("Vigilante agregado con éxito");
      fetchVigilantes();
    } catch (error) {
      console.error("Error adding vigilante", error);
      toast.error("Error al agregar vigilante, el usuario debe de estar registrado.");
    }
  };

  const handleDelete = async (email) => {
    try {
      const response = await axios.post(
        "/user/set-role",
        {
          identifier: email,
          role: ["VIST"],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Vigilante eliminado con éxito");
      fetchVigilantes();
    } catch (error) {
      console.error("Error deleting vigilante", error);
      toast.error("Error al eliminar vigilante");
    }
  };

  const fetchEntrancesAll = async () => {
    try {
      const response = await axios.get("/entrance/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      //console.log(response);
      if (response.status === 200) {
        const fetchedRows = response.data.data.map((entrance, index) => ({
          id: entrance.id,
          Casa: entrance.houseNumber,
          Nombre: entrance.nombre,
          Fecha: entrance.date.split("T")[0],
          Hora: entrance.date.split("T")[1].split(".")[0],
        }));
        setRows(fetchedRows);
      } else {
        toast.warning("No hay historial de ingresos disponibles");
      }
    } catch (error) {
      toast.error("Error al obtener los datos de toda las entradas");
    }
  };

  useEffect(() => {
    fetchEntrancesAll();
  }, []);

  const handleVisitanteChange = (event) => {
    setNuevoVigilante(event.target.value);
  };

  useEffect(() => {
    fetchVigilantes();
  }, []);

  const matches = useMediaQuery("(max-width:768px)");

  const handleClick = () => {
    const element = document.getElementById("hastaAbajoBaby");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const fabStyle = {
    position: "fixed",
    bottom: 16,
    right: 16,
    backgroundColor: "#0d1b2a",
    "&:hover": { backgroundColor: "#D2E0FB" },
  };

  return (
    <>
    <Navbar menuButtons={buttons}/>

      <div>
        <div className="father">
          <div className="Left-2">
            <h1 id="title">Inicio</h1>
            <h2 id="text">Registro de Ingresos</h2>
            <div id="margenes2">
              <BasicBars />
            </div>
            <h2 id="text">Historial de Ingresos</h2>
            <div id="margenes">
              <DataGridDemo columns={columns} rows={rows} />
            </div>

            <div>
              <h2 id="text"> Vigilantes</h2>
              <div id="margenes">
                <DataGridDemo
                  rows={rowsVigilantes}
                  columns={columnsVigilantes}
                  pageSize={5}
                />
              </div>
              <div>
                <CardContent>
                  <div>
                    <h2 id="text">Agregar Vigilante</h2>
                  </div>
                  <div id="container">
                    <TextField
                      id="outlined-basic"
                      label="Email"
                      variant="outlined"
                      onChange={handleVisitanteChange}
                      value={nuevoVigilante}
                    />
                    <div className="boton-guardar">
                      <IconButton
                        text={"Guardar"}
                        onClick={handleGuardarVigilante}
                      />
                    </div>
                  </div>
                </CardContent>
              </div>
            </div>
          </div>
          <div className="Right">
            <Menu buttons={buttons} />
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminHome;
