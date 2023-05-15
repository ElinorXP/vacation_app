import {Vacation} from '../models/vacation.model';
import {pool} from '../config/mysql';

import {IVacationsData} from '../../../shared/IVacationsData';
import { IVacation } from '../../../shared/IVacation';
import { IUser } from '../../../shared/IUser';

const ITEMS_PER_PAGE: number = 4;

export class VacationService{
    async getVacations(user : IUser, followedMode: boolean, page: number = 0): Promise<IVacationsData>{
        let whereClause: string = "";
        if (followedMode) {
            whereClause = `WHERE EXISTS (SELECT 1 FROM followers WHERE vacationID=vacations.id AND userID=${user.id!})`;
        }

        const results = await pool.promise().query(`SELECT *, 
            (SELECT (true) FROM followers WHERE vacationID=vacations.id AND userID=${user.id!}) as 'isUserFollowing', 
            (SELECT COUNT(*) FROM followers WHERE vacationID=vacations.id) as 'followers' 
            FROM vacations ${whereClause} 
            ORDER BY startDate DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${page * ITEMS_PER_PAGE}`);

        const vacations = results[0] as IVacation[];

        const countResult = await pool.promise().query(`SELECT count(*) as 'totalCount' FROM vacations ${whereClause}`);
        const totalCount = countResult[0][0].totalCount as number;

        return { vacations, totalCount };
    }

    async getAllVacations(): Promise<IVacationsData>{
        let whereClause: string = "";

        const results = await pool.promise().query(`SELECT *,
            (SELECT COUNT(*) FROM followers WHERE vacationID=vacations.id) as 'followers' FROM vacations ${whereClause}`);

        const vacations = results[0] as IVacation[];

        const countResult = await pool.promise().query(`SELECT count(*) as 'totalCount' FROM vacations ${whereClause}`);
        const totalCount = countResult[0][0].totalCount as number;

        return { vacations, totalCount };
    }

    async getVacationById(id: number): Promise<Vacation | null>{
        const results = await pool.promise().query(`SELECT * FROM vacations WHERE id = ?`, [id]);
        return results[0][0] as Vacation | null;
    }
    
    async createVacation(vacation: Vacation): Promise<boolean>{
        const results = await pool.promise().query(`INSERT INTO vacations SET ?`, [vacation]);
        return results[0].affectedRows === 1;
    }
    
    async updateVacation(vacation: IVacation): Promise<boolean>{
        const results = await pool.promise().query(`UPDATE vacations SET ? WHERE id = ?`, [vacation, vacation.id!]);
        return results[0].affectedRows === 1;
    }
    
    async deleteVacation(id: number): Promise<boolean>{
        await pool.promise().query(`DELETE FROM followers WHERE vacationID = ?`, [id]);
        const results = await pool.promise().query(`DELETE FROM vacations WHERE id = ?`, [id]);
        return results[0].affectedRows === 1;
    }
}