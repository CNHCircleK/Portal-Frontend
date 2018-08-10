import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/authentication/auth.service';
import { DataService } from '@core/data/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', './_login.component.scss']
})

export class LoginComponent implements OnInit {
  constructor(private auth: AuthService, private dataService: DataService, private router: Router) { }

  user;
  refresh: boolean;

  username: string;
  password: string;


  ngOnInit() {
  	this.auth.getUser().subscribe(user => this.user = user);
  }

  login()
  {
    if(this.username && this.password)
    	this.auth.login(this.username, this.password).subscribe(res=> {
                                              if(res)
                                                 this.router.navigate([''])}, error=> {console.error(error); window.alert("uh oh")}, ()=> {});
    else
      window.alert("Enter something");
  }

}