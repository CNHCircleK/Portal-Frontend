import { Component, OnInit } from '@angular/core';
// import { RouterModule } from '@angular/router'; // may or may not be necessary

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', './_signup.component.scss']
})
export class SignupComponent implements OnInit {

  codeValidity: boolean = false;
  databaseValidity: boolean = false;

  ngOnInit() { }

  setCodeValidity(x) {
  	if( x > 0 ) { this.codeValidity = true; }
  	else{ this.codeValidity = false; }
  }

  getCodeValidity() {
  	return this.codeValidity;
  }

  setDatabaseValidity() {
    this.databaseValidity = !this.databaseValidity;
    console.log(this.databaseValidity);
  }
  // Sets databaseValidity to true if user clicks next after the validation form is shown
  // Sets databaseValidity to false if users return to the validation form
  // *If extending the sign up form to more pages consider replacing this system

  getDatabaseValidity() {
    return this.databaseValidity;
  }

  checkCode(SignUpCode){
  	if(SignUpCode == "a"){ this.setCodeValidity(true); }
  	else{ this.setCodeValidity(false); }
  }

}