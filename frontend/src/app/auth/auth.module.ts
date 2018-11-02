import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core';


// services
import { AuthService } from './auth.service';

// components
import { SignInComponent } from './sign-in/sign-in.component';

@NgModule({
  declarations: [
    SignInComponent,
  ],
  providers: [
    AuthService
  ],
  imports: [
    CommonModule,
    CoreModule
  ],
})
export class AuthModule { }
