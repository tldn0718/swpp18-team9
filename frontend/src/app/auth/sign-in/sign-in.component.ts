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

  email: string;
  password: string;
  errorMessage: string;

  constructor(
    private auth: AuthService, 
    private modal: NgbModal, 
    private router: Router
  ) { }

  ngOnInit() {
  }

  get loginDisabled() {
    const emailDisabled = !this.email || this.email.trim() === '';
    const passwordDisabled = !this.password || this.password.trim() === '';
    return emailDisabled || passwordDisabled;
  }

  signIn() {
    this.auth.signIn(this.email, this.password).subscribe(
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
    console.log(signUpModal);
  }

}
