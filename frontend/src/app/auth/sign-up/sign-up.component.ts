import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  email: string;
  password: string;

  constructor(private activeModal: NgbActiveModal, private auth: AuthService) { }

  ngOnInit() {
  }

  get signUpDisabled() {
    const emailDisabled = !this.email || this.email.trim() === '';
    const passwordDisabled = !this.password || this.password.trim() === '';
    return emailDisabled || passwordDisabled;
  }

  closeModal(reason: string) {
    this.activeModal.close(reason);
  }

  signUp() {
    this.auth.signUp(this.email, this.password).subscribe((res) => {
      // if successfully signed up, close modal with success result
      this.activeModal.close('Sign Up Success');
    });
  }

}
