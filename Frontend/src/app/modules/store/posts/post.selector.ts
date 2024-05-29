import { Post } from '../../../models/postModel';
import { createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";



export const postSelectorState = createFeatureSelector<Post[]>('posts')


export const SelectorPostData = createSelector(
  postSelectorState,
    (state: Post[]) => {
        return state
    }
) 

export const selectUserPosts = createSelector(
  postSelectorState,
  (state: Post[]) => {
    // You can access the 'userId' prop from the outer scope
    const userId =localStorage.getItem('userId'); // Replace with the actual value or how you get it
    return state.filter(post => post.userId === userId);
  }
);

export const selectSavedPosts = createSelector(
  postSelectorState,
  (state: Post[]) => {
    // You can access the 'userId' prop from the outer scope
    const userId =localStorage.getItem('userId') || ''; // Replace with the actual value or how you get it
    return state.filter(post => post.saved.includes(userId))
  }
);

// export const selectPostLikesLengthAndUserLiked = createSelector(
//   SelectorPostData,
//   (_state: Post[], props: { userId: string }) => {
//     return _state.map(post => {
//       const likesLength = post.likes.length;
//       const userLiked = post.likes.includes(props.userId);
//       return { ...post, likesLength, userLiked };
//     });
//   }
// );