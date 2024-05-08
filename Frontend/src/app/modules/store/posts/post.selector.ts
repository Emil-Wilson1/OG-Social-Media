import { Post } from './../../models/postModel';
import { createFeatureSelector, createSelector } from "@ngrx/store";


export const postSelectorState = createFeatureSelector<Post[]>('posts')


export const SelectorPostData = createSelector(
  postSelectorState,
    (state: Post[]) => {
        return state
    }
) 


export const selectPostLikesLengthAndUserLiked = createSelector(
  SelectorPostData,
  (_state: Post[], props: { userId: string }) => {
    return _state.map(post => {
      const likesLength = post.likes.length;
      const userLiked = post.likes.includes(props.userId);
      return { ...post, likesLength, userLiked };
    });
  }
);