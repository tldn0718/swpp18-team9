import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  username: string;
  password: string;
  firstName: string;
  lastName: string;
  errorMessage: string;

  constructor(private activeModal: NgbActiveModal, private auth: AuthService) { }

  ngOnInit() {
  }

  get signUpDisabled() {
    const usernameDisabled = !this.username || this.username.trim() === '';
    const passwordDisabled = !this.password || this.password.trim() === '';
    return usernameDisabled || passwordDisabled;
  }

  closeModal(reason: string) {
    this.activeModal.close(reason);
  }

  signUp() {
    this.auth.signUp(this.username, this.password, this.firstName, this.lastName).subscribe(
      () => {
        this.activeModal.close('Sign Up Success');
      },
      (err) => {
        this.errorMessage = "Sign Up Error";
        setTimeout(()=>{this.errorMessage=null},5000);
      }
    );
  }

}
