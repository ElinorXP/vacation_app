import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './components/register/Register';
import Navigation from './components/navigation/Navigation';
import AddVacation from './components/addVacation/AddVacation';
import Login from './components/login/Login';
import {Navigate, Route, RouteProps, Routes} from 'react-router-dom';
import Home from './components/home/Home';
import { useAuthUser } from './utils/User';
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { IUser } from '../../shared/IUser';

const UserRoute = ({ children }: any) => {
  const user : IUser | undefined = 
    useSelector<RootState, IUser | undefined>((state: RootState) => ((state.auth.user) as IUser | undefined));

  return (
  user ?
  children :
  <Navigate to='/login' />
 );
};

const AdminRoute = ({ children }: any) => {
  const user : IUser | undefined = 
    useSelector<RootState, IUser | undefined>((state: RootState) => ((state.auth.user) as IUser | undefined));

  return (
  user?.isAdmin ?
  children :
  <Navigate to='/login' />
 );
};

function App(){ 
  return(
    <div className="app container">
      <Navigation/>
      <Routes>
        <Route path="/" element={<UserRoute><Home/></UserRoute>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/add-vacation" element={<AdminRoute><AddVacation/></AdminRoute>}/>
      </Routes>
    </div>
  );
}

export default App;