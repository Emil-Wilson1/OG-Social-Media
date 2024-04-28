import { createReducer, on } from "@ngrx/store";
import { IUser } from "../../models/userModel";
import { fetchUserAPISuccess} from "./admin.action";

export const initalState: IUser[] = []

export const userReducer = createReducer(
    initalState,
    on(fetchUserAPISuccess, (_state, { allUser }) => {
        return Object.values(allUser[0])
    })
)