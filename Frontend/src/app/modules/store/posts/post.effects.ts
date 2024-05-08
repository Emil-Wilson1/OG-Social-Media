import { Injectable } from "@angular/core";
import { ofType, Actions, createEffect } from "@ngrx/effects";
import { AuthService } from "../../../services/auth.service";
import { fetchPostAPI, fetchPostAPISuccess} from "./post.action";
import { map, switchMap, tap } from "rxjs";
import { Action } from "@ngrx/store";
import { PostService } from "../../../services/post.service";


@Injectable()
export class postEffects {
  
    constructor(private actions$: Actions<Action>, private userService: PostService) { }

    loadAllPosts$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchPostAPI),
            switchMap(() => {
                return this.userService.fetchAllPosts()
                    .pipe(
                        map((data) => fetchPostAPISuccess({ allPosts: Object.values(data) }))
                    )
            })
        )
    )

}