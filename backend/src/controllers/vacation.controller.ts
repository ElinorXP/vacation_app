import {Request, Response} from 'express';
import {VacationService} from '../services/vacation.service';
import {Vacation} from '../models/vacation.model';
import { GetUserFromRequest } from '../utils/user';
import { IVacation } from '../../../shared/IVacation';

export class VacationController{
    private vacationService: VacationService;

    constructor(){
        this.vacationService = new VacationService();
    }

    async getVacations(req: Request, res: Response){
        const user = await GetUserFromRequest(req);
        if (!user) {
            res.status(403).send();
            return;
        }

        try{
            const page = parseInt(req.query.page as string);
            const followedMode: boolean = (req.query.followedMode as string) === "true";
            const vacations = await this.vacationService.getVacations(user, followedMode, page);
            res.status(200).send(vacations);
        }catch(err){
            res.status(500).send(err.message);
        }
    }

    async getVacationById(req: Request, res: Response){
        try{
            const id = parseInt(req.params.id);
            const vacation = await this.vacationService.getVacationById(id);
            if(vacation){
                res.status(200).send(vacation);
            }else{
                res.status(404).send('Vacation Not Found'); 
            }
        }catch(err){
            res.status(500).send(err.message);
        }
    }

    async getAllVacations(req: Request, res: Response){
        try{
            const vacations = await this.vacationService.getAllVacations();
            res.status(200).send(vacations);
        }catch(err){
            res.status(500).send(err.message);
        }
    }

    async createVacation(req: Request, res: Response){
        try{
            const vacationData:Vacation = req.body;
            const result : string = await this.vacationService.createVacation(vacationData) ? "success" : "failure";
            res.status(200).send({"result": result});
        }catch(err){
            res.status(500).send(err.message);
        }
    }

    async updateVacation(req:Request, res:Response){
        try{
            const vacationData:IVacation = req.body;
            const result : string = await this.vacationService.updateVacation(vacationData) ? "success" : "failure";
            res.status(200).send({"result": result});
        }catch(err){
            res.status(500).send(err.message);
        }
    }

    async deleteVacation(req:Request, res:Response){
        try{
            const id = parseInt(req.params.id);
            const result : string = await this.vacationService.deleteVacation(id) ? "success" : "failure";
            res.status(200).send({"result": result});
        }catch(err){
            res.status(500).send(err.message);
        }
    }
}