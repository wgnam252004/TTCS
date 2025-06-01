import { createContext, useContext } from "react";

const AuthContext = createContext({
    isAuthenticated: false,
    token: null,
    handleSubmit: () => {},
    logout: () => {},
    checkAuth: () => {},
    getUserRole: () => {},
    canAccessAdmin: () => {},
    canAccessProfile: () => {}
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
