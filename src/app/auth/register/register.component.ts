import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  register() {
    console.log("Register Called!");
    
  }
}
