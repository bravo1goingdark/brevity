import { atom } from "recoil";
import { PostSlang } from "../../../@types/slang";

export const searchAtom = atom({
    key : "searchAtom",
    default : [""]
})

export const postAtom = atom<PostSlang>({
    key : "postAtom",
    default : {
        term : "idc",
        definition : "i don't care",
        context : "some context",
        origin : "Internet Slang"
    }
})