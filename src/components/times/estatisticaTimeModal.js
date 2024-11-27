import React, { useState, useEffect } from "react";
import { Modal, Button, Table } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import styles from "./estatisticaTimeModal.module.css";

const EstatisticaTimeModal = ({ open, onClose, time }) => {
    const [estatisticas, setEstatisticas] = useState(null);
    const [jogadores, setJogadores] = useState([]);
    const token = Cookies.get("accessToken");

    useEffect(() => {
        if (open && time?.tim_id) {
            const fetchEstatisticasDoTime = async (tim_id) => {
                try {
                    const response = await axios.get(
                        `${process.env.REACT_APP_API_URL}/time/estatistica?timeId=${tim_id}`,
                        { headers: { Authorization: token } }
                    );
                    setEstatisticas(response.data);
                } catch (err) {
                    toast.error("Erro ao carregar estatísticas do time.");
                }
            };
    
            const fetchJogadoresDoTime = async (tim_id) => {
                try {
                    const response = await axios.post(
                        `${process.env.REACT_APP_API_URL}/time/jogadores?time_id=${tim_id}`,
                        null,
                        { headers: { Authorization: token } }
                    );
                    setJogadores(response.data);
                } catch (err) {
                    toast.error("Erro ao carregar jogadores do time.");
                }
            };
    
            fetchEstatisticasDoTime(time.tim_id);
            fetchJogadoresDoTime(time.tim_id);
        }
    }, [open, time, token]);
    
    const handleDownload = () => {
        toast.info("Download de estatísticas em construção!");
    };

    // Tabela de Campeonatos
    const campeonatosColumns = [
        {
            title: "Campeonatos",
            children: [
                {
                    title: "Vencidos",
                    dataIndex: "vencidos",
                    key: "vencidos",
                    align: "center",
                },
                {
                    title: "Jogados",
                    dataIndex: "jogados",
                    key: "jogados",
                    align: "center",
                },
            ],
        },
    ];

    const campeonatosData = [
        {
            key: "1",
            vencidos: estatisticas?.camp_vencidos || 0,
            jogados: estatisticas?.qntcamp || 0,
        },
    ];

    // Tabela de Partidas
    const partidasColumns = [
        {
            title: "Partidas",
            children: [
                {
                    title: "Vencidas",
                    dataIndex: "vencidas",
                    key: "vencidas",
                    align: "center",
                },
                {
                    title: "Jogadas",
                    dataIndex: "jogadas",
                    key: "jogadas",
                    align: "center",
                },
            ],
        },
    ];

    const partidasData = [
        {
            key: "1",
            vencidas: estatisticas?.partidas_vencidas || 0,
            jogadas: estatisticas?.qntpartidas || 0,
        },
    ];

    // Tabela de Jogadores
    const jogadoresColumns = [
        {
            title: "Lista dos Jogadores",
            dataIndex: "jog_name",
            key: "jog_name",
        },
        {
            title: "MVPs de Partida",
            dataIndex: "mvps_partida",
            key: "mvps_partida",
        },
        {
            title: "MVPs de Campeonato",
            dataIndex: "mvps_campeonato",
            key: "mvps_campeonato",
        },
    ];

    return (
        <Modal
            title={
                <div style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>
                    {time?.tim_name}
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="cancelar" className={styles.cancelButton} onClick={onClose}>
                    Cancelar
                </Button>,
                <Button key="baixar" className={styles.downloadButton} onClick={handleDownload}>
                    Baixar
                </Button>,
            ]}
            width={800}
        >
            {/* Tabela de Campeonatos */}
            <Table
                columns={campeonatosColumns}
                dataSource={campeonatosData}
                pagination={false}
                bordered
                size="small"
                style={{ marginBottom: "20px" }}
            />

            {/* Tabela de Partidas */}
            <Table
                columns={partidasColumns}
                dataSource={partidasData}
                pagination={false}
                bordered
                size="small"
                style={{ marginBottom: "20px" }}
            />

            {/* Tabela de Jogadores */}
            <Table
                columns={jogadoresColumns}
                dataSource={jogadores}
                rowKey="jog_id"
                pagination={false}
                size="small"
            />
        </Modal>
    );
};

export default EstatisticaTimeModal;
