import {Request, Response} from 'express';
import {User} from '../models/user.model';
import {UserService} from '../services/user.service';
import {IUser, IUserCredentials} from '../../../shared/IUser'
import { GetUserFromRequest } from '../utils/user';

export class UserController{
  private userService:UserService;

  constructor(){
    this.userService = new UserService();
  }

  async getUsers(req: Request, res: Response){
    try{
      const users = await this.userService.getUsers();
      res.status(200).send(users);
    }catch(err){
      res.status(500).send(err.message);
    }
  }

  async getUserById(req: Request, res: Response){
    try{
      const id = parseInt(req.params.id);
      const user = await this.userService.getUserById(id);
      if(user){
        res.status(200).send(user);
      }else{
        res.status(404).send('User Not Found');
      }
    }catch(err){
      res.status(500).send(err.message);
    }
  }

  async validateToken(req: Request, res: Response){
    try{
      const user = await GetUserFromRequest(req);
      res.status(200).send(user);
    }catch(err){
      res.status(500).send(err.message);
    }
  }

  async createUser(req: Request, res: Response){
    try{
      const userData: IUser = req.body;
      const newUser = await this.userService.createUser(userData);
      res.status(201).send(newUser);
    }catch(err){
      res.status(500).send(err.message);
    }
  }

  async loginUser(req: Request, res: Response){
    try{
      const userCredentials:IUserCredentials = req.body;
      const {token, userId} = await this.userService.loginUser(userCredentials);
      res.status(201).send({token, userId});
    }catch(err){
      res.status(500).send({error: err.message});
    }
  }

  async updateUser(req: Request, res: Response){
    try{
      const id = parseInt(req.params.id);
      const userData: User = req.body;
      const updatedUser = await this.userService.updateUser(id, userData);
      res.status(200).send(updatedUser);
    }catch(err){
      res.status(500).send(err.message);
    }
  }

  async deleteUser(req: Request, res: Response){
    try{
      const id = parseInt(req.params.id);
      await this.userService.deleteUser(id);
      res.status(204).send();
    }catch(err){
      res.status(500).send(err.message);
    }
  }
}