import React from 'react'
import Canvas from './Canvas'
import Toolbar from './Toolbar';

function DrawScreen() {
  return(
      <>
          <Toolbar />
          <Canvas width={2300} height={800} />
      </>
  )
}

export default DrawScreen;