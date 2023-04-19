export interface IVacation{
    id?:number;
    vacationDescription:string;
    location:string;
    image:string;
    startDate:string;
    endDate:string;
    price:number;
    followers?:number;
    isUserFollowing?:boolean;
}