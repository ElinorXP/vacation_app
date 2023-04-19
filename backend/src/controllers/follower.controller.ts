import {Request, Response} from 'express';
import {FollowerService} from '../services/follower.service';
import {Follower} from '../models/follower.model';
import { IFollower } from '../../../shared/IFollower';
import { GetUserFromRequest } from '../utils/user';

export class FollowerController{
    private followerService: FollowerService;

    constructor(){
        this.followerService = new FollowerService();
    }

    async createFollower(req: Request, res: Response){
        const user = await GetUserFromRequest(req);
        if (!user) {
            res.status(403).send();
            return;
        }

        try{
            const followerData:IFollower = req.body;
            followerData.userID = user.id!;
            const newFollower = await this.followerService.createFollower(followerData);
            res.status(200).send({"result": "success"});
        }catch(err){
            res.status(500).send(err.message);
        }
    }
    
    async deleteFollower(req: Request, res: Response){
        const user = await GetUserFromRequest(req);
        if (!user) {
            res.status(403).send();
            return;
        }

        try{
            const followerData:IFollower = req.body;
            followerData.userID = user.id!;
            const result : string = await this.followerService.deleteFollower(followerData) ? "success" : "failure";
            res.status(200).send({"result": result});
        }catch(err){
            res.status(500).send(err.message);
        }
    }
}