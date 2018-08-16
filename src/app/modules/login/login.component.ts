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

  ngOnInit() {
    this.auth.getUser().subscribe(user => this.user = user);
  }

  login(Username, Password)
  {
    this.auth.login(Username, Password).subscribe(res=> { this.router.navigate(['']) }, error=>console.error(error), ()=> {});
  }
}