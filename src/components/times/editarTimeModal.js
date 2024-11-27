import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Table } from "antd";
import styles from "../jogadores/jogadores.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import DeletarTimeModal from "./deletarTimeModal";
import EstatisticaTimeModal from "./estatisticaTimeModal";

const EditarTimeModal = ({ open, onClose, time, setTimes, setTimesFiltrados }) => {
    const [localTime, setLocalTime] = useState(null);
    const [jogadores, setJogadores] = useState([]);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const token = Cookies.get("accessToken");
    const [estatisticaModalVisible, setEstatisticaModalVisible] = useState(false);

    useEffect(() => {
        if (time) {
            console.log("Time selecionado:", time);
            setLocalTime({ ...time });

            const fetchJogadoresDoTime = async (tim_id) => {
                if (!tim_id) {
                    toast.error("ID do time inválido.");
                    return;
                }

                try {
                    const response = await axios.get(
                        `${process.env.REACT_APP_API_URL}/timejogador/time?tim_id=${tim_id}`,
                        { headers: { Authorization: token } }
                    );
                    setJogadores(response.data);
                } catch (err) {
                    toast.error("Erro ao carregar jogadores do time.");
                    setJogadores([]);
                }
            };

            fetchJogadoresDoTime(time.tim_id);
        }
    }, [time, token]);

    const handleSave = async () => {
        if (!localTime?.tim_id) {
            toast.error("O ID do time é obrigatório.");
            return;
        }

        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/time?tim_id=${localTime.tim_id}&tim_name=${localTime.tim_name}`,
                null,
                { headers: { Authorization: token } }
            );

            toast.success("Nome do time atualizado com sucesso!");

            // Atualiza a lista de times
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/time`, {
                headers: { Authorization: token },
            });
            setTimes(response.data);
            setTimesFiltrados(response.data);
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || "Erro ao atualizar o nome do time.");
        }
    };

    const handleEstatistica = () => {
        setEstatisticaModalVisible(true);
    };

    const closeEstatisticaModal = () => {
        setEstatisticaModalVisible(false);
    };

    const columns = [
        {
            title: "Lista de Jogadores",
            dataIndex: "jog_name",
            key: "jog_name",
        }
    ];

    if (!localTime) return null; // Evita renderizar se o time não estiver carregado

    return (
        <>
            {/* Modal Principal */}
            <Modal
                title="Editar Time"
                open={open}
                onCancel={onClose}
                footer={[
                    <Button key="cancelar" className={styles.cancelButton} onClick={onClose}>
                        Cancelar
                    </Button>,
                    <Button
                        key="deletar"
                        className={styles.deleteButton}
                        onClick={() => {
                            onClose();
                            setConfirmDeleteVisible(true);
                        }}
                    >
                        Deletar
                    </Button>,
                    <Button
                        key="estatistica"
                        className={styles.statisticsButton}
                        onClick={handleEstatistica}
                    >
                        Estatística
                    </Button>,
                    <Button key="salvar" className={styles.saveButton} type="primary" onClick={handleSave}>
                        Salvar
                    </Button>,
                ]}
            >
                <Form layout="vertical">
                    <Form.Item>
                        <Input
                            value={localTime.tim_name}
                            onChange={(e) =>
                                setLocalTime((prev) => ({ ...prev, tim_name: e.target.value }))
                            }
                        />
                    </Form.Item>
                    <Form.Item>
                        <Input value={localTime.tim_gender} disabled /> {/* Apenas visualização */}
                    </Form.Item>
                    <Form.Item>
                        <Table
                            columns={columns}
                            dataSource={jogadores}
                            rowKey="jog_id"
                            pagination={false}
                            size="small"
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal de Confirmação de Exclusão */}
            <DeletarTimeModal
                open={confirmDeleteVisible}
                onCancel={() => {
                    setConfirmDeleteVisible(false);
                    onClose();
                }}
                onConfirm={async () => {
                    try {
                        await axios.delete(
                            `${process.env.REACT_APP_API_URL}/time?timeId=${localTime.tim_id}`,
                            { headers: { Authorization: token } }
                        );
                        toast.success(`Time "${localTime.tim_name}" excluído com sucesso!`);
                        const response = await axios.get(`${process.env.REACT_APP_API_URL}/time`, {
                            headers: { Authorization: token },
                        });
                        setTimes(response.data);
                        setTimesFiltrados(response.data);

                        setConfirmDeleteVisible(false);
                        onClose();
                    } catch (err) {
                        toast.error(
                            err.response?.data?.message || "Erro ao excluir time. Tente novamente."
                        );
                    }
                }}
                time={localTime}
            />

            <EstatisticaTimeModal
                open={estatisticaModalVisible}
                onClose={closeEstatisticaModal}
                time={localTime}
            />

        </>

    );
};

export default EditarTimeModal;
