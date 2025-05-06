import Image from 'next/image'
import React from 'react'

export default function Verified() {
  return (
    <>
      <div className='w-[90%] sm:w-[70%] md:w-[60%] mx-auto flex flex-col gap-8 mt-12'>
        <Image src="/general/verification-check.png" alt='' width={400} height={200}/>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold'>Nothing to see here — yet</h1>
          <p className='text-[15px] text-textGray'>Likes, mentions, reposts, and a whole lot more — when it comes from a verified account, you&apos;ll find it here. <span className='text-white underline text-bold'>Learn more</span></p>
        </div>
      </div>
    </>
  )
}
