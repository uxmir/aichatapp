import { AxiosError } from "axios"
export const getErrorMessage=(error:unknown):string=>{
    if(error instanceof AxiosError){
        return error?.response?.data?.message || error?.message
    }
    return error instanceof Error?error?.message:"something went"
}