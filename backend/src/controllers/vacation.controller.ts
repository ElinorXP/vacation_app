import {Request, Response} from 'express';
import {VacationService} from '../services/vacation.service';
import {Vacation} from '../models/vacation.model';
import { GetUserFromRequest } from '../utils/user';

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
            const vacations = await this.vacationService.getVacations(user, page);
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

    async createVacation(req: Request, res: Response){
        try{
            const vacationData:Vacation = req.body;
            const newVacation = await this.vacationService.createVacation(vacationData);
            res.status(200).send(newVacation);
        }catch(err){
            res.status(500).send(err.message);
        }
    }

    async updateVacation(req:Request, res:Response){
        try{
            const id = parseInt(req.body);
            const vacationData:Vacation = req.body;
            const updatedVacation = await this.vacationService.updateVacation(id, vacationData);
            res.status(200).send(updatedVacation);
        }catch(err){
            res.status(500).send(err.message);
        }
    }

    async deleteVacation(req:Request, res:Response){
        try{
            const id = parseInt(req.params.id);
            await this.vacationService.deleteVacation(id);
            res.status(200).send();
        }catch(err){
            res.status(500).send(err.message);
        }
    }
}