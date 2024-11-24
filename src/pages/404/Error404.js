import React from 'react'
import {
  FrownOutlined,
} from '@ant-design/icons';
import './E404.css'
import { Button } from 'antd';

const Error404 = () => {
  return (
    <div className='corpo'>
      <FrownOutlined className='frown' style={{ color: '#F1AF19' }} />
      <span className='texto'>
        Não encontramos essa página!
      </span>
      <Button type="primary" href="/home" className='button'>
        Voltar
      </Button>
    </div>
  )
}

export default Error404