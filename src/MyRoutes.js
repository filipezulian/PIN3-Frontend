import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Error404 from "./pages/404/Error404";
import TelaInicial from "./pages/public/TelaInicial/TelaInicial";
import TelaAuthLayout from "./pages/public/Auth/TelaAuthLayout";
import Login from "./components/Login/Login";
import Cookies from "js-cookie";
import SystemLayout from "./pages/authenticated/SystemLayout";
import Home from "./pages/authenticated/Home/Home";
import Campeonatos from "./pages/authenticated/Campeonatos/Campeonatos";
import Jogadores from "./pages/authenticated/Jogadores/Jogadores"
import Times from "./pages/authenticated/Times/Times"
import Chaveamentos from "./pages/authenticated/Chaveamentos/Chaveamentos"
import GenerateChaveamento from "./pages/authenticated/Chaveamentos/GenerateChaveamento";
import GeneratedBracket from "./pages/authenticated/Chaveamentos/GeneratedBracket";
import GerarTimeTable from "./components/times/gerarTimeTable";

const AuthenticatedRoutes = ({ children }) => {
    const user = Cookies.get("user");
    const token = Cookies.get("accessToken");
    return user && token ? children : <Navigate to="/login" />;
};

const MyRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<TelaInicial />} path="/" />
            <Route element={<TelaAuthLayout children={<Login />} />} path="/login" />

            {/* Authenticated Route */}
            <Route
                path="/home"
                element={
                    <AuthenticatedRoutes>
                        <SystemLayout>
                            <Home />
                        </SystemLayout>
                    </AuthenticatedRoutes>
                }
            />
            <Route
                path="/campeonatos"
                element={
                    <AuthenticatedRoutes>
                        <SystemLayout>
                            <Campeonatos />
                        </SystemLayout>
                    </AuthenticatedRoutes>
                }
            />
            <Route
                path="/jogadores"
                element={
                    <AuthenticatedRoutes>
                        <SystemLayout>
                            <Jogadores />
                        </SystemLayout>
                    </AuthenticatedRoutes>
                }
            />
            <Route
                path="/times"
                element={
                    <AuthenticatedRoutes>
                        <SystemLayout>
                            <Times />
                        </SystemLayout>
                    </AuthenticatedRoutes>
                }
            />
            <Route
                path="/chaveamentos"
                element={
                    <AuthenticatedRoutes>
                        <SystemLayout>
                            <Chaveamentos />
                        </SystemLayout>
                    </AuthenticatedRoutes>
                }
            />
            <Route
                path="/chaveamentos/:id"
                element={
                    <AuthenticatedRoutes>
                        <SystemLayout>
                            <GenerateChaveamento />
                        </SystemLayout>
                    </AuthenticatedRoutes>
                }
            />
            <Route
                path="/bracket"
                element={
                    <AuthenticatedRoutes>
                        <SystemLayout>
                            <GeneratedBracket />
                        </SystemLayout>
                    </AuthenticatedRoutes>
                }
            />
            <Route
                path="/gerarTime"
                element={
                    <AuthenticatedRoutes>
                        <SystemLayout>
                            <GerarTimeTable />
                        </SystemLayout>
                    </AuthenticatedRoutes>
                }
            />

            {/* Catch-All Route */}
            <Route element={<Error404 />} path="*" />
        </Routes>
    );
};

export default MyRoutes;
