import React, { useState, useEffect, useCallback } from 'react';
import { Table, Spin, Button, Form, Input, Select } from 'antd';
import axios from "axios";
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import styles from "../jogadores/jogadores.module.css";
import NovoTimeModal from "./novoTimeModal";
import EditarTimeModal from "./editarTimeModal";
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const TimesTable = () => {
    const [times, setTimes] = useState([]);
    const token = Cookies.get('accessToken');
    const [timesFiltrados, setTimesFiltrados] = useState([]);
    const [filtros, setFiltros] = useState({ nome: "", genero: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditarTimeModalOpen, setIsEditarTimeModalOpen] = useState(false);
    const [novoTime, setNovoTime] = useState({ nome: "", genero: "", quantidadeJogadores: null });
    const [timeSelecionado, setTimeSelecionado] = useState(null);
    const navigate = useNavigate();

    // Função para buscar times com useCallback
    const fetchTimes = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/time`, {
                headers: {
                    Authorization: token,
                },
            });
            const updatedTimes = response.data.map((time) => ({
                tim_name: time.tim_name || "",
                tim_gender: time.tim_gender || "",
                ...time,
            }));
            setTimes(updatedTimes);
            setTimesFiltrados(applyFilters(updatedTimes, filtros)); // Aplica filtros
        } catch (err) {
            toast.error(err.response?.data?.message || "Erro ao buscar times.");
        }
    }, [token, filtros]);

    useEffect(() => {
        fetchTimes();
    }, [fetchTimes]);

    const handleNovoTime = async () => {
        await fetchTimes(); // Atualiza a lista de times após criar um novo
    };

    const applyFilters = (allTimes, currentFilters) => {
        return allTimes.filter((time) => {
            const nomeMatch = time.tim_name
                ? time.tim_name.toLowerCase().includes(currentFilters.nome?.toLowerCase() || "")
                : false;

            const generoMatch = currentFilters.genero
                ? time.tim_gender?.toLowerCase() === currentFilters.genero.toLowerCase()
                : true;

            return nomeMatch && generoMatch;
        });
    };

    const handleFiltroChange = (field, value) => {
        const updatedFilters = { ...filtros, [field]: value };
        setFiltros(updatedFilters);

        const filtrados = applyFilters(times, updatedFilters);
        setTimesFiltrados(filtrados);
    };

    const abrirModal = () => {
        setIsModalOpen(true);
    };

    const fecharModal = () => {
        setNovoTime({ nome: "", genero: "", quantidadeJogadores: null });
        setIsModalOpen(false);
    };

    const abrirEditarTimeModal = (time) => {
        setTimeSelecionado(time);
        setIsEditarTimeModalOpen(true);
    };

    const fecharEditarTimeModal = () => {
        setTimeSelecionado(null);
        setIsEditarTimeModalOpen(false);
    };

    const handleGerarTimes = () => {
        navigate("/gerarTime");
    };

    const columns = [
        {
            title: "Nome do Time",
            dataIndex: "tim_name",
            key: "tim_name",
            render: (_, record) => (
                <span
                    onClick={() => abrirEditarTimeModal(record)}
                    style={{ cursor: "pointer", color: "#3A2904" }}
                >
                    {record.tim_name}
                </span>
            ),
        },
    ];

    return (
        <div className={styles.container}>
            {/* Formulário de filtros */}
            <div className={styles.formContainer}>
                <h2>Times</h2>
                <Form layout="vertical">
                    <Form.Item>
                        <Input
                            placeholder="Digite o nome"
                            value={filtros.nome}
                            onChange={(e) => handleFiltroChange("nome", e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Select
                            placeholder="Selecione o gênero"
                            value={filtros.genero || undefined}
                            onChange={(value) => handleFiltroChange("genero", value)}
                            allowClear
                        >
                            <Option value="Feminino">Feminino</Option>
                            <Option value="Masculino">Masculino</Option>
                            <Option value="Misto">Misto</Option>
                        </Select>
                    </Form.Item>
                </Form>
                <div className={styles.buttonContainer}>
                    <Button
                        type="primary"
                        className={styles.btnCriarNovo}
                        onClick={abrirModal}
                        style={{ marginRight: '10px' }}
                    >
                        Criar Novo
                    </Button>
                    <Button
                        type="primary"
                        className={styles.btnGerarTimes}
                        onClick={handleGerarTimes}
                        style={{ marginLeft: '10px' }}
                    >
                        Gerar Times
                    </Button>
                </div>
            </div>

            {/* Tabela de times */}
            <div className={styles.tableContainer}>
                <Spin spinning={times.length === 0}>
                    <Table
                        columns={columns}
                        dataSource={timesFiltrados}
                        pagination={{ pageSize: 10 }}
                        rowKey="tim_id"
                    />
                </Spin>
            </div>
            {/* NovoTimeModal */}
            <NovoTimeModal
                open={isModalOpen}
                onClose={fecharModal}
                onCreate={handleNovoTime}
                novoTime={novoTime}
                setNovoTime={setNovoTime}
            />
            <EditarTimeModal
                open={isEditarTimeModalOpen}
                onClose={fecharEditarTimeModal}
                time={timeSelecionado}
                setTimes={setTimes}
                setTimesFiltrados={setTimesFiltrados}
            />
        </div>
    );
};

export default TimesTable;
