import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../auth.service';
import { SignUpComponent } from '../sign-up';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  email: string;
  password: string;

  constructor(private auth: AuthService, private modal: NgbModal) { }

  ngOnInit() {
  }

  get loginDisabled() {
    const emailDisabled = !this.email || this.email.trim() === '';
    const passwordDisabled = !this.password || this.password.trim() === '';
    return emailDisabled || passwordDisabled;
  }

  signIn() {
    this.auth.signIn(this.email, this.password).subscribe((res) => {
      // if successfully signed in, route app to main page
    });
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
