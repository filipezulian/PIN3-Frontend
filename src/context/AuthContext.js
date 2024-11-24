import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const token = Cookies.get("accessToken");
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            if (!!token) {
                try {
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000;
                    if (decoded.exp < currentTime) {
                        toast.error("Sessão expirada!");
                        Cookies.remove("accessToken");
                        navigate("/login");
                    } else {
                        setUser(decoded);
                    }
                } catch (error) {
                    console.error("Invalid token");
                    Cookies.remove("accessToken");
                }
            }
        };
        checkAuth();
    }, [token, navigate]);
    const autenticar = async (email, senha) => {
        const credencial = { "usr_email": email, "usr_password": senha };

        try {
            console.log(process.env.REACT_APP_API_URL,'/login')
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, credencial);
            if (response.data.token) {
                Cookies.set("accessToken", response.data.token, {
                    expires: 1,
                    secure: false,
                    sameSite: "strict",
                }); 
                const decoded = jwtDecode(response.data.token);
                Cookies.set("user", JSON.stringify(decoded), {
                    expires: 1,
                    secure: false,
                    sameSite: "strict",
                });
                setUser(decoded);
            }
            return response.data;
        } catch (err) {
            toast.error(err.response.data.message);
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{autenticar}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);