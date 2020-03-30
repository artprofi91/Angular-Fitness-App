import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { SharedModule } from '../../_shared/shared.module';

import { SignupComponent } from '../auth/signup/signup.component';
import { LoginComponent } from '../auth/login/login.component';

@NgModule({
  declarations: [SignupComponent, LoginComponent],
  imports: [ReactiveFormsModule, AngularFireAuthModule, SharedModule],
  exports: []
})
export class AuthModule {}
