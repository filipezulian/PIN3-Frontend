import React from "react";
import Header from "../../../components/Header/header";
import "./TelaInicial.css";

const TelaInicial = () => {
    return (
        <div className="container">
            <Header />
            <div className="content">
                <div className="textSection">
                    <h1 className="title-tela-inicial" style={{ fontSize: "90px", color: "#fff" }}>
                        GERENCIAMENTO<br />DE TORNEIOS<br />SIMPLIFICADO
                    </h1>
                </div>
                <div className="imageContainer">
                    <img
                        src="/assets/Basquete.png"
                        alt="Jogador de basquete"
                        className="image"
                    />
                </div>
                <div className="footerText">
                    <h2 className="subtitle">SEU TORNEIO<br />DO SEU JEITO</h2>
                </div>
            </div>
        </div>
    );
};

export default TelaInicial;
