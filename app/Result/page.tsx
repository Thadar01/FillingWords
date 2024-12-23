'use client'
import { useSearchParams } from 'next/navigation'
import React from 'react'

const page = () => {
    const param=useSearchParams()
    const score=param.get('score')
  return (
    <div>Score: {score} </div>
  )
}

export default page