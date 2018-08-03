import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/authentication/auth.service';
import { DataService } from '@core/data/data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private auth: AuthService, private dataService: DataService) { }

  user;
  refresh: boolean;

  ngOnInit() {
  	this.auth.getUser().subscribe(user => this.user = user);
  }

  setAccess()
  {
  	this.auth.setAccess(this.user.access.club, this.user.access.division, this.user.access.district);
  	this.refresh = true;
  }

  logout()
  {
  	this.auth.logout();
  }

  login()
  {
  	this.auth.login("user", "pass").subscribe(()=>{}, error=>console.error(error), ()=> {});
  }

  resetData()
  {
    this.dataService.resetData();
  }

}
