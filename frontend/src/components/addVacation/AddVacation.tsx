import React, {useState, useRef} from 'react';
import {AxiosError} from 'axios';
import {IVacation} from '../../../../shared/IVacation';
import { useAdminUser } from '../../utils/User';
import {api} from '../apiUrl';
import { IVacationErrors } from '../../Interfaces/IVacationErrors';
import ValidationError from '../../utils/ValidationError';

const AddVacation = () => {
    const [errorsObj, setErrorsObj] = useState<IVacationErrors>({hasErrors:false});

    const user = useAdminUser();

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

        const location = locationRef.current?.value || "";
        const vacationDescription = descriptionRef.current?.value || "";
        const image = fileData || "";
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
           if(fileData === ""){
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
                location,
                vacationDescription,
                image,
                startDate,
                endDate,
                price
            }
            const response = await api.post('/vacations', newVacation);
            console.log(response);
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
        <div className="add-vacation mx-auto border w-50">
            <h1 className="text-center">Add Vacation</h1>
            <br/>
            <form action="#" className="text-center">
                {errorsObj.serverError && <p style={{color:'red'}}>{errorsObj.serverError}</p>}
            
                <input className="form-control" placeholder="Location" ref={locationRef}/>
                {errorsObj.location && <p style={{color:'red'}}>{errorsObj.location}</p>}

                <input className="form-control" placeholder="Description..." ref={descriptionRef}/>
                {errorsObj.description && <p style={{color:'red'}}>{errorsObj.description}</p>}

                <label>Image</label><input type="file" className="form-control" ref={imageRef} onChange={handleFileChange}/>
                {errorsObj.image && <p style={{color:'red'}}>{errorsObj.image}</p>}

                <label>Start Date</label><input type="date" className="form-control" ref={startDateRef}/>
                {errorsObj.startDate && <p style={{color:'red'}}>{errorsObj.startDate}</p>}

                <label>End Date</label><input type="date" className="form-control" ref={endDateRef}/>
                {errorsObj.endDate && <p style={{color:'red'}}>{errorsObj.endDate}</p>}

                <input type="number" className="form-control" placeholder="Price" ref={priceRef}/>
                {errorsObj.price && <p style={{color:'red'}}>{errorsObj.price}</p>}
                <br/>
                <button className="btn btn-primary" type="submit" onClick={handleSubmit}>Add a Vacation</button>
            </form>
        </div>
    );
}

export default AddVacation;