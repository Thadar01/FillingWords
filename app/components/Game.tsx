'use client'
import React, { useState } from 'react'
import FillWords from './FillWords'
import dynamic from 'next/dynamic'

const PhaserGame = dynamic(() => import('./GameComponent'), { ssr: false });



const Game = () => {
  return (
    <div className='flex flex-row bg-blue-300'>
        {/* <PhaserGame /> */}
        <FillWords/>
    </div>
  )
}

export default Game