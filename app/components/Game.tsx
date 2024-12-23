'use client'
import React, { useState } from 'react'
import dynamic from 'next/dynamic'

const PhaserGame = dynamic(() => import('./GameComponent'), { ssr: false });



const Game = () => {
  return (
    <div className='flex flex-row bg-blue-300'>
        <PhaserGame />
    </div>
  )
}

export default Game