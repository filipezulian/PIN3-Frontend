import React, { useState, useEffect } from 'react';
import { Spin, Button, Form, Input, Select, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import axios from "axios";
import Cookies from 'js-cookie';
import styles from "../times/gerarTime.module.css";
import { toast } from "react-toastify";

const { Option } = Select;

const GerarTimeTable = () => {
    const token = Cookies.get('accessToken');
    const [jogadores, setJogadores] = useState([]);
    const [jogadoresSelecionados, setJogadoresSelecionados] = useState([]);
    const [esportes, setEsportes] = useState([]);
    const [loadingJogadores, setLoadingJogadores] = useState(false);
    const [loadingEsportes, setLoadingEsportes] = useState(false);
    const [generoSelecionado, setGeneroSelecionado] = useState(null);
    const [qntJogadoresPorTime, setQntJogadoresPorTime] = useState("");
    const [timesGerados, setTimesGerados] = useState(null);
    const [esporteSelecionado, setEsporteSelecionado] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Página atual
    const itemsPerPage = 8;
    const [editingTeam, setEditingTeam] = useState(null); // Estado para controlar o time em edição
    const [editedTeamName, setEditedTeamName] = useState("");

    // Busca jogadores ao carregar o componente
    useEffect(() => {
        const getJogadores = async () => {
            setLoadingJogadores(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/jogador`, {
                    headers: {
                        Authorization: token,
                    },
                });
                setJogadores(response.data);
            } catch (err) {
                toast.error(
                    err.response?.data?.message
                );
            } finally {
                setLoadingJogadores(false);
            }
        };
        getJogadores();
    }, [token]);

    // Busca esportes ao carregar o componente
    useEffect(() => {
        const getEsportes = async () => {
            setLoadingEsportes(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/esporte`, {
                    headers: {
                        Authorization: token,
                    },
                });
                setEsportes(response.data);
            } catch (err) {
                toast.error(
                    err.response?.data?.message
                );
            } finally {
                setLoadingEsportes(false);
            }
        };
        getEsportes();
    }, [token]);

    // Filtra jogadores por gênero, aceita todos se for "Misto"
    const jogadoresFiltrados = generoSelecionado === "Misto"
        ? jogadores
        : generoSelecionado
            ? jogadores.filter((jogador) =>
                jogador.jog_gender?.toLowerCase().trim() === generoSelecionado.toLowerCase().trim())
            : jogadores;

    // Manipula a seleção de jogadores
    const handleChangeJogadores = (jogadorId) => {
        if (!jogadoresSelecionados.some((jogador) => jogador.jog_id === jogadorId)) {
            const jogadorSelecionado = jogadores.find((jogador) => jogador.jog_id === jogadorId);
            if (jogadorSelecionado) {
                setJogadoresSelecionados([...jogadoresSelecionados, jogadorSelecionado]);
            }
        }
    };

    const paginatedTimes = timesGerados
        ? Object.keys(timesGerados).slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        )
        : [];

    const totalPages = timesGerados
        ? Math.ceil(Object.keys(timesGerados).length / itemsPerPage)
        : 0;

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Remove jogador da lista
    const handleRemoveJogador = (jogadorId) => {
        const atualizados = jogadoresSelecionados.filter(
            (jogador) => jogador.jog_id !== jogadorId
        );
        setJogadoresSelecionados(atualizados);
    };

    const handleGerarTimes = async () => {
        if (!qntJogadoresPorTime || isNaN(qntJogadoresPorTime)) {
            toast.error("Informe uma quantidade válida de jogadores por time.");
            return;
        }

        if (!esporteSelecionado) {
            toast.error("Selecione um esporte.");
            return;
        }

        const jogadoresIds = jogadoresSelecionados.map((jogador) => jogador.jog_id);
        const payload = {
            esporteId: esporteSelecionado,
            playersPerTeam: parseInt(qntJogadoresPorTime),
            tim_gender: generoSelecionado,
            jogadores: jogadoresIds,
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/time/gerar`, payload, {
                headers: { Authorization: token },
            });
            setTimesGerados(response.data);
            toast.success("Times gerados com sucesso!");
        } catch (error) {
            console.error("Erro ao gerar os times:", error.response?.data || error.message);
            toast.error(error.response?.data.message);
        }
    };

    const startEditingTeam = (teamKey, currentName) => {
        setEditingTeam(teamKey);
        setEditedTeamName(currentName);
    };

    const saveTeamName = (teamKey) => {
        setTimesGerados((prev) => ({
            ...prev,
            [teamKey]: {
                ...prev[teamKey],
                tim_name: editedTeamName,
            },
        }));
        setEditingTeam(null); // Finaliza a edição
    };

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h2>Geração de Times</h2>
                <Form layout="vertical" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <Form.Item>
                        <Select placeholder="Gênero" allowClear onChange={setGeneroSelecionado}>
                            <Option value="Feminino">Feminino</Option>
                            <Option value="Masculino">Masculino</Option>
                            <Option value="Misto">Misto</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Select
                            placeholder="Selecione o esporte"
                            allowClear
                            loading={loadingEsportes}
                            notFoundContent={loadingEsportes ? <Spin /> : "Nenhum esporte encontrado"}
                            onChange={(value) => setEsporteSelecionado(value)}
                            value={esporteSelecionado}
                        >
                            {esportes.map((esporte) => (
                                <Option key={esporte.esp_id} value={esporte.esp_id}>
                                    {esporte.esp_name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Input
                            placeholder="Quantidade de jogadores por time"
                            value={qntJogadoresPorTime}
                            onChange={(e) => setQntJogadoresPorTime(e.target.value)}
                            style={{ textAlign: "center" }}
                        />
                    </Form.Item>
                    <Form.Item>
                        <h3>Selecionar os jogadores para formar os times</h3>
                        <Select
                            placeholder="Selecionar jogadores"
                            loading={loadingJogadores}
                            notFoundContent={loadingJogadores ? <Spin /> : "Nenhum jogador encontrado"}
                            onChange={handleChangeJogadores}
                            value={null}
                            style={{ width: "100%" }}
                        >
                            {jogadoresFiltrados.map((jogador) => (
                                <Option key={jogador.jog_id} value={jogador.jog_id}>
                                    {jogador.jog_name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <div className={styles.selectedPlayers}>
                        {jogadoresSelecionados.map((jogador) => (
                            <Tag
                                key={jogador.jog_id}
                                closable
                                onClose={() => handleRemoveJogador(jogador.jog_id)}
                                className={styles.selectedPlayerTag}
                            >
                                {jogador.jog_name}
                            </Tag>
                        ))}
                    </div>

                    {/* Botão abaixo */}
                    <div className={styles.buttonContainer}>
                        <Button type="primary" className={styles.btnCriarNovo} onClick={handleGerarTimes}>
                            Gerar
                        </Button>
                    </div>
                </Form>
            </div>

            <div className={styles.timesGeradosContainer}>
                <h2>Times Gerados</h2>
                <div className={styles.timesWrapper}>
                    {paginatedTimes.map((key) => (
                        <div key={key} className={styles.timeCard}>
                            <div className={styles.timeHeader}>
                                {editingTeam === key ? (
                                    <>
                                        <Input
                                            value={editedTeamName}
                                            onChange={(e) => setEditedTeamName(e.target.value)}
                                            onBlur={() => saveTeamName(key)}
                                            autoFocus
                                        />
                                    </>
                                ) : (
                                    <>
                                        <h3>{timesGerados[key].tim_name}</h3>
                                        <Button
                                            type="text"
                                            className={styles.editButton}
                                            icon={<EditOutlined />}
                                            onClick={() => startEditingTeam(key, timesGerados[key].tim_name)}
                                        />
                                    </>
                                )}
                            </div>
                            <ul className={styles.playerList}>
                                {timesGerados[key].jogadores.map((jogadorId) => {
                                    const jogador = jogadores.find((j) => j.jog_id === jogadorId);
                                    return <li key={jogadorId}>{jogador?.jog_name || `Jogador ${jogadorId}`}</li>;
                                })}
                            </ul>
                        </div>


                    ))}
                </div>
                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <Button
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            &#60;
                        </Button>
                        <span>{currentPage}</span>
                        <Button
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            &#62;
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GerarTimeTable;
