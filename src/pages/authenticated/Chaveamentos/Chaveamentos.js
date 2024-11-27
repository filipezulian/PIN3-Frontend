/* eslint react-hooks/exhaustive-deps: "off" */
import { Card } from 'antd'
import Meta from 'antd/es/card/Meta'
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import "./Chaveamento.css"
import { useNavigate } from "react-router-dom";

const Chaveamentos = () => {
  const [cards, setCards] = useState([]);
  const token = Cookies.get("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    const getChaveamentos = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/chaveamento`, {
          headers: {
            'Authorization': token
          }
        });
        setCards(response.data)
      } catch (err) {
        toast.error(err.response.data.message);
        return null;
      }
    };
    getChaveamentos();
  }, []);

  const navigateGenerate = (id) => {
    navigate(`/chaveamentos/${id}`)
  };

  return (
    <div className='chaveamentoCorpo'>
      <span className='textTitulo textWeight'>Chaveamentos</span>
      <div>
        <span className='textWeight'>Aqui você vai encontrar os tipos classicos de chaveamentos! Pra usar é super simples, só escolher um,</span>
        <span className='textWeight'>falar a quantidade de Equipes ou Jogadores que vão participar. Depois, é só baixar!!!</span>
      </div>
      <div className='cardDiv'>
        {cards.map(card => (
          <Card
            key={card.chav_id}
            hoverable
            onClick={() => navigateGenerate(card.chav_id)}
            style={{ width: 240, margin: "10px" }}
            cover={<img alt={card.chav_name} src={`assets/${card.chav_name}.png`} />}
          >
            <Meta
              title={card.chav_name}
              description={`Min. teams: ${card.minlimit} | Max. teams: ${card.maxlimit}`}
            />
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Chaveamentos