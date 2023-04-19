import react from 'react';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getTokenFromLocalStorage } from './User';

class VacationAPI {
    api : AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: 'http://localhost:4000/api'
        });
    }
    async get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>) {
        const newHeaders = {...config?.headers, Authorization: `Bearer ${getTokenFromLocalStorage()}`}
        const newConfig = {...config, headers: newHeaders};
        console.log(`GET ${url}`);
        const response = await this.api.get(url, newConfig);
        console.log("   -->", response.data);
        
        return response;
    }

    async post<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
        const newHeaders = {...config?.headers, Authorization: `Bearer ${getTokenFromLocalStorage()}`}
        const newConfig = {...config, headers: newHeaders};
        console.log(`POST ${url}`);
        console.log("   <--", data);
        const response = await this.api.post(url, data, newConfig);
        console.log("   -->", response.data);

        return response;
    }
}

export default VacationAPI;