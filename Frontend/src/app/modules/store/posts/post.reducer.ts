import { createReducer, on } from "@ngrx/store";
import { Post } from "../../../models/postModel";
import { fetchPostAPISuccess} from "./post.action";

export const initalState: Post[] = []

export const postReducer = createReducer(
    initalState,
    on(fetchPostAPISuccess, (_state, { allPosts }) => {
        return Object.values(allPosts[0])
    })
)