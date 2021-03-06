import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/authentication/auth.service';
import { User } from '@core/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) { }

  user: User;
  refresh: boolean;

  ngOnInit() {
  	this.auth.getUserObservable().subscribe(user => this.user = user);
  }

  logout()
  {
  	this.auth.logout();
    this.user = null;
    this.router.navigate(['/login']);
    // this.dataService.logoutData();
  }

  // login()
  // {
  // 	this.auth.login("user", "pass").subscribe(()=>{ this.auth.getUser().subscribe(user => this.user = user) }, error=>console.error(error), ()=> {});

  // }
  // moved to login component

  resetData()
  {
    // this.dataService.resetData();
  }

}
