import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IUser } from "../../../models/userModel";


export const userSelectorState = createFeatureSelector<IUser[]>('users')


export const userSelectorData = createSelector(
    userSelectorState,
    (state: IUser[]) => {
        return state
    }
) 