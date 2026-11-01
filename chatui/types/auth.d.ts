export interface Auth{
    id:string,
    name:string,
    email:string,
    role:string,
    accessToken:string,
    refreshToken?:string
}