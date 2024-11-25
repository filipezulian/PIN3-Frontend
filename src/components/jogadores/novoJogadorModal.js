import React from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';
import styles from "./jogadores.module.css";

const { Option } = Select;

const NovoJogadorModal = ({ open, onClose, onCreate, novoJogador, setNovoJogador }) => {
    return (
        <Modal
            title="Novo Jogador"
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="cancelar"
                    type="primary"
                    onClick={onClose}
                    className={styles.cancelButton}>
                    Cancelar
                </Button>,
                <Button
                    key="adicionar"
                    type="primary"
                    onClick={onCreate}
                    className={styles.addButton}
                >
                    Adicionar
                </Button>,
            ]}
        >
            <Form layout="vertical">
                <Form.Item required>
                    <Input
                        placeholder="Nome Exemplo"
                        value={novoJogador.nome}
                        onChange={(e) =>
                            setNovoJogador((prev) => ({ ...prev, nome: e.target.value }))
                        }
                    />
                </Form.Item>
                <Form.Item required>
                    <Select
                        placeholder="Selecione o gênero"
                        value={novoJogador.genero || undefined}
                        onChange={(value) =>
                            setNovoJogador((prev) => ({ ...prev, genero: value }))
                        }
                    >
                        <Option value="Feminino">Feminino</Option>
                        <Option value="Masculino">Masculino</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default NovoJogadorModal;