import { Component, OnInit } from '@angular/core';
// import { RouterModule } from '@angular/router'; // may or may not be necessary

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  codeValidity: boolean = false;
  databaseValidated: boolean = false;

  ngOnInit() { }

  setCodeValidity(x) {
  	if( x > 0 ) { this.codeValidity = true; }
  	else{ this.codeValidity = false; }
  }

  getCodeValidity() {
  	return this.codeValidity;
  }

  setDatabaseValidated() {
    this.databaseValidated = !this.databaseValidated;
    console.log(this.databaseValidated);
  }
  // Sets databaseValidated to true if user clicks next after the validation form is shown
  // Sets databaseValidated to false if users return to the validation form
  // *If extending the sign up form to more pages consider replacing this system

  getDatabaseValidated() {
    return this.databaseValidated;
  }

  checkCode(SignUpCode){
  	if(SignUpCode == "a"){ this.setCodeValidity(true); }
  	else{ this.setCodeValidity(false); }
  }

}