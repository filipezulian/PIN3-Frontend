import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import { UserOutlined, TeamOutlined, ApartmentOutlined } from '@ant-design/icons';
import styles from './home.module.css';

const Home = () => {
  const user = JSON.parse(Cookies.get('user'));
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* Saudação no topo */}
      <div className={styles.greeting}>
        <h1>Olá, {user.name}!</h1>
        <p>Parece que você não tem nenhum campeonato ainda! Bora criar um?</p>
        <Button
          type="primary"
          className={styles.primaryButton}
          onClick={() => navigate('/campeonatos')}
        >
          Novo Campeonato
        </Button>
      </div>

      {/* Funcionalidades no final */}
      <div className={styles.features}>
        <h3>Explore outras funcionalidades do Bracketier:</h3>
        <div className={styles.featureButtons}>
          <Button
            className={styles.featureButton}
            onClick={() => navigate('/jogadores')}
            icon={<UserOutlined />}
          >
            Cadastre Jogadores
          </Button>
          <Button
            className={styles.featureButton}
            onClick={() => navigate('/times')}
            icon={<TeamOutlined />}
          >
            Cadastre Times
          </Button>
          <Button
            className={styles.featureButton}
            onClick={() => navigate('/chaveamentos')}
            icon={<ApartmentOutlined />}
          >
            Crie Chaveamentos
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
