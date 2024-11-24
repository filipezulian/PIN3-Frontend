import { Flex } from 'antd'
import React from 'react'
import "./auth.css"

const TelaAuthLayout = ({ children }) => {
    return (
        <Flex className='bodyFlex'>
            <div className='sixty'>
            </div>
            <div className="forty">
                <span className='title'>
                    BRACKETIER
                </span>
                {children}
            </div>
        </Flex>
    )
}

export default TelaAuthLayout