import {Request} from 'express';
import {UserService} from '../services/user.service';
import { IUser } from '../../../shared/IUser';

export async function GetUserFromRequest(req: Request) : Promise<IUser | null> {
    const token = String(req?.headers?.authorization?.replace('Bearer ', ''));
    return await new UserService().validateToken(token);
}