import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Select, InputNumber, Table, Checkbox } from 'antd';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import styles from "../jogadores/jogadores.module.css";

const { Option } = Select;

const NovoTimeModal = ({ open, onClose, onCreate, novoTime, setNovoTime, onUpdateJogadores}) => {
    const [jogadores, setJogadores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [jogadoresSelecionados, setJogadoresSelecionados] = useState([]);
    const token = Cookies.get('accessToken');

    useEffect(() => {
        const getJogadores = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/jogador`, {
                    headers: {
                        Authorization: token,
                    },
                });
                const jogadoresFiltrados =
                    novoTime.genero === "Misto"
                        ? response.data
                        : response.data.filter(
                              (jogador) => jogador.jog_gender.toLowerCase() === novoTime.genero.toLowerCase()
                          );
                setJogadores(jogadoresFiltrados);
            } catch (error) {
                toast.error("Erro ao buscar jogadores.");
            }
        };

        if (open) {
            getJogadores();
            setJogadoresSelecionados([]);
        }
    }, [open, novoTime.genero, token]);

    const handleSelecionarJogador = (jogadorId) => {
        if (jogadoresSelecionados.includes(jogadorId)) {
            // Remove o jogador da seleção
            setJogadoresSelecionados((prev) => prev.filter((id) => id !== jogadorId));
        } else {
            if (jogadoresSelecionados.length < novoTime.quantidadeJogadores) {
                // Adiciona o jogador à seleção
                setJogadoresSelecionados((prev) => [...prev, jogadorId]);
            } else {
                toast.error(`Você só pode selecionar ${novoTime.quantidadeJogadores} jogadores.`);
            }
        }
    };

    const columns = [
        {
            title: 'Selecionar',
            dataIndex: 'selecionar',
            render: (_, record) => (
                <Checkbox
                    checked={jogadoresSelecionados.includes(record.jog_id)}
                    onChange={() => handleSelecionarJogador(record.jog_id)}
                />
            ),
        },
        {
            title: 'Nome',
            dataIndex: 'jog_name',
            key: 'jog_name',
        },
    ];

    const handleCreate = async () => {
        if (loading) return;
        setLoading(true);
    
        // Validação dos campos
        if (!novoTime.nome || !novoTime.genero || jogadoresSelecionados.length !== novoTime.quantidadeJogadores) {
            toast.error(`Preencha todos os campos e selecione exatamente ${novoTime.quantidadeJogadores} jogadores.`);
            setLoading(false);
            return;
        }
    
        try {
            const payload = {
                tim_name: novoTime.nome,
                tim_gender: novoTime.genero,
                times: jogadoresSelecionados,
            };
    
            await axios.post(`${process.env.REACT_APP_API_URL}/time`, payload, {
                headers: {
                    Authorization: token,
                },
            });
    
            toast.success("Time criado com sucesso!");
    
            // Atualiza a lista de times ao fechar o modal
            onCreate();
            handleReset();
        } catch (error) {
            toast.error(error.response?.data?.message || "Erro ao criar time.");
        } finally {
            setLoading(false);
        }
    };
    
    const handleReset = () => {
        setNovoTime({ nome: '', genero: '', quantidadeJogadores: 0 }); // Redefine o novo time
        setJogadoresSelecionados([]); // Limpa os jogadores selecionados
        onClose(); // Fecha o modal
    };

    return (
        <Modal
    title="Novo Time"
    open={open}
    onCancel={handleReset} // Use a função para limpar o estado ao fechar
    footer={[
        <Button
            key="cancelar"
            onClick={handleReset} // Use a função para limpar o estado
            className={styles.cancelButton}
        >
            Cancelar
        </Button>,
        <Button
            key="adicionar"
            type="primary"
            onClick={handleCreate}
            className={styles.addButton}
            loading={loading}
        >
            Adicionar
        </Button>,
    ]}
>
            <Form layout="vertical">
                <Form.Item required>
                    <Input
                        placeholder="Nome exemplo"
                        value={novoTime.nome}
                        onChange={(e) =>
                            setNovoTime((prev) => ({ ...prev, nome: e.target.value }))
                        }
                    />
                </Form.Item>

                <Form.Item required>
                    <label>Quantidade de jogadores</label>
                    <InputNumber
                        min={1}
                        max={100}
                        value={novoTime.quantidadeJogadores}
                        onChange={(value) =>
                            setNovoTime((prev) => ({ ...prev, quantidadeJogadores: value }))
                        }
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item required>
                    <Select
                        placeholder="Gênero"
                        value={novoTime.genero || undefined}
                        onChange={(value) =>
                            setNovoTime((prev) => ({ ...prev, genero: value }))
                        }
                    >
                        <Option value="Feminino">Feminino</Option>
                        <Option value="Masculino">Masculino</Option>
                        <Option value="Misto">Misto</Option>
                    </Select>
                </Form.Item>

                <Table
                    columns={columns}
                    dataSource={jogadores}
                    rowKey="jog_id"
                    pagination={{ pageSize: 8 }}
                    size="small"
                />
            </Form>
        </Modal>
    );
};

export default NovoTimeModal;
