
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { userEffects } from './modules/store/user/user.effects';
import { provideEffects } from '@ngrx/effects';
import { _userReducer } from './modules/store/user/user.reducer';
import { adminUserEffects } from './modules/store/admin/admin.effects';
import { userReducer } from './modules/store/admin/admin.reducer';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { postReducer } from './modules/store/posts/post.reducer';
import { postEffects } from './modules/store/posts/post.effects';




export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideStore(),
    provideEffects(userEffects),
    provideEffects(adminUserEffects),
    provideEffects(postEffects),
    provideState({name:'user',reducer: _userReducer}),
    provideState({name:'users',reducer: userReducer}),
    provideState({name:'posts',reducer: postReducer}),
    provideAnimationsAsync()
  ]
};
