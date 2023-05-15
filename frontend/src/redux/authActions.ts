import { createAsyncThunk } from "@reduxjs/toolkit"
import {api} from '../components/apiUrl';
import { IUserCredentials } from "../../../shared/IUser";
import { IRegisterErrors } from "../Interfaces/RegisterErrors";
import { AxiosError } from "axios";
import { storeTokenInLocalStorage } from "../utils/User";

export const userLogin = createAsyncThunk<any, IUserCredentials>(
  'auth/login',
  async (userCredentials: IUserCredentials, { rejectWithValue }) => {
    try {
        // configure header's Content-Type as JSON
        const response = await api.post('/login', userCredentials);
        if (response?.data?.error) {
            return rejectWithValue(response?.data?.error);
        }
        storeTokenInLocalStorage(response?.data?.token);

        return {token: response?.data?.token, user: response?.data?.user} as any;
    } catch (err) {
        if (err instanceof AxiosError && ((err.response?.status ?? 0) === 500)){
            const axiosErr = err as AxiosError;
            const _errors: IRegisterErrors = {hasErrors: false, serverError: axiosErr.response?.data as string || ""};
            return rejectWithValue(_errors);
        }
    }
  }
)