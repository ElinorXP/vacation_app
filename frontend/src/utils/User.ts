import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { IUser } from "../../../shared/IUser";
import {api} from '../components/apiUrl';

  export function useAuthUser(disableNavigate:boolean = false) : IUser | undefined {
    const [userState, setUser] = useState<IUser | undefined>(undefined);
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user)
        
    if (!user) {
      if (!disableNavigate) {
        navigate("/login");
      }
      return undefined;
    }

    return user ? user : undefined;

  }

  export function storeTokenInLocalStorage(token: string) {
    localStorage.setItem('token', token);
  }

  export function getTokenFromLocalStorage() {
    return localStorage.getItem('token') || null;
  }

  export function removeTokenInLocalStorage() {
    localStorage.removeItem('token');
  }

