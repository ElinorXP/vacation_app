import {Vacation} from '../models/vacation.model';
import {pool} from '../config/mysql';

import {IVacationsData} from '../../../shared/IVacationsData';
import { IVacation } from '../../../shared/IVacation';
import { IUser } from '../../../shared/IUser';

const ITEMS_PER_PAGE: number = 3;

export class VacationService{
    async getVacations(user : IUser, page: number = 0): Promise<IVacationsData>{ // מחזיר מערך של אובייקטים בצורת וקאיישן
        const results = await pool.promise().query(`SELECT *, (SELECT (true) FROM followers WHERE vacationID=vacations.id AND userID=${user.id!}) as 'isUserFollowing', (SELECT COUNT(*) FROM followers WHERE vacationID=vacations.id) as 'followers' FROM vacations ORDER BY startDate DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${page * ITEMS_PER_PAGE}`);
        const vacations = results[0] as IVacation[]; // מחזיר מערך של אובייקטים בצורת ווקאיישן כי זה מה שביקשנו שהפרומיס יחזיר

        const countResult = await pool.promise().query("SELECT count(*) as 'totalCount' FROM vacations");
        const totalCount = countResult[0][0].totalCount as number;
        return { vacations, totalCount };
    }

    async getVacationById(id: number): Promise<Vacation | null>{ // לא כל משתמש ימצא ולכן האופציה נאל הכרחית
        const results = await pool.promise().query(`SELECT * FROM vacations WHERE id = ?`, [id]);
        return results[0][0] as Vacation | null;
    }
    
    async createVacation(vacation: Vacation): Promise<Vacation>{
        const results = await pool.promise().query(`INSERT INTO vacations SET ?`, [vacation]);
        return {...vacation, id: results[0].insertId}; // insertId - פרופרטי של מה שהחזירה השאילתה פול.קוורי והוא מחזיר את האיידי  שמייסיקוול נתן לשורה האחרונה בטבלה חופשות, כלומר הפריימרי קי
    }
    
    async updateVacation(id: number, vacation: Vacation): Promise<Vacation>{ // לעדכן לפי איידי ולהחזיר אובייקט חדש ומעודכן בצורת וקאיישן
        await pool.promise().query(`UPDATE vacations SET ? WHERE id = ?`, [vacation, id]);
        return {...vacation, id};
    }
    
    async deleteVacation(id: number): Promise<void>{ // פה רק מוחקים לפי איידי ואז לא מחזירים כלום
        await pool.promise().query(`DELETE FROM vacations WHERE id = ?`, [id]);
    }
}