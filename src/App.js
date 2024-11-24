import React from "react";
import './App.css';
import { AuthProvider } from "./context/AuthContext";
import MyRoutes from "./MyRoutes"
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <MyRoutes />
          <ToastContainer />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
