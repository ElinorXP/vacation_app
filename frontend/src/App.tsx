import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './components/register/Register';
import Navigation from './components/navigation/Navigation';
import AddVacation from './components/addVacation/AddVacation';
import Login from './components/login/Login';
import Reports from './components/reports/Reports';
import {Navigate, Route, Routes} from 'react-router-dom';
import Home from './components/home/Home';
import { useAuthUser } from './utils/User';

function App(){
  const user = useAuthUser(true);
  
  return(
    <div className="app container">
      <Navigation user={user}/>
      <Routes>     
        <Route path="/" element={<Home/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/add-vacation" element={<AddVacation/>}/>
        <Route path="/reports" element={<Reports/>}/>
        <Route path="*" element={<Home/>}/>
      </Routes>
    </div>
  );
}

export default App;