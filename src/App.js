import React from 'react'
import AppRoutes from './routes.js';
import { BrowserRouter } from 'react-router';

function App() {
  return(
    <BrowserRouter>
      <AppRoutes/>
    </BrowserRouter>
  )
}

export default App
