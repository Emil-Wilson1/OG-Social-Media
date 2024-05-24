import { createAction, props } from '@ngrx/store';
import { Comment } from '../../../models/commentModel'; // Import your Comment model

export const loadCommentById = createAction(
  '[Comment] Load Comment By Id',
  props<{ id: string }>()
);

export const loadCommentByIdSuccess = createAction(
  '[Comment] Load Comment By Id Success',
  props<{ comment: Comment }>()
);

export const loadCommentByIdFailure = createAction(
  '[Comment] Load Comment By Id Failure',
  props<{ error: any }>()
);