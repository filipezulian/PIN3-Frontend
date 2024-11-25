import React from "react";
import { Modal, Button } from "antd";
import styles from "./jogadores.module.css";
import { ExclamationCircleFilled } from "@ant-design/icons";

const DeletarJogadorModal = ({ open, onCancel, onConfirm, jogador }) => {
    return (
        <Modal
            title={
                <span style={{ color: "red" }}>
                    <ExclamationCircleFilled style={{ color: "red", marginRight: 8}} />
                    Tem certeza que quer deletar {jogador?.jog_name}?
                </span>
            }
            open={open}
            onCancel={onCancel}
            footer={[
                <Button
                    key="manter"
                    className={styles.cancelButton}
                    onClick={onCancel} 
                >
                    Manter
                </Button>,
                <Button
                    key="confirmar"
                    className={styles.deleteButton}
                    onClick={onConfirm} 
                >
                    Deletar
                </Button>,
            ]}
        >
            <p>Essa ação será definitiva!</p>
        </Modal>
    );
};

export default DeletarJogadorModal;
