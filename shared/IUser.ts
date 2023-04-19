export interface IUserCredentials{
    userName: string;
    password: string;
}

export interface IUser{
    id?: number;
    firstName: string;
    lastName: string;
    userCredentials?: IUserCredentials;
    isAdmin: boolean;
}