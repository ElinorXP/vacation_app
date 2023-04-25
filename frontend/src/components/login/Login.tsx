import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import React, {useRef, useState} from 'react';
import { IRegisterErrors } from '../../Interfaces/RegisterErrors';
import ValidationError from '../../utils/ValidationError';
import { IUserCredentials } from '../../../../shared/IUser';
import {api} from '../apiUrl';
import { storeTokenInLocalStorage } from '../../utils/User';
import { userLogin } from '../../redux/authActions';
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import reducers from '../../redux/authSlice';

const Login = () => {
    const navigate = useNavigate();
    const [errorsObj, setErrorsObj] = useState<IRegisterErrors>({hasErrors: false});
    const dispatch = useDispatch<ThunkDispatch<ReturnType<typeof reducers>, any, AnyAction>>();

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const validate = (username:string, password:string) => {
        let _errors:IRegisterErrors = {hasErrors: false};
        if(username === ""){
            _errors.username = 'Enter valid username';
            _errors.hasErrors = true;
        }
        if(password === ""){
            _errors.password = 'Enter valid password';
            _errors.hasErrors = true;
        }

        if(_errors.hasErrors) throw new ValidationError(_errors);
    }

    const handleSubmit:React.MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();

        const userName = usernameRef.current?.value || "";
        const password = passwordRef.current?.value || "";

        try{
            validate(userName, password);
            const userCredentials:IUserCredentials = {
                userName,
                password
            };
            await dispatch(userLogin(userCredentials));
            navigate("/");
        }catch(err){
            if(err instanceof ValidationError){
                const validationError:ValidationError = err;
                setErrorsObj(validationError.getErrors() as IRegisterErrors);
            }else if(err instanceof AxiosError && ((err.response?.status ?? 0) === 500)){ // אם סטטוס = 500 אם הוא מוגדר
                const axiosErr = err as AxiosError;
                const _errors: IRegisterErrors = {hasErrors: false, serverError: axiosErr.response?.data as string || ""};
                setErrorsObj(_errors);
            } else {
                console.log(err);
            }
        }
    }

    return(
        <div className="add-vacation mx-auto border w-50">
            <h1 className="text-center">Login</h1>
            <br/>
            <form action="#" className="text-center">
                {errorsObj.serverError && <p style={{color: 'red'}}>{errorsObj.serverError}</p>}

                <input className="form-control" placeholder="Username" required ref={usernameRef}/>
                {errorsObj.username && <p style={{color: 'red'}}>{errorsObj.username}</p>}

                <input type="password" className="form-control" placeholder="Password" required ref={passwordRef}/>
                {errorsObj.password && <p style={{color: 'red'}}>{errorsObj.password}</p>}
                <br/>
                <button className="btn btn-primary" type="submit" onClick={handleSubmit}>Login</button>
            </form>
        </div>
    );
}

export default Login;