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

  validCode: boolean = false;
  dataCorrect: boolean = false;

  formUnlocked: boolean = false;

  code: string;
  firstName: string;
  lastName: string;
  school: string;
  division: string;
  matchedPass: boolean = true;


  ngOnInit() { }

  isValidCode() {
  	return this.validCode;
  }

  editUserData(firstName, lastName, school, division) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.school = school;
    this.division = division;
    this.dataCorrect = true;
    this.formUnlocked = false;
  }

  unlockForm(){
    this.formUnlocked = true;
  }

  isFormUnlocked(){
    return this.formUnlocked;
  }

  setDataCorrect(x){
    if(x>0){ this.dataCorrect = true; }
    else{ this.dataCorrect = false; }
  }

  isDataCorrect() {
    return this.dataCorrect;
  }

  getMatchedPass(){
    return this.matchedPass;
  }

  checkCode(SignUpCode){
  	if(SignUpCode == "code"){ this.validCode = true; this.code = SignUpCode }
  	else{ this.validCode = false; }
  }

  signup(email, user, pass, confirmedPass ){
    if(pass == confirmedPass){
      this.auth.signup( this.code, email, user, pass).subscribe(res=> { this.router.navigate(['']) }, error=>console.error(error), ()=> {});
    }
    else{
      this.matchedPass = false;
    }
  }

  // signup( code, email, user, pass ){
  //   this.auth.signup(code, email, user, pass).subscribe(res=> { this.router.navigate(['']) }, error=>console.error(error), ()=> {});
  // }
  // TODO: update this to reflect any user corrections to database

}