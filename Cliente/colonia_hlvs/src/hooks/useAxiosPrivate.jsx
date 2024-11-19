import axios, { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
    const refresh  = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        )

        //esto hace que cunado el token expire, contrae la logica y vuelve a pedir el token nuevo con "refresh"
        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            //esto es por el token ha expirado
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error);
            }
        );
            //esto eliminara el proceso cuando se limpie la funcion de refresh
            return () => {
                axios.interceptors.request.eject(requestIntercept);
                axios.interceptors.response.eject(responseIntercept);
            }
    }, [auth, refresh])
    return axiosPrivate;
}

export default useAxiosPrivate;