import React from 'react'

const Footer = () => {
  return (
    <div className="w-full mt-10 bg-pink-400 justify-center rounded-md text-black">
      <div className="flex flex-col text-center ">
        <div className="place-items-center bg-pink-300 py-2 border-4 border-pink-400 border-b-8 rounded-md">
          <div className='font-semibold underline decoration-dashed underline-offset-4'>⟪พัฒนาโดย⟫</div>
          <div className='font-medium'>นายภาคภูมิ ทีดินดำ BACKEND</div>
          <div className='font-medium'>นางสาวแทมมารีน ตาปราบ FORNTEND</div>
          <div className='font-semibold underline decoration-dashed underline-offset-4 mt-4'>⟪ครูที่ปรึกษา⟫</div>
          <div className='font-medium'>นายมงคล ชนะดี</div>
        </div>
      </div>
    </div>
  )
}
export default Footer
