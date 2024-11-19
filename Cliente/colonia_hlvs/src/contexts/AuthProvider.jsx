import React, { useState, useEffect, useRef } from 'react';
import axios from '../api/axios';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem("jwt_authorization") || null);
    const isMounted = useRef(false); 


    const fetchUser = async (token) => {
        try {
            const { data: userData } = await axios.get('/user/whoami', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(userData.data);
        } catch (error) {
            console.error('Failed to fetch user', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (token) => {
        localStorage.setItem("jwt_authorization", token);
        setToken(token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await fetchUser(token);
    };

    const logout = () => {
        localStorage.removeItem("jwt_authorization");
        setToken(null);
        setUser(null);
    };

    useEffect(() => {
        if (isMounted.current) return; 

        const token = localStorage.getItem("jwt_authorization");
        if (token) {
            fetchUser(token);
        } else {
            setLoading(false);
        }
        isMounted.current = true; 
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, token }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export { AuthProvider };
