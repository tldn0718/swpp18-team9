import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core';


// services
import { AuthService } from './auth.service';

// components
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
  ],
  providers: [
    AuthService
  ],
  imports: [
    CommonModule,
    CoreModule
  ],
  entryComponents: [
    SignUpComponent
  ]
})
export class AuthModule { }
