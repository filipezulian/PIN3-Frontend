import { Button, Flex, Form, Input } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from "../../context/AuthContext";

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
        <Flex vertical gap="large" justify="center" align="center">
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Por favor adicione seu email!' }]}
                >
                    <Input placeholder="Informe seu email" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Por favor adicione sua senha!' }]}
                >
                    <Input.Password placeholder="Informe sua senha" />
                </Form.Item>
                <Button type="link">Esqueceu sua senha?</Button>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        LOGIN
                    </Button>
                </Form.Item>
            </Form>
            <Button type="link">Não tem uma conta? Cadastre-se</Button>
        </Flex>
    );
};

export default Login;