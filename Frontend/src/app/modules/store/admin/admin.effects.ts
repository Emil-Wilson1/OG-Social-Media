import { Injectable } from "@angular/core";
import { ofType, Actions, createEffect } from "@ngrx/effects";
import { AuthService } from "../../../services/auth.service";
import { fetchUserAPI, fetchUserAPISuccess} from "./admin.action";
import { map, switchMap, tap } from "rxjs";
import { Action } from "@ngrx/store";
import { AdminService } from "../../../admin/services/admin.service";


@Injectable()
export class adminUserEffects {
    constructor(private actions$: Actions<Action>, private adminService: AdminService) { }



    loadAllUsers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchUserAPI),
            switchMap(() => {
                return this.adminService.fetchAllUsers()
                    .pipe(
                        map((data) => fetchUserAPISuccess({ allUser: Object.values(data) }))
                    )
            })
        )
    )

}