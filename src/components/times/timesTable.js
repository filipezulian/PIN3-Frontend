import React, { useState, useEffect } from 'react';
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
    const [novoTime, setNovoTime] = useState({ nome: "", genero: "" });
    const [timeSelecionado, setTimeSelecionado] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getTimes = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/time`, {
                    headers: {
                        'Authorization': token
                    }
                });
                setTimes(
                    response.data.map((time) => ({
                        tim_name: time.tim_name || "",
                        tim_gender: time.tim_gender || "",
                        ...time,
                    }))
                );
                setTimesFiltrados(response.data);
            } catch (err) {
                toast.error(err.response.data.message);
            }
        };

        getTimes();
    }, [token]);

    const handleNovoTime = (time) => {
        setTimes((prev) => {
            const updatedTimes = [...prev, time];
            setTimesFiltrados(applyFilters(updatedTimes, filtros)); // Atualiza a tabela
            return updatedTimes;
        });
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
        setIsModalOpen(false);
        setNovoTime({ nome: "", genero: "", quantidadeJogadores: null });
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
                        style={{ marginRight: '10px' }} // Adiciona espaçamento
                    >
                        Criar Novo
                    </Button>
                    <Button
                        type="primary"
                        className={styles.btnGerarTimes}
                        onClick={handleGerarTimes}
                        style={{ marginLeft: '10px' }} // Adiciona espaçamento
                    >
                        Gerar Times
                    </Button>
                </div>
            </div>

            {/* Tabela de times */}
            <div className={styles.tableContainer}>
                <Spin spinning={!times}>
                    <Table
                        columns={columns}
                        dataSource={timesFiltrados}
                        pagination={{ size: 10 }}
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
