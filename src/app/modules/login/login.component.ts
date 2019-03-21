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
  constructor(
   private auth: AuthService,
   private dataService: DataService,
   private router: Router) {}

  user;
  refresh: boolean;
  wrong: boolean = false;

  ngOnInit() {
    this.user = this.auth.getUser();
  }

  submitLogin({value, valid})
  {
    this.wrong = false;  // some indication of input when they submit another email/password
    this.auth.login(value.email, value.password).subscribe(success => {
      if(success)
        this.router.navigate([''])
      else
        this.wrong = true;
    },
    error=> console.error(error),
    ()=> {});
  }
}