import {Router as ExpressRouter} from 'express';
import {UserController} from '../controllers/user.controller';
import {VacationController} from '../controllers/vacation.controller';
import { FollowerController } from '../controllers/follower.controller';

import {User} from '../models/user.model';

export class Router{
  static getRouter(): ExpressRouter{ // static - משהו ששייך לכל מופע שנוצר מהקלאס
    const router = ExpressRouter();
    const userController = new UserController();
    const vacationController = new VacationController();
    const followerController = new FollowerController();
    
    // Users
    router.get('/users', userController.getUsers.bind(userController));
    router.get('/users/:id', userController.getUserById.bind(userController));
    router.get('/token', userController.validateToken.bind(userController));
    router.post('/users', userController.createUser.bind(userController));
    router.post('/login', userController.loginUser.bind(userController));
    router.put('/users/:id', userController.updateUser.bind(userController));
    router.delete('/users/:id', userController.deleteUser.bind(userController));

    // Vacation
    router.get('/vacations', vacationController.getVacations.bind(vacationController));
    router.get('/vacations/:id', vacationController.getVacationById.bind(vacationController));
    router.post('/vacations', vacationController.createVacation.bind(vacationController));
    router.put('/vacations', vacationController.updateVacation.bind(vacationController));
    router.delete('/vacations/:id', vacationController.deleteVacation.bind(vacationController));

    // Followers
    router.post('/follow', followerController.createFollower.bind(followerController));
    router.post('/unfollow', followerController.deleteFollower.bind(followerController));

    return router;
  }
}