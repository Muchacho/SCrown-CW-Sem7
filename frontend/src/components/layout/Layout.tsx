import React, { useState } from 'react';
import AltMenu from '../menu/altMenu';


type Props = {
    children: React.ReactNode
}


export const Layout = ({children}:Props) => {
  return (
    <div>
        <AltMenu/>
        {children}
    </div>
  )
}
