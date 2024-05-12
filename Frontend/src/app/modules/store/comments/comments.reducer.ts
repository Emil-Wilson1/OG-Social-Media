import { createReducer, on } from '@ngrx/store';
import * as CommentActions from './comments.actions';
import  {Comment } from './../../models/commentModel';
export interface CommentState {
  comment: Comment | null;
  error: any;
}

export const initialState: CommentState = {
  comment: null,
  error: null,
};

export const commentReducer = createReducer(
  initialState,
  on(CommentActions.loadCommentByIdSuccess, (state, { comment }) => ({
    ...state,
    comment,
    error: null,
  })),
  on(CommentActions.loadCommentByIdFailure, (state, { error }) => ({
    ...state,
    comment: null,
    error,
  }))
);