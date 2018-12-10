import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  back() {
    this.router.navigate(['/main']);
  }

  signOut() {
    this.auth.signOut().subscribe(()=>{
      this.router.navigate(['/signin']);
    });
  }

}
