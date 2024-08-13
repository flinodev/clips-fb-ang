import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  showAlert = false;
  alertMessage = 'Please wait! Logging you account.';
  alertColor = 'blue';
  isSubmission = false;

  credentials = {
    email: '',
    password: '',
  };

  constructor(private auth: AngularFireAuth) {}

  async login() {
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMessage = 'Please wait! We are logging you in.';
    try {
      this.isSubmission = true;
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      );
    } catch (err) {
      this.alertColor = 'red';
      this.alertMessage =
        'An unexpected error occured. Please try again later.';
      this.isSubmission = false;
      this.showAlert = true;
      console.log(err);
      return;
    }
    this.alertColor = 'green';
    this.alertMessage = 'Success. You are now logged in!';
    this.isSubmission = false;
  }
}
