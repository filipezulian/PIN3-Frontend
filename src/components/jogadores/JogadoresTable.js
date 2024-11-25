import React, { useState, useEffect } from 'react';
import { Table, Spin, Button, Form, Input } from 'antd';
import axios from "axios";
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import styles from "./jogadores.module.css";
import NovoJogadorModal from "./novoJogadorModal";
import EditarJogadorModal from "./editarJogadorModal";

const JogadoresTable = () => {
  const [jogadores, setJogadores] = useState([]);
  const token = Cookies.get('accessToken');
  const [jogadoresFiltrados, setJogadoresFiltrados] = useState([]);
  const [filtros, setFiltros] = useState({ nome: "", genero: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditarJogadorModalOpen, setIsEditarJogadorModalOpen] = useState(false);
  const [novoJogador, setNovoJogador] = useState({ nome: "", genero: "" });
  const [jogadorSelecionado, setJogadorSelecionado] = useState(null);

  useEffect(() => {
    const getJogadores = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/jogador`, {
          headers: {
            'Authorization': token
          }
        });
        setJogadores(response.data);
        setJogadoresFiltrados(response.data);
      } catch (err) {
        toast.error(err.response.data.message);
        return null;
      }
    };
    getJogadores();
  }, [token]);

  const handleFiltroChange = (field, value) => {
    setFiltros((prev) => ({ ...prev, [field]: value }));

    const filtrados = jogadores.filter((jogador) => {
      const nomeMatch = jogador.jog_name
        .toLowerCase()
        .includes(field === "nome" ? value.toLowerCase() : filtros.nome.toLowerCase());

      const generoMatch =
        field === "genero"
          ? jogador.jog_gender.toLowerCase().includes(value.toLowerCase())
          : jogador.jog_gender.toLowerCase().includes(filtros.genero.toLowerCase());

      return nomeMatch && generoMatch;
    });

    setJogadoresFiltrados(filtrados);
  };

  const abrirModal = () => {
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setNovoJogador({ nome: "", genero: "" });
  };

  const criarJogador = async () => {
    if (!novoJogador.nome || !novoJogador.genero) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/jogador`, {
        jog_name: novoJogador.nome,
        jog_gender: novoJogador.genero,
      }, {
        headers: {
          Authorization: token,
        },
      });
      toast.success("Jogador criado com sucesso!");

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/jogador`, {
        headers: {
          Authorization: token,
        },
      });
      setJogadores(response.data);
      setJogadoresFiltrados(response.data);

      fecharModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao criar jogador.");
    }
  };

  const abrirEditarJogadorModal = (jogador) => {
    setJogadorSelecionado(jogador);
    setIsEditarJogadorModalOpen(true);
  };

  const fecharEditarJogadorModal = () => {
    setJogadorSelecionado(null);
    setIsEditarJogadorModalOpen(false);
  };

  const columns = [
    {
      title: "Nome do Jogador",
      dataIndex: "jog_name",
      key: "jog_name",
      render: (_, record) => (
        <span
          onClick={() => abrirEditarJogadorModal(record)}
          style={{ cursor: "pointer", color: "#3A2904" }}
        >
          {record.jog_name}
        </span>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      {/* Formulário de filtros */}
      <div className={styles.formContainer}>
        <h2>Jogadores</h2>
        <Form layout="vertical">
          <Form.Item>
            <Input
              placeholder="Digite o nome"
              value={filtros.nome}
              onChange={(e) => handleFiltroChange("nome", e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Input
              placeholder="Digite o gênero"
              value={filtros.genero}
              onChange={(e) => handleFiltroChange("genero", e.target.value)}
            />
          </Form.Item>
        </Form>
        <div className={styles.buttonContainer}>
          <Button type="primary" className={styles.btnCriarNovo} onClick={abrirModal}>Criar Novo</Button>
        </div>
      </div>

      {/* Tabela de jogadores */}
      <div className={styles.tableContainer}>
        <Spin spinning={!jogadores}>
          <Table
            columns={columns}
            dataSource={jogadoresFiltrados}
            pagination={{ size: 10 }}
            rowKey="id"
          />
        </Spin>
      </div>
      {/* NovoJogadorModal */}
      <NovoJogadorModal
        open={isModalOpen}
        onClose={fecharModal}
        onCreate={criarJogador}
        novoJogador={novoJogador}
        setNovoJogador={setNovoJogador}
      />
      <EditarJogadorModal
        open={isEditarJogadorModalOpen}
        onClose={fecharEditarJogadorModal}
        jogador={jogadorSelecionado}
        setJogadores={setJogadores}
        setJogadoresFiltrados={setJogadoresFiltrados}
      />
    </div>
  );
};

export default JogadoresTable;
