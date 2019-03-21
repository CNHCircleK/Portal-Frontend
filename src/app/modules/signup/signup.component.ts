import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/authentication/auth.service';
import { DataService } from '@core/data/data.service';
import { Router } from '@angular/router';

import { Directive, forwardRef, Provider, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[validateEqual][formControlName],[validateEqual][formControl],[validateEqual][ngModel]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => 
      EqualValidator), multi: true }
  ]
})
export class EqualValidator implements Validator {
 constructor(@Attribute('validateEqual') public validateEqual: string, @Attribute('reverse') public reverse: string) {}
  private get isReverse() {
     if (!this.reverse) return false;
     return this.reverse === 'true' ? true: false;
  }
  validate(c: AbstractControl): { [key: string]: any } {
    // self value
    let v = c.value;
    // control value
    let e = c.root.get(this.validateEqual);
    // value not equal
    console.log(e, c);
    if (e && v !== e.value && !this.isReverse) return {
      validateEqual: false
    }
    // value equal and reverse
    if (e && v === e.value && this.isReverse) {
      delete e.errors['validateEqual'];
      if (!Object.keys(e.errors).length) e.setErrors(null);
    }
    // value not equal and reverse
    if (e && v !== e.value && this.isReverse) {
      e.setErrors({ validateEqual: false })
    }
    return null;
  }
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', './_signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private auth: AuthService, private dataService: DataService, private router: Router) {}

  email: string;
  code: string;
  password: string;
  confirmPassword: string;
  error: string = "";
  matchedPass: boolean = true;


  ngOnInit() { }

  // editUserData(firstName, lastName, school, division) {
  //   this.firstName = firstName;
  //   this.lastName = lastName;
  //   this.school = school;
  //   this.division = division;
  //   this.dataCorrect = true;
  //   this.formUnlocked = false;
  // }

  // unlockForm(){
  //   this.formUnlocked = true;
  // }

  // isFormUnlocked(){
  //   return this.formUnlocked;
  // }

  // setDataCorrect(x){
  //   if(x>0){ this.dataCorrect = true; }
  //   else{ this.dataCorrect = false; }
  // }

  // isDataCorrect() {
  //   return this.dataCorrect;
  // }

  passwordsMatch(){
    return (this.password == this.confirmPassword);
  }

  signup({value, valid}){
    if(value.Password == value.ConfirmPassword){
      this.auth.signup(value.Code, value.Email, value.Password).subscribe(
        (res: any) => {
          if(!res.success)
            this.error = res.error;
        },
        error=>console.error(error),
        ()=> {}
      );
    }
    else
    {
      this.matchedPass = false;
    }
  }

  // signup( code, email, user, pass ){
  //   this.auth.signup(code, email, user, pass).subscribe(res=> { this.router.navigate(['']) }, error=>console.error(error), ()=> {});
  // }
  // TODO: update this to reflect any user corrections to database

}