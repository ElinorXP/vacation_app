import {User} from '../models/user.model';
import {pool} from '../config/mysql';
import {IUser, IUserCredentials} from '../../../shared/IUser'

export class UserService{
  async getUsers(): Promise<User[]> {
    const tables = await pool.promise().query('SELECT * FROM users');
    return tables[0] as User[];
  }

  async getUserById(id: number): Promise<User | null> {
    const tables = await pool.promise().query('SELECT * FROM users WHERE id = ?', [id]);
    return tables[0][0] as User || null;
  }

  async getUserByUsername(userName: string): Promise<User | null> {
    const tables = await pool.promise().query('SELECT * FROM users WHERE userName = ?', [userName]);
    return tables[0][0] as User || null;
  }

  async validateToken(token: string): Promise<IUser | null> {
    const jwt = require("jsonwebtoken");
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const modelUser:User = await this.getUserByUsername(decoded.userName);
      if (modelUser === null) {
        throw Error("Invalid Credentials");
      }
      
      const user:IUser = {
        id: modelUser.id,
        firstName: modelUser.firstName,
        lastName: modelUser.lastName,
        isAdmin: modelUser.userName === "admin",
      }
      
      return user;
    }catch(err){
      return null;
    }
  }

  async createUser(user: IUser): Promise<IUser> {
    // // @ts-ignore
    const userModel: User = {
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userCredentials.userName,
      userPassword: user.userCredentials.password,
      isAdmin: false,
    }

    const isExists = await this.getUserByUsername(userModel.userName) !== null;
    if(isExists) {
      throw Error("Username already exists");
    }

    const result = await pool.promise().query('INSERT INTO users SET ?', [userModel]);
    
    return {
      ...user,
      id: result[0].insertId
    };
  }

  async loginUser(userCredentials: IUserCredentials): Promise<{token: string, userId?: number}> {
    // // @ts-ignore
    const jwt = require('jsonwebtoken');

    const modelUser:User = await this.getUserByUsername(userCredentials.userName);

    if (modelUser === null) {
      throw Error("Invalid Credentials");
    }

    if (modelUser.userPassword !== userCredentials.password) {
      throw Error("Invalid Credentials");
    }

    const token = jwt.sign({
        id: modelUser.id,
        userName:  modelUser.userName
      },
      process.env.JWT_SECRET,
      {expiresIn: process.env.JWT_EXPIRES_IN}
    );

    return {token, userId: modelUser.id};
  }

  async updateUser(id: number, user: User): Promise<User> {
    await pool.promise().query('UPDATE users SET ? WHERE id = ?', [user, id]);
    return {...user, id};
  }

  async deleteUser(id: number): Promise<void> {
    await pool.promise().query('DELETE FROM users WHERE id = ?', [id]);
  }
}