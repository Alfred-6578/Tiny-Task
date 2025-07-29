import React from 'react'

type HeaderProps = {
    title?: string,
    description?: string,
}

const Header = ({title, description}: HeaderProps) => {
  return (
    <div className='text-center'>
        <h1 className="text-lg tny:text-xl vsm:text-2xl font-semibold text-text-main vsm:mb-2">{title}</h1>
        <p className="text-sm text-text-light mt-1">
           {description}
        </p>
    </div>
  )
}

export default Header
