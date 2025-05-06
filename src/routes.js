import { Routes, Route } from 'react-router';
import DrawScreen from './pages/DrawScreen/DrawScreen.js'

function AppRoutes(){
    return (
        <Routes>
            <Route path="/draw" element={<DrawScreen/>}/>
        </Routes>
    );
}

export default AppRoutes;