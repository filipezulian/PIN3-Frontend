import React from 'react'
import Cookies from "js-cookie";

const Home = () => {
  const user = JSON.parse(Cookies.get('user'));
  return (
    <>
      <div>
        <span>Olá, {user.name}!</span>
        <span>Parece que você não tem nenhum campeonato ainda! Bora criar um?</span>
      </div>
    </>
  )
}

export default Home