import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  name: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]);

  email: FormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  age: FormControl = new FormControl('', [
    Validators.required,
    Validators.min(18),
    Validators.max(100)
  ]);

  password: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
  ]);

  confirm_password: FormControl = new FormControl('', [
    Validators.required
  ]);

  phone_number: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(12),
    Validators.maxLength(12),
  ]);

  registerForm: FormGroup = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    phone_number: this.phone_number,
  });

  Alert: { show: boolean; color: string; message: string } = {
    show: false,
    color: 'blue',
    message: 'Please wait! Your account is being created.'
  }

  inSubmission: boolean = false;

  constructor(private authService: AuthService) { }

  async register() {
    this.inSubmission = true;
    this.updateAlert({
      show: true,
      color: 'blue',
      message: 'Please wait! Your account is being created.'
    });
    try {
      this.authService.createUser(this.registerForm.value);
    } catch (e: any) {
      let errMsg: string = 'An error occurred. Please try again later!';
      switch (e.code) {
        case 'auth/email-already-in-use': errMsg = 'Email already exists.'; break;
        case 'auth/weak-password': errMsg = 'Password is weak'; break;
      }
      this.updateAlert({
        color: 'red',
        message: errMsg
      });
      this.inSubmission = false;
      return
    }

    this.updateAlert({
      color: 'green',
      message: 'Success! Your account has been created.'
    });
  }

  updateAlert(change: { show?: boolean; color?: string; message?: string }) {
    this.Alert = {
      ...this.Alert,
      ...change
    }
  }
}
