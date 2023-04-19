import React, {useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import {api} from '../apiUrl';
import {IUser, IUserCredentials} from '../../../../shared/IUser';
import {IRegisterErrors} from '../../Interfaces/RegisterErrors';
import ValidationError from '../../utils/ValidationError';
import {AxiosError} from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [errorsObj, setErrorsObj] = useState<IRegisterErrors>({hasErrors: false});

    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const userameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const validate = (firstName:string, lastName:string, username:string, password:string) => {
        let _errors:IRegisterErrors = {hasErrors: false};

        if(firstName === ""){
            _errors.firstName = 'Enter valid first name';
            _errors.hasErrors = true;
        }
        if(lastName === ""){
            _errors.lastName = 'Enter valid last name';
            _errors.hasErrors = true;
        }
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

    const handleSubmit:React.MouseEventHandler<HTMLButtonElement> = async (event) => {
        event.preventDefault();
        const firstName = firstNameRef.current?.value || "";
        const lastName = lastNameRef.current?.value || "";
        const userName = userameRef.current?.value || "";
        const password = passwordRef.current?.value || "";

        console.log(
            {
                firstName:firstName,
                lastName:lastName,
                userName:userName,
                password:password
            }
        );

        try{
            validate(firstName, lastName, userName, password);
            const userCredentials:IUserCredentials = {
                userName,
                password,
            };
            const user:IUser = {
                firstName,
                lastName,
                userCredentials,
                isAdmin: false,
            };
            const response = await api.post('/users', user);
            console.log(response.data);
            navigate("/login");
        }catch(err){
            if(err instanceof ValidationError){
                const validationError:ValidationError = err;
                setErrorsObj(validationError.getErrors() as IRegisterErrors);
            }else if(err instanceof AxiosError && ((err.response?.status ?? 0) === 500)){
                /*
                ((err.response?.status ?? 0) === 500)
                SAME AS
                ((err.response?.status !== undefined && err.response?.status) || 0) === 500
                */
                const axiosErr = err as AxiosError;
                const _errors: IRegisterErrors = {hasErrors: false, serverError: axiosErr.response?.data as string || ""};
                setErrorsObj(_errors);
            }else{
                console.log(err);
            }
        }
    }

    return(
        <div className="register mx-auto border w-50">
            <h1 className="text-center">Register</h1>
            <br/>
            <form action="#" className="text-center">
                {errorsObj.serverError && <p style={{color: 'red'}}>{errorsObj.serverError}</p>}

                <input className="form-control" placeholder="First Name" ref={firstNameRef}/>
                {errorsObj.firstName && <p style={{color: 'red'}}>{errorsObj.firstName}</p>}

                <input className="form-control" placeholder="Last Name" ref={lastNameRef}/>
                {errorsObj.lastName && <p style={{color: 'red'}}>{errorsObj.lastName}</p>}

                <input className="form-control" placeholder="Username" ref={userameRef}/>
                {errorsObj.username && <p style={{color: 'red'}}>{errorsObj.username}</p>}

                <input className="form-control" type="password" placeholder="Password" ref={passwordRef}/>
                {errorsObj.password && <p style={{color: 'red'}}>{errorsObj.password}</p>}
                <br/>
                <button className="btn btn-primary" type="submit" onClick={handleSubmit}>Sign Up</button>
            </form>
        </div>
    );
}

export default Register;