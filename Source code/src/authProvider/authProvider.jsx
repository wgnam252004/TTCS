import AuthContext from "../authContext/authContext";
import useAxiosInstance from "../hooks/useAxiosInstance";
import React, { useState, useEffect } from "react";

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const axiosInstance = useAxiosInstance();


    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken !== token) {
            setToken(storedToken);
        }
    }, [token]);

    const checkAuth = () => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
  
        checkAuth();
    }, []);

    useEffect(() => {
   
        checkAuth();
    }, [token]);

    const handleSubmit = async (url, body, method = 'POST') => {
        try {
            const config = {
                method: method,
                url: url,
                data: body
            };

            if (url === '/register') {
            
                const newId = `U${(body.id || '0000')}`;
                config.data = {
                    ...body,
                    id: newId,
                    role: 'User'
                };
            }

            const res = await axiosInstance(config);
            
            if (url === '/login' && res?.status === 200) {
                const newToken = res.data.token;
          
                localStorage.setItem('token', newToken);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                setToken(newToken);
                setIsAuthenticated(true);
            } else if (url === '/logout' && res?.status === 200) {
                localStorage.removeItem('token');
                setToken(null);
                setIsAuthenticated(false);
            }

            return {
                status: res?.status,
                message: res?.data?.message,
                token: res?.data?.token,
                user: res?.data?.user
            };
        } catch (error) {
            console.error('Request error:', error.response?.data || error.message);
            return {
                status: error.response?.status || 500,
                message: error.response?.data?.message || error.message
            };
        }
    };

    const logout = async () => {
        try {
            const res = await axiosInstance.post('/logout');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setIsAuthenticated(false);
            return res;
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

   
    const getUserRole = () => {
        const user = localStorage.getItem('user');
        if (user) {
            const userData = JSON.parse(user);
            return userData.role || 'User';
        }
        return 'User';
    };


    const canAccessAdmin = () => {
        const role = getUserRole();
        return role === 'Admin';
    };

    const canAccessProfile = () => {
        const role = getUserRole();
        return role === 'User';
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            token,
            handleSubmit,
            logout,
            checkAuth,
            getUserRole,
            canAccessAdmin,
            canAccessProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;