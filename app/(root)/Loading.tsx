
import Image from 'next/image'
import React from 'react'

const Loading = () => {
  return (
    <div className='text-white flex justify-center flex-grow items-center'>
      <Image  src="/assets/loader.svg" alt="loading" width={30} height={30} className='animate-spin'/>
    </div>
  )
}

export default Loading;
