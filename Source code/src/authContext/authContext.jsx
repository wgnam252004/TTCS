import { createContext } from "react";

const AuthContext = createContext({
    isAuthenticated: false,
    token: null,
    login: () => {},
    logout: () => {},
    checkAuth: () => {}
});

export default AuthContext;
