import { Injectable } from "@angular/core";
import { ofType, Actions, createEffect } from "@ngrx/effects";
import { AuthService } from "../../services/auth.service";
import { map, switchMap, tap } from "rxjs";
import { Action } from "@ngrx/store";
import { fetchUserAPI, fetchUserAPISuccess } from "./user.action";


@Injectable()
export class userEffects {
    constructor(private actions$: Actions<Action>, private userService: AuthService) { }

    userId: string = localStorage.getItem('userId') || ''


    loadUserProfile$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchUserAPI),
            switchMap(() => {
                return this.userService.fetchUserById(this.userId)
                    .pipe(
                        map((data) => fetchUserAPISuccess({ user: data }))
                    )
            })
        )
    )

}


