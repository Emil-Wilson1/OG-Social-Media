import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { userEffects } from './modules/store/user.effects';
import { provideEffects } from '@ngrx/effects';
import { _userReducer } from './modules/store/user.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideStore(),
    provideEffects(userEffects),
    provideState({name:'user',reducer: _userReducer})
  ]
};
