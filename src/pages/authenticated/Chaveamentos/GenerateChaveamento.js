/* eslint react-hooks/exhaustive-deps: "off" */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Input, Select, Card } from 'antd';

const GenerateChaveamento = () => {
    const [chaveamento, setChaveamento] = useState({});
    const [numEquipes, setNumEquipes] = useState(4);
    const [equipes, setEquipes] = useState([]);
    const token = Cookies.get("accessToken");
    const navigate = useNavigate();
    const { id } = useParams();
    const [form] = Form.useForm();

    const generateEquipes = () => {
        const equipesList = Array.from({ length: numEquipes }, (_, i) => ({
            id: i + 1,
            name: `Equipe ${i + 1}`,
        }));
        setEquipes(equipesList);
    };

    const postChaveamento = async (data) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/chaveamento`, data, {
                headers: {
                    Authorization: token,
                },
            });
            toast.success('Chaveamento gerado com sucesso!');
            navigate('/bracket', { state: { rounds: response.data.rounds, name: response.data.name } });
        } catch (err) {
            toast.error(err.response?.data?.message || "Erro ao gerar chaveamento.");
        }
    };

    const onFinish = (values) => {
        const requestBody = {
            chav_id: chaveamento.chav_id,
            qntTimes: numEquipes,
            name: values.tournamentName,
            times: equipes.map((equipe) => equipe.name),
        };
        postChaveamento(requestBody);
    };

    useEffect(() => {
        const getChaveamentos = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/chaveamento`, {
                    headers: {
                        Authorization: token,
                    },
                });
                const exists = response.data.some((chav) => {
                    if (chav.chav_id === Number(id)) {
                        setChaveamento(chav);
                        setNumEquipes(chav.minlimit || 4);
                        generateEquipes();
                        return true;
                    }
                    return false;
                });

                if (!exists) {
                    navigate("/chaveamentos");
                }
            } catch (err) {
                toast.error(err.response?.data?.message || "Erro ao buscar chaveamentos.");
            }
        };

        if (token) {
            getChaveamentos();
        }
    }, [id, navigate, token]);

    useEffect(() => {
        generateEquipes();
    }, [numEquipes]);

    return (
        <div className="formContainer">
            <span className="textWeight textTitulo">{chaveamento.chav_name || "Carregando..."}</span>
            <Form
                layout="vertical"
                onFinish={onFinish}
                form={form}
            >
                <Form.Item
                    label="Nome do torneio"
                    name="tournamentName"
                    rules={[{ required: true, message: 'Insira o nome do torneio!' }]}
                >
                    <Input placeholder="Nome do torneio" />
                </Form.Item>

                <Form.Item
                    label="Quantidade de Equipes"
                    name="numEquipes"
                    rules={[{
                        validator: (_, value) => {
                            if (!value) {
                                return Promise.reject(new Error('Selecione o número de equipes!'));
                            }
                            if (chaveamento.chav_id === 1 && value % 2 !== 0) {
                                return Promise.reject(new Error('Para Eliminação Simples, o número de equipes deve ser par.'));
                            }
                            return Promise.resolve();
                        },
                    }]}
                >
                    <Select
                        value={numEquipes}
                        onChange={(value) => setNumEquipes(value)}
                        style={{ width: "100%" }}
                    >
                        {Array.from(
                            { length: (chaveamento.maxlimit || 10) - (chaveamento.minlimit || 1) + 1 },
                            (_, i) => (chaveamento.minlimit || 1) + i
                        ).map((value) => (
                            <Select.Option key={value} value={value}>
                                {value}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Card className="card" title="Lista equipes:" bordered>
                    {equipes.map((equipe, index) => (
                        <Form.Item key={index} style={{ marginBottom: 10, marginRight: 10 }}>
                            <Input
                                value={equipe.name}
                                onChange={(e) => {
                                    const updatedEquipes = [...equipes];
                                    updatedEquipes[index].name = e.target.value;
                                    setEquipes(updatedEquipes);
                                }}
                            />
                        </Form.Item>
                    ))}
                </Card>

                <div style={{ marginTop: 20 }}>
                    <Button type="default" style={{ marginRight: 10 }} onClick={() => navigate("/chaveamentos")}>
                        Cancelar
                    </Button>
                    <Button type="primary" htmlType="Gerar">
                        Baixar
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default GenerateChaveamento;
