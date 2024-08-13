import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import IUser from '../../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  constructor(private auth: AuthService) {}

  showAlert = signal(false);
  alertMsg = signal('Please wait! Your account is being created');
  alertColor = signal('blue');
  inSubmission = false;

  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  email = new FormControl('', [Validators.required, Validators.email]);
  age = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(18),
    Validators.max(100),
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
  ]);
  confirmPassword = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
  ]);
  phoneNumber = new FormControl('');

  registrationForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirmPassword: this.confirmPassword,
    phoneNumber: this.phoneNumber,
  });

  async register() {
    this.showAlert.set(true);
    this.alertMsg.set('Please wait! Your account is being created');
    this.alertColor.set('blue');
    console.log('register');
    this.inSubmission = true;
    this.auth.createUser(this.registrationForm.value as IUser);
    try {
    } catch (err) {
      this.alertMsg.set('An unexpected error ocurred. Please try again later');
      this.alertColor.set('red');
      this.inSubmission = false;
      return;
    }
    this.alertColor.set('green');
    this.alertMsg.set('Success! Your account has been created!');
  }
}
