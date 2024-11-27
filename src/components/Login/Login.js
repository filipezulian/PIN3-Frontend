import { Button, Form, Input } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from "../../context/AuthContext";
import './Login.css'; // Arquivo CSS para ajustes visuais

const Login = () => {
    const navigate = useNavigate();
    const { autenticar } = useAuth();

    const onFinish = async (values) => {
        const { email, password } = values;
        const result = await autenticar(email, password);
        if (result && result.token) {
            toast.success("Login bem-sucedido!");
            navigate("/home");
        } else {
            toast.error("Falha no login. Verifique suas credenciais.");
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-title">BRACKETIER</h1>
            <Form
                name="basic"
                layout="vertical"
                className="login-form"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Por favor adicione seu email!' }]}
                >
                    <Input placeholder="Informe seu email" className="login-input" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Por favor adicione sua senha!' }]}
                >
                    <Input.Password placeholder="Informe sua senha" className="login-input" />
                </Form.Item>
                <Button type="link" className="login-forgot">
                    Esqueceu sua senha?
                </Button>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-button">
                        LOGIN
                    </Button>
                </Form.Item>
            </Form>
            <Button
                type="link"
                className="login-register"
                onClick={() => navigate("/cadastro")}
            >
                Não tem uma conta? Cadastre-se
            </Button>
        </div>
    );
};

export default Login;
