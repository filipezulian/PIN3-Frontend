import React from 'react';
import { Table, Button, Form, Input, Select } from 'antd';
import styles from "./campeonatos.module.css";

const CampeonatosTable = () => {
    const { Option } = Select;

    const columns = [
        {
            title: "Nome do Campeonato",
            dataIndex: "nome",
            key: "nome",
        }
    ];

    return (
        <div className={styles.container}>
            {/* Formulário de filtros */}
            <div className={styles.formContainer}>
                <h2>Campeonatos</h2>
                <Form layout="vertical">
                    <Form.Item>
                        <Input
                            placeholder="Filtro de nome"
                            className="inputPlaceholder"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Select
                            placeholder="Filtro de esporte"
                            allowClear
                        >
                            <Option value="Futebol">Futebol</Option>
                            <Option value="Basquete">Basquete</Option>
                            <Option value="Vôlei">Vôlei</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Select
                            placeholder="Filtro de chaveamento"
                            allowClear
                        >
                            <Option value="Eliminatória Simples">Eliminatória Simples</Option>
                            <Option value="Fase de Grupos">Fase de Grupos</Option>
                        </Select>
                    </Form.Item>
                </Form>
                <div className={styles.buttonContainer}>
                    <Button type="primary" className={styles.btnCriarNovo}>
                        Criar Novo
                    </Button>
                </div>
            </div>

            {/* Tabela de campeonatos */}
            <div className={styles.tableContainer}>
                <Table
                    columns={columns}
                    dataSource={[]} // Dados fictícios ou vazios
                    pagination={{ size: 10 }}
                    rowKey="id"
                />
            </div>
        </div>
    );
};

export default CampeonatosTable;
