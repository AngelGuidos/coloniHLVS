import axios from "../api/axios";
import useAuth from "./useAuth";

function useRefreshToken() {
  const { setAuth } = useAuth;

  //lo que hace esto es expirar el token y darnos uno nuevo para que cabie con el tiempo
  const refresh = async () => {
    //esto es la cookie segura, que envia el token pero nunca se ve en el codigo.
    const response = await axios.get("/refresh", {
      withCredentials: true,
    });
    //esto enviara un nuevo token osea refresacralo cuando encuentre nueva peticion para que el
    //token no sea el mismo y vaya cambiando con el tiempo.
    setAuth((prev) => {
      return { ...prev, accessToken: response.data.accessToken };
    });
    return response.data.accessToken;
  };

  return refresh;
}

export default useRefreshToken;