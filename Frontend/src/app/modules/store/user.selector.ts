import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IUser } from "../models/userModel";


export const userSelectorState = createFeatureSelector<IUser[]>('user')

export const SelectorData = createSelector(
    userSelectorState,
    (user:IUser[]) => user
)
