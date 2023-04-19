import {Follower} from '../models/follower.model';
import {pool} from '../config/mysql';

import {IFollower} from '../../../shared/IFollower';

export class FollowerService{
    async createFollower(follower: IFollower): Promise<IFollower>{
        const results = await pool.promise().query(`INSERT INTO followers SET ?`, [follower]);
        return {...follower, id: results[0].insertId};
    }

    async deleteFollower(follower: IFollower): Promise<boolean>{
        const results = await pool.promise().query(`DELETE FROM followers WHERE userID=? AND vacationID=?`, [follower.userID, follower.vacationID]);
        return results[0].affectedRows === 1;
    }
}