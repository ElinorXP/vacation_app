import React from 'react';
import {Link} from 'react-router-dom';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import store from "../../redux/store";
import { IUser } from '../../../../shared/IUser';
import { logout } from '../../redux/authSlice';

const Navigation = () => {
    const user : IUser | undefined = 
        useSelector<RootState, IUser | undefined>((state: RootState) => ((state.auth.user) as IUser | undefined));

    return(
        <div className="navigation d-flex flex-row justify-content-center gap-3 my-3">
            <Link to="/">Home</Link>
            {!user && <Link to="/register">Register</Link>}
            {user?.isAdmin && <Link to="/add-vacation">Add Vacation</Link>}
            {user?.isAdmin && <Link to="/reports">Reports</Link>}
            {user ? <Link onClick={()=>{store.dispatch(logout());}} to="/login">Logout</Link> : <Link to="/login">Login</Link>}
        </div>
    );
}
export default Navigation;