import React from 'react';
import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './TelaCadastro.css';

const TelaCadastro = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        const { nome, email, senha } = values;

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/usuario`,
                {
                    usr_name: nome,
                    usr_email: email,
                    usr_password: senha,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );

            if (response.status === 201 || response.status === 200) {
                toast.success('Cadastro realizado com sucesso!');
                navigate('/login');
            } else {
                toast.error(`Erro no cadastro: ${response.data.message || 'Verifique os dados!'}`);
            }
        } catch (error) {
            toast.error(
                `Erro ao conectar ao servidor: ${
                    error.response?.data?.message || error.message
                }`
            );
        }
    };

    return (
        <div className="cadastro-container">
            <div className="cadastro-box">
                <h1 className="cadastro-title">BRACKETIER</h1>
                <Form
                    name="register"
                    layout="vertical"
                    className="cadastro-form"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        name="nome"
                        rules={[{ required: true, message: 'Por favor, insira seu nome!' }]}
                    >
                        <Input placeholder="Nome" className="cadastro-input" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Por favor, insira seu email!' },
                            { type: 'email', message: 'Por favor, insira um email válido!' },
                        ]}
                    >
                        <Input placeholder="Email" className="cadastro-input" />
                    </Form.Item>

                    <Form.Item
                        name="senha"
                        rules={[
                            { required: true, message: 'Por favor, insira sua senha!' },
                            { min: 8, message: 'A senha deve ter pelo menos 8 caracteres!' },
                        ]}
                    >
                        <Input.Password placeholder="Senha" className="cadastro-input" />
                    </Form.Item>

                    <Form.Item
                        name="confirmarSenha"
                        rules={[
                            { required: true, message: 'Por favor, confirme sua senha!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('senha') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('As senhas não coincidem!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Confirme sua senha" className="cadastro-input" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="cadastro-button">
                            CADASTRAR
                        </Button>
                    </Form.Item>
                </Form>
                <Button
                    type="link"
                    className="cadastro-login-link"
                    onClick={() => navigate('/login')}
                >
                    Já tem uma conta? Faça seu Login
                </Button>
            </div>
        </div>
    );
};

export default TelaCadastro;
