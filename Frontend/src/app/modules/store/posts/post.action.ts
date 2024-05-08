import { createAction, props } from "@ngrx/store";
import { Post } from "../../models/postModel";


export const fetchPostAPI = createAction(
    "[User API] Fetch Post API"
)

export const fetchPostAPISuccess = createAction(
    "[User API] Fetch Post API Success",
    props<{ allPosts: Post[] }>()
)
