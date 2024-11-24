import React from "react";
import styles from "./header.module.css";
import { Button, Flex } from "antd";

const Header = () => {
    return (
        <>
            <Flex gap='large' className={`${styles.header}`}>
                <div className={`${styles.alingmentBaseline}`}>
                    <span className={`${styles.titulo}`}>BRACKETIER</span>
                    <span className={`${styles.subtitulo}`}>Uma parceria com a UDESC CEAVI</span>
                </div>
                    <Button type="primary" href="/login" className={`${styles.button}`}>
                    LOGIN
                    </Button>
            </Flex>
        </>
    )
}

export default Header