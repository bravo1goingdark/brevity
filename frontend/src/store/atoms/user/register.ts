import { atom } from "recoil";
import { LoginUser, RegisterUser } from "../../../@types/register";



export const registerAtom = atom<RegisterUser>({
    key : "registerAtom",
    default : {
        username : "bravo1goingdark",
        email : "bravo1goingdark@gmail.com",
        password : "password"
    }
})
export const loginAtom = atom<LoginUser>({
    key : "loginAtom",
    default : {
        identifier : "bravo1goingdark",
        password : "password"
    }
})

