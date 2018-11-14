import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/authentication/auth.service';
import { DataService } from '@core/data/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', './_signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private dataService: DataService,
    private router: Router) {}

  codeValidity: boolean = false;
  databaseValidity: boolean = false;


  firstName: string;
  lastName: string;
  school: string;
  division: string;


  ngOnInit() { }

  setCodeValidity(x) {
  	if( x > 0 ) { this.codeValidity = true; }
  	else{ this.codeValidity = false; }
  }

  getCodeValidity() {
  	return this.codeValidity;
  }

  setDatabaseValidity(firstName, lastName, school, division) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.school = school;
    this.division = division;
    this.databaseValidity = !this.databaseValidity;

  }
  // Sets databaseValidity to true if user clicks next after the validation form is shown
  // Sets databaseValidity to false if users return to the validation form
  // *If extending the sign up form to more pages consider replacing this system

  getDatabaseValidity() {
    return this.databaseValidity;
  }

  checkCode(SignUpCode){
  	if(SignUpCode == "code"){ this.setCodeValidity(true); }
  	else{ this.setCodeValidity(false); }
  }

  signup( code, email, user, pass ){
    this.auth.signup(code, email, user, pass).subscribe(res=> { this.router.navigate(['']) }, error=>console.error(error), ()=> {});
  }

  // signup( code, email, user, pass ){
  //   this.auth.signup(code, email, user, pass).subscribe(res=> { this.router.navigate(['']) }, error=>console.error(error), ()=> {});
  // }
  // TODO: update this to reflect any user corrections to database

}