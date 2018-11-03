import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  email: string;
  password: string;

  constructor(private auth: AuthService) { }

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

}
