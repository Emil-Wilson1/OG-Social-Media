import { createReducer, on } from "@ngrx/store";
import { fetchUserAPISuccess } from "./user.action";
import { IUser } from "../../../models/userModel";



export const initial: IUser[] = []

export const _userReducer = createReducer(
    initial,
    on(fetchUserAPISuccess, (_state, { user }) => {
        return [...Object.values(user)]
    })
)




