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

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideStore(),
    provideEffects(userEffects),
    provideEffects(adminUserEffects),
    provideState({name:'user',reducer: _userReducer}),
    provideState({name:'users',reducer: userReducer})
  ]
};
