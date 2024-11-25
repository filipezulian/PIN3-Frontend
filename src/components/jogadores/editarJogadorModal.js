import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./jogadores.module.css";
import Cookies from 'js-cookie';
import DeletarJogadorModal from "./deletarJogadorModal";

const { Option } = Select;

const EditarJogadorModal = ({ open, onClose, jogador, setJogadores, setJogadoresFiltrados }) => {
    const [localJogador, setLocalJogador] = useState(null);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false); 
    const token = Cookies.get('accessToken');

    useEffect(() => {
        if (jogador) {
            setLocalJogador({ ...jogador }); // Clona o jogador selecionado
        }
    }, [jogador]);

    const handleSave = async () => {
        if (!localJogador?.jog_id) {
            toast.error("O ID do jogador é obrigatório.");
            return;
        }

        try {
            const params = new URLSearchParams({
                jog_id: localJogador.jog_id.toString(),
            });
            if (localJogador.jog_name) {
                params.append("jog_name", localJogador.jog_name);
            }
            if (localJogador.jog_gender) {
                params.append("jog_gender", localJogador.jog_gender);
            }
            await axios.put(
                `${process.env.REACT_APP_API_URL}/jogador/edit?${params.toString()}`,
                null,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            toast.success("Jogador atualizado com sucesso!");

            const response = await axios.get(`${process.env.REACT_APP_API_URL}/jogador`, {
                headers: {
                    Authorization: token,
                },
            });
            setJogadores(response.data);
            setJogadoresFiltrados(response.data);
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || "Erro ao atualizar jogador.");
        }
    };

    const handleDeleteConfirm = () => {
        onClose();
        setConfirmDeleteVisible(true);
    };

    const handleDeleteCancel = () => {
        setConfirmDeleteVisible(false);
        onClose(false); 
    };

    const handleDelete = async () => {
        if (!localJogador?.jog_id) {
            toast.error("O ID do jogador é obrigatório.");
            return;
        }
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/jogador?jog_id=${localJogador.jog_id}`, {
                headers: {
                    Authorization: token,
                },
            });

            toast.success("Jogador excluído com sucesso!");
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/jogador`, {
                headers: {
                    Authorization: token,
                },
            });
            setJogadores(response.data);
            setJogadoresFiltrados(response.data);
            setConfirmDeleteVisible(false);
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || "Erro ao excluir jogador.");
        }
    };

    if (!localJogador) return null;  // Evita renderizar se o jogador não estiver carregado

    return (
        <>
            {/* Modal Principal */}
            <Modal
                title="Editar Jogador"
                open={open}
                onCancel={onClose}
                footer={[
                    <Button key="cancelar" className={styles.cancelButton} onClick={onClose}>
                        Cancelar
                    </Button>,
                    <Button
                        key="deletar"
                        className={styles.deleteButton}
                        onClick={handleDeleteConfirm} 
                    >
                        Deletar
                    </Button>,
                    <Button key="salvar" className={styles.saveButton} onClick={handleSave}>
                        Salvar
                    </Button>,
                ]}
            >
                <Form layout="vertical">
                    {/* Nome */}
                    <Form.Item required>
                        <Input
                            placeholder="Digite o nome"
                            value={localJogador.jog_name}
                            onChange={(e) =>
                                setLocalJogador((prev) => ({ ...prev, jog_name: e.target.value }))
                            }
                        />
                    </Form.Item>

                    {/* Gênero */}
                    <Form.Item required>
                        <Select
                            placeholder="Selecione o gênero"
                            value={localJogador.jog_gender}
                            onChange={(value) =>
                                setLocalJogador((prev) => ({ ...prev, jog_gender: value }))
                            }
                        >
                            <Option value="Feminino">Feminino</Option>
                            <Option value="Masculino">Masculino</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal de Confirmação de Exclusão */}
            <DeletarJogadorModal
                open={confirmDeleteVisible}
                onCancel={handleDeleteCancel} 
                onConfirm={handleDelete} 
                jogador={localJogador}
            />
        </>
    );
};

export default EditarJogadorModal;
