import { createAction, props } from "@ngrx/store";
import { IUser } from "../../../models/userModel";


export const fetchUsersAPI = createAction(
    "[User API] Fetch User API"
)

export const fetchUserAPISuccess = createAction(
    "[User API] Fetch User API Success",
    props<{ allUser: IUser[] }>()
)
