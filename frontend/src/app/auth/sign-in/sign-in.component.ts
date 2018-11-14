import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../auth.service';
import { SignUpComponent } from '../sign-up';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  username: string;
  password: string;
  errorMessage: string;

  constructor(
    private auth: AuthService, 
    private modal: NgbModal, 
    private router: Router
  ) { }

  ngOnInit() {
    if(sessionStorage.getItem('login_status') == 'logged_in') this.router.navigate(['/main']);
  }

  get loginDisabled() {
    const usernameDisabled = !this.username || this.username.trim() === '';
    const passwordDisabled = !this.password || this.password.trim() === '';
    return usernameDisabled || passwordDisabled;
  }

  signIn() {
    this.auth.signIn(this.username, this.password).subscribe(
        () => {
          this.router.navigate(['/main']);
        },
        (err) => {
          if(err.status == 401) {
            this.errorMessage = 'Incorrect Sign In Information';
            setTimeout(()=>{this.errorMessage = null},5000);
          }
        }
      );
  }

  signUp() {
    // show sign up modal
    const modalConfig: any = {
      centered: true,
      size: 'lg',
      backdrop: "static"
    };
    const signUpModal = this.modal.open(SignUpComponent, modalConfig);
  }

}
