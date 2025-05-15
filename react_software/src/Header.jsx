import React, { useEffect, useState } from 'react'
import Logo from '../imgs/MilenioLetters.png'

function Header(){
    return(
        <>
           <div className='header'>
                <img src={Logo} className='logo' />
           </div>
        </>
    )
}

export default Header;