import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as CommentActions from './comments.actions';
import  {Comment } from '../../../models/commentModel'; // Import your comment service
import { CommentService } from '../../../services/comment.service';

@Injectable()
export class CommentEffects {
  constructor(
    private actions$: Actions,
    private commentService: CommentService
  ) {}

  loadCommentById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentActions.loadCommentById),
      mergeMap((action) =>
        this.commentService. fetchCommentsById(action.id).pipe(
          map((comment) => CommentActions.loadCommentByIdSuccess({ comment })),
          catchError((error) =>
            of(CommentActions.loadCommentByIdFailure({ error }))
          )
        )
      )
    )
  );
}