import React, { useState, useEffect, useRef} from "react";
import { Modal, Button, Table } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import styles from "./estatisticaTimeModal.module.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const EstatisticaTimeModal = ({ open, onClose, time }) => {
    const [jogadores, setJogadores] = useState([]);
    const token = Cookies.get("accessToken");
    const pdfRef = useRef();

    useEffect(() => {
        if (open && time?.tim_id) {
            const fetchDados = async (tim_id) => {
                try {
                    const response = await axios.post(
                        `${process.env.REACT_APP_API_URL}/time/jogadores?time_id=${tim_id}`,
                        null,
                        { headers: { Authorization: token } }
                    );
                    setJogadores(response.data);
                } catch (err) {
                    toast.error("Erro ao carregar dados do time.");
                }
            };

            fetchDados(time.tim_id);
        }
    }, [open, time, token]);

    const handleDownload = async () => {
        if (!pdfRef.current) return;
    
        try {
            // Renderiza o conteúdo em um canvas com escala maior para qualidade
            const canvas = await html2canvas(pdfRef.current, { scale: 2 });
            const imageData = canvas.toDataURL("image/png");
    
            // Cria o PDF e define margens e tamanho da página
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "px",
                format: "a4", // Ajusta para tamanho A4
            });
    
            const pageWidth = pdf.internal.pageSize.getWidth();
    
            // Margens do conteúdo no PDF
            const margin = 20;
            const contentWidth = pageWidth - margin * 2;
    
            // Define o título no topo da página
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(18);
            pdf.text(`${time?.tim_name || "Estatísticas do Time"}`, pageWidth / 2, margin, {
                align: "center",
            });
    
            // Renderiza o conteúdo da tabela na posição central
            const tableY = margin + 30;
            const tableHeight = (canvas.height * contentWidth) / canvas.width;
    
            pdf.addImage(imageData, "PNG", margin, tableY, contentWidth, tableHeight);
    
            // Salva o PDF
            pdf.save(`${time?.tim_name || "estatisticas"}.pdf`);
        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            toast.error("Erro ao gerar PDF.");
        }
    };
    

    // Dados agregados para as tabelas de campeonatos e partidas
    const estatisticasAgregadas = jogadores.reduce(
        (acc, jogador) => {
            const estatistica = jogador.estatistica || {};
            acc.camp_vencidos += estatistica.camp_vencidos || 0;
            acc.qntcamp += estatistica.qntcamp || 0;
            acc.partidas_vencidas += estatistica.partidas_vencidas || 0;
            acc.qntpartidas += estatistica.qntpartidas || 0;
            return acc;
        },
        { camp_vencidos: 0, qntcamp: 0, partidas_vencidas: 0, qntpartidas: 0 }
    );

    // Dados para a tabela de jogadores
    const jogadoresData = jogadores.map((jogador) => ({
        key: jogador.jog_id,
        jog_name: jogador.jog_name,
        mvps_partida: jogador.estatistica?.mvp_partidas || 0,
        mvps_campeonato: jogador.estatistica?.mvp_camp || 0,
    }));

    return (
        <Modal
            title={
                <div
                    style={{
                        textAlign: "center",
                        fontSize: "20px",
                        fontWeight: "bold",
                        marginBottom: "20px",
                    }}
                >
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
            <div ref={pdfRef}>
            {/* Tabela de Campeonatos */}
            <Table
                columns={[
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
                ]}
                dataSource={[
                    {
                        key: "1",
                        vencidos: estatisticasAgregadas.camp_vencidos,
                        jogados: estatisticasAgregadas.qntcamp,
                    },
                ]}
                pagination={false}
                bordered
                size="small"
                style={{ marginBottom: "20px" }}
            />

            {/* Tabela de Partidas */}
            <Table
                columns={[
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
                ]}
                dataSource={[
                    {
                        key: "1",
                        vencidas: estatisticasAgregadas.partidas_vencidas,
                        jogadas: estatisticasAgregadas.qntpartidas,
                    },
                ]}
                pagination={false}
                bordered
                size="small"
                style={{ marginBottom: "20px" }}
            />

            {/* Tabela de Jogadores */}
            <Table
                columns={[
                    {
                        title: "Lista dos Jogadores",
                        dataIndex: "jog_name",
                        key: "jog_name",
                    },
                    {
                        title: "MVPs de Partida",
                        dataIndex: "mvps_partida",
                        key: "mvps_partida",
                        align: "center",
                    },
                    {
                        title: "MVPs de Campeonato",
                        dataIndex: "mvps_campeonato",
                        key: "mvps_campeonato",
                        align: "center",
                    },
                ]}
                dataSource={jogadoresData}
                pagination={false}
                rowKey="jog_id"
                bordered
                size="small"
            />
            </div>
        </Modal>
    );
};

export default EstatisticaTimeModal;
