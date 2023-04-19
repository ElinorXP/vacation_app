export default class ValidationError extends Error {
    _errorsObj: object;
    _message: string;

    constructor(errors: object){
        const m = "found some errors, data won't send";
        super(m);
        this._errorsObj = errors;
        this._message = m;
    }

    getErrors(){
        return this._errorsObj;
    }

    getMessage(){
        return this._message;
    }
}