import React from "react";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import "./RecuperarSenha.css";
import { toast } from 'react-toastify';

const RecuperarSenha = () => {
    const navigate = useNavigate();

    const onFinish = (values) => {
        const { email } = values;
        console.log("E-mail para recuperação:", email);
        toast.info(`Funcionalidade não implementada: o e-mail "${email}" não será enviado.`, {
            position: "top-right",
            autoClose: 5000, 
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    return (
        <div className="recuperar-container">
            {/* A imagem foi removida aqui */}
            <div className="recuperar-content" style={{ width: "100%" }}>
                <h1 className="recuperar-title">BRACKETIER</h1>
                <p className="recuperar-description">
                    Esqueceu sua senha? Acontece com todos!
                    <br />
                    Me fala seu e-mail e te mando um código para você poder recuperá-la!
                </p>
                <Form
                    name="recuperarSenha"
                    layout="vertical"
                    onFinish={onFinish}
                    className="recuperar-form"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: "Por favor, insira seu e-mail!" },
                            { type: "email", message: "Por favor, insira um e-mail válido!" },
                        ]}
                    >
                        <Input placeholder="Informe seu email" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="recuperar-button">
                            Enviar
                        </Button>
                    </Form.Item>
                </Form>
                <Button
                    type="link"
                    className="recuperar-voltar"
                    onClick={() => navigate("/login")}
                >
                    Voltar para o Login
                </Button>
            </div>
        </div>
    );
};

export default RecuperarSenha;
