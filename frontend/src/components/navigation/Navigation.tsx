import React from 'react';
import {Link} from 'react-router-dom';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { IUser } from '../../../../shared/IUser';

const Navigation = () => {
    const user : IUser | undefined = 
        useSelector<RootState, IUser | undefined>((state: RootState) => ((state.auth.user) as IUser | undefined));

    return(
        <div className="navigation d-flex flex-row justify-content-center gap-3 my-3">
            <Link to="/">Home</Link>
            {!user && <Link to="/register">Register</Link>}
            {!user && <Link to="/login">Login</Link>}
            {user?.isAdmin && <Link to="/add-vacation">Add Vacation</Link>}
        </div>
    );
}
export default Navigation;