import React, {useState, useRef, useEffect} from 'react';
import {useLocation, useSearchParams} from 'react-router-dom';
import {AxiosError} from 'axios';
import { useNavigate } from "react-router-dom";

import {IVacation} from '../../../../shared/IVacation';
import { useAdminUser } from '../../utils/User';
import {api} from '../apiUrl';
import { IVacationErrors } from '../../Interfaces/IVacationErrors';
import ValidationError from '../../utils/ValidationError';

const AddVacation = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = parseInt(searchParams.get("id") || "");
    const [vacation, setVacation] = useState<IVacation>();

    const getVacation = async () => {
        const vacation = await api.get(`/vacations/${id}`);
        setVacation(vacation.data);
    }
    // NOT GOOD HERE: getVacation();
    // getVacation -> api.get -> setVacation (updating a state)
    // ==> reload component -> AddVacation -> getVacation -> ...

    useEffect(() => {
        if(id){
            getVacation();
        }
    }, []);

    const user = useAdminUser();

    const [errorsObj, setErrorsObj] = useState<IVacationErrors>({hasErrors:false});

    const locationRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLInputElement>(null);
    const startDateRef = useRef<HTMLInputElement>(null);
    const endDateRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);

    const [fileData, setFileData] = useState<string>("");

    const handleFileChange = async (event:React.ChangeEvent<HTMLInputElement>) => {
        // if(event.target.files && event.target.files.length > 0) {
        //     setFile(event.target.files[0]);
        // }

        /*
        const a = true ? 1 : 0
        mor?.prop
        */
        const file = event.target.files?.[0];
        const reader = new FileReader();
        reader.readAsDataURL(file as Blob);
        reader.onload = () => {
            setFileData(reader.result as string);
        }
    }

    const handleSubmit:React.MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();

        let defaultImageUrl = "";
        
        if(id){
            defaultImageUrl = vacation?.image as string;
        }

        const location = locationRef.current?.value || "";
        const vacationDescription = descriptionRef.current?.value || "";
        const image = fileData || defaultImageUrl;
        const startDate = startDateRef.current?.value || "";
        const endDate = endDateRef.current?.value || "";
        const price = Number(priceRef.current?.value) || 0;

        const validate = (location:string, description:string, image:string, startDate:string, endDate:string, price:number) => {
           let _errors:IVacationErrors = {hasErrors:false};
           if(location === ""){
            _errors.location = "Enter valid location";
            _errors.hasErrors = true;
           }
           if(vacationDescription === ""){
            _errors.description = "Enter valid description";
            _errors.hasErrors = true;
           }
           if(!id && fileData === ""){
            _errors.image = "Enter valid image";
            _errors.hasErrors = true;
           }
           if(startDate === ""){
            _errors.startDate = "Enter valid start date";
            _errors.hasErrors = true;
           }
           if(endDate === ""){
            _errors.endDate = "Enter valid end date";
            _errors.hasErrors = true;
           }
           if(!price){
            _errors.price = "Enter valid price";
            _errors.hasErrors = true;
           }

           if(_errors.hasErrors){
            throw new ValidationError(_errors);
           }
        }

        try{
            // Old validation
            // if(!location || !vacationDescription || !fileData || !startDate || !endDate || !price){
            //     return;
            // }

            validate(location, vacationDescription, fileData, startDate, endDate, price);

            const newVacation:IVacation = {
                id,
                location,
                vacationDescription,
                image,
                startDate,
                endDate,
                price
            }

            if(id &&
                vacation?.location === newVacation.location &&
                vacation.vacationDescription === newVacation.vacationDescription &&
                vacation.image === newVacation.image &&
                vacation.startDate.split("T")[0] === newVacation.startDate &&
                vacation.endDate.split("T")[0] === newVacation.endDate &&
                vacation.price === newVacation.price){
                console.log('no changes, data won\'t sent');

                console.log(' = = = = = V A C A T I O N = = = = = =');
                console.log(vacation);
                console.log(' = = = = = N E W - V A C A T I O N = = = = = =');
                console.log(newVacation);
                console.log(' = = = = = E N D = = = = =');
                navigate("/");
                return;
            }

            let response;

            if (id) {
                response = await api.put('/vacations/', newVacation);
            } else {
                response = await api.post('/vacations', newVacation);
            }

            if (response.data.result !== "success") {
                const _errors:IVacationErrors = {hasErrors:true, serverError: "Internal error"};
                setErrorsObj(_errors);
            } else {
                navigate("/");
            }
        }catch(err){
            if(err instanceof ValidationError){
                const validationError:ValidationError = err;
                setErrorsObj(validationError.getErrors() as IVacationErrors);
            }
            else if(err instanceof AxiosError){
                const axiosError:AxiosError = err;
                const _errors:IVacationErrors = {hasErrors:true, serverError: axiosError.response?.data as string};
                setErrorsObj(_errors);
            }else{
                console.log(err);
            }
        }

    }

    return(
        <div className="add-vacation container mx-auto border col-lg-6 col-md-12 col-sm-12">
            <h1 className="text-center">{id ? 'Edit Vacation' : 'Add Vacation'}</h1>
            <br/>
            <form action="#" className="text-center">
                {errorsObj.serverError && <p style={{color:'red'}}>{errorsObj.serverError}</p>}

                <input className="form-control" placeholder="Location" defaultValue={id ? vacation?.location : ""} ref={locationRef}/>
                {errorsObj.location && <p style={{color:'red'}}>{errorsObj.location}</p>}

                <input className="form-control" placeholder="Description" defaultValue={id ? vacation?.vacationDescription : ""} ref={descriptionRef}/>
                {errorsObj.description && <p style={{color:'red'}}>{errorsObj.description}</p>}
                
                <label>Upload Image</label>
                <div className='d-flex flex-column flex-md-row gap-2 align-items-center'>
                    <input type="file" className="form-control" ref={imageRef} onChange={handleFileChange}/>
                    {id ? <img src={vacation?.image} width={200}/> : ""}
                </div>
                {errorsObj.image && <p style={{color:'red'}}>{errorsObj.image}</p>}

                {/* ERROR to FIX: When updating existing date, it takes one day BEFORE the changed date! ai.com show the reasons*/}
                <label>Start Date</label><input type="date" className="form-control" defaultValue={id ? vacation?.startDate.split("T")[0] : ""} ref={startDateRef}/>
                {errorsObj.startDate && <p style={{color:'red'}}>{errorsObj.startDate}</p>}

                <label>End Date</label><input type="date" className="form-control" defaultValue={id ? vacation?.endDate.split("T")[0] : ""} ref={endDateRef}/>
                {errorsObj.endDate && <p style={{color:'red'}}>{errorsObj.endDate}</p>}

                <input type="number" className="form-control" placeholder="Price" defaultValue={id ? vacation?.price : ""} ref={priceRef}/>
                {errorsObj.price && <p style={{color:'red'}}>{errorsObj.price}</p>}
                <br/>
                <button className="btn btn-primary" type="submit" onClick={handleSubmit}>{id ? 'Save Changes' : 'Add a New Vacation'}</button>
            </form>
        </div>
    );
}

export default AddVacation;