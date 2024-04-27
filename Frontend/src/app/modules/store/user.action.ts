import { createAction, props } from "@ngrx/store";
import { IUser } from "../models/userModel";



export const fetchUserAPI = createAction(
    '[Profile API] User Profile API'

)
export const fetchUserAPISuccess = createAction(
    '[Profile API] User Profile API Success',
    props<{ user: IUser[] }>()
)

