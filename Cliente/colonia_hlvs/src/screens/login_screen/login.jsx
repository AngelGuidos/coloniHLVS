import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import GoogleIcon from "@mui/icons-material/Google";
import Logo from "../../assets/images/Logo.png";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.roles && user.roles.length > 0) {
        const role = user.roles[0].role;
        console.log("role:", role);
        let path = "";
        switch (role) {
          case "resident":
            path = "/residente";
            break;
          case "manager": /* manager = residente jefe = encargado */
            path = "/residente/encargado";
            break;
          case "admin":
            path = "/admin";
            break;
          case "keeper":
            path = "/vigilanteHome";
            break;
          case "visitor":
            path = "/invitadoHome";
            break;
          default:
            path = "/";
            break;
        }
        navigate(path);
      } else {
        navigate("/login");
      }
    }
  }, [user, navigate]);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      try {
        const { data } = await axios.post(
          "/auth/login",
          {
            token: access_token,
          }
        );
        const token = data.data.token;
        localStorage.setItem("jwt_authorization", token);
        await login(token);
        //toast.success("Inicio de sesión exitoso");
      } catch (error) {
        toast.error("Error al iniciar sesión");
        console.log(error);
      }
    },
  });

  return (
    <div className="main-container-login">
      <div className="leftSide">
        <div className="left-container-login">
          <h1 className="h1-login-left"></h1>
          <img src={Logo} className="image-left-container" alt="logo" />
        </div>
      </div>
      <div className="rigthSide">
        <div className="rigth-container-login">
          <h1 className="h1-login-rigth">Bienvenido</h1>
          <img src={Logo} className="image-rigth-container" alt="logo" />
          <h1 className="h1-login">
            Bienvenido a HLVS, inicia sesión con Google!
          </h1>

          <button className="btn-google" onClick={() => handleGoogleLogin()}>
            <GoogleIcon className="colorGoogle" />
            <h3 className="h3Google">Sign in with Google</h3>
          </button>

          <h3 className="h3-copy">© 2024 Todos los derechos reservados</h3>
        </div>
      </div>
    </div>
  );
};

export default Login;
