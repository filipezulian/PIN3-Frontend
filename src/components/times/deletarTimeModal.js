import React from "react";
import { Modal, Button } from "antd";
import styles from "../jogadores/jogadores.module.css";
import { ExclamationCircleFilled } from "@ant-design/icons";

const DeletarTimeModal = ({ open, onCancel, onConfirm, time }) => {
    return (
        <Modal
            title={
                <span style={{ color: "red" }}>
                    <ExclamationCircleFilled style={{ color: "red", marginRight: 8 }} />
                    Tem certeza que deseja deletar "{time?.tim_name}"?
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
            <p>Essa ação não poderá ser desfeita!</p>
        </Modal>
    );
};

export default DeletarTimeModal;
