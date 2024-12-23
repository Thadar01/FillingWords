'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic'

const PhaserGame = dynamic(() => import('../components/GameComponent'), { ssr: false });
const page = () => {
    const searchParams=useSearchParams();
    const level=searchParams.get('name')
  return (
    <PhaserGame name={level}/>
  )
}

export default page