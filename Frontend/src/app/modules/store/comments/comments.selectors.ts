import { createFeatureSelector, createSelector } from '@ngrx/store';
import  {Comment } from '../../../models/commentModel';

export interface CommentState {
  comment: Comment | null;
  error: any;
}

export const selectCommentState = createFeatureSelector<CommentState>('comment');

export const selectComment = createSelector(
  selectCommentState,
  (state: CommentState) => state.comment
);

export const selectError = createSelector(
  selectCommentState,
  (state: CommentState) => state.error
);