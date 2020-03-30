import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import * as fromRoot from '../app.reducer';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store<fromRoot.State>) {}

  canActivate() {
    return this.store.select(fromRoot.getIsAuthenticated).pipe(take(1));
  }
}
