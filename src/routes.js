import { Routes, Route } from 'react-router';
import DrawScreen from './pages/DrawScreen/DrawScreen.js'
import UserGraphs from './pages/UserGraphs/UserGraphs.js';

function AppRoutes(){
    return (
        <Routes>
            <Route path="/draw" element={<DrawScreen/>}/>
            <Route path="/user/graphs" element={<UserGraphs/>}/>
        </Routes>
    );
}

export default AppRoutes;