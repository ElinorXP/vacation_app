import { useEffect, useState } from "react";
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
        //navigate("/login");
        console.log("NAV /login");
      }
      return undefined;
    }

    return user ? user : undefined;

    
    //   async function getUserDetails() {
    //     const user = await getAuthenticatedUser();
    //     setUser(user || undefined);
    //     if (!user) {
    //       if (!disableNavigate) {
    //         navigate("/login");
    //       }
    //       return userState;
    //     }
    //   }
    //   getUserDetails();
    // }, []);

    // return userState;
  }

  export function useAdminUser() {
    const user = useAuthUser();
    const navigate = useNavigate();

    if (!user?.isAdmin) {
      navigate("/");
    }

    return user;
  }

  export function storeTokenInLocalStorage(token: string, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId)
  }

  export function getTokenFromLocalStorage() {
    return localStorage.getItem('token') || null;
  }

  function removeTokenInLocalStorage() {
    console.log("removeTokenInLocalStorage");
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  function getUserIdFromLocalStorage() {
    return localStorage.getItem('userId');
  }
  
  async function getAuthenticatedUser() : Promise<IUser | null> {
    const token = getTokenFromLocalStorage();
    if (token === "")
      return null;

    try {
      const response = await api.get("/token");

      if (!response.data.id) {
        removeTokenInLocalStorage();
        return null;
      };

      return response.data;
    }
    catch (err) {
      console.log('Error in getAuthenticatedUser', err);
      removeTokenInLocalStorage();
      return null;
    }
  }
