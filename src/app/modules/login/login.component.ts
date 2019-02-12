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
    this.auth.getUser().subscribe(user => this.user = user);
  }

  login(Username, Password)
  {
    this.wrong = false;  // some indication of input when they submit another username/password
    this.auth.login(Username, Password).subscribe((res:any)=> {
      if(res.success)
        this.router.navigate([''])
      else
        this.wrong = true;
    },
    error=> console.error(error),
    ()=> {});
  }
}