import AuthContext from "../authContext/authContext";
import useAxiosInstance from "../hooks/useAxiosInstance";
import React, { useState, useEffect } from "react";

const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const axiosInstance = useAxiosInstance();

    const checkAuth = () => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        // Kiểm tra token khi component mount
        checkAuth();
        
        // Kiểm tra token khi token thay đổi
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleSubmit = async (url, body, method = 'POST') => {
        try {
            const config = {
                method: method,
                url: url,
                data: body
            };

            const res = await axiosInstance(config);
            
            if (url === '/login' && res?.status === 200) {
                localStorage.setItem('token', res.data.token);
                setIsAuthenticated(true);
            } else if (url === '/logout' && res?.status === 200) {
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            }

            return {
                status: res?.status,
                message: res?.data?.message,
            };
        } catch (error) {
            console.error('Request error:', error.response?.data || error.message);
            return {
                status: error.response?.status || 500,
                message: error.response?.data?.message || error.message
            };
        }
    }

    const logout = async () => {
        try {
            const res = await axiosInstance.post('/logout');
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            return res;
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            handleSubmit,
            logout,
            checkAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;