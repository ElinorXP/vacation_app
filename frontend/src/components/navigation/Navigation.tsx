import React from 'react';
import {Link} from 'react-router-dom';
import { IUser } from '../../../../shared/IUser';
import { useAuthUser } from '../../utils/User';

interface NavigationProps {
    user?: IUser;
}

const Navigation = (props: NavigationProps) => {
    return(
        <div className="navigation d-flex flex-row justify-content-center gap-3 my-3">
            <Link to="/">Home</Link>
            <Link to="/register">Register</Link>
            {!props.user && <Link to="/login">Login</Link>}
            {props.user?.isAdmin && <Link to="/add-vacation">Add Vacation</Link>}
            {props.user?.isAdmin && <Link to="/reports">Reports</Link>}
        </div>
    );
}
export default Navigation;