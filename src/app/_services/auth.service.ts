import { AuthData } from '../_models/auth-data.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { ExerciseService } from './exercise.service';
import { UIService } from '../_shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as UI from '../_shared/ui.actions';
import * as Auth from '../_services/auth.actions';

@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private exerciseService: ExerciseService,
    private uiService: UIService,
    private store: Store<{ ui: fromRoot.State }>
  ) {}

  registerUser(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        this.store.dispatch(new UI.StopLoading());
        this.authMethod(true, '/training');
      })
      .catch(error => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  login(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        this.store.dispatch(new UI.StopLoading());
        this.authMethod(true, '/training');
      })
      .catch(error => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  logout() {
    this.authMethod(false, '/login');
    this.exerciseService.cancelSubscriptions();
  }

  authMethod(authStatus, route) {
    authStatus === true
      ? this.store.dispatch(new Auth.SetAuthenticated())
      : this.store.dispatch(new Auth.SetUnauthenticated());
    this.router.navigate([route]);
  }
}
