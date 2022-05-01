import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: ''
  }
  Alert: { show: boolean; color: string; message: string } = {
    show: false,
    color: 'blue',
    message: 'Please wait! You will be logged in soon.'
  }
  inSubmission: boolean = false;

  constructor(
    private auth: AngularFireAuth,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  async login() {
    this.inSubmission = true;
    this.updateAlert({
      show: true,
      color: 'blue',
      message: 'Please wait! Your account is being created.'
    });
    try {
      await this.authService.login(this.credentials);
      this.updateAlert({
        color: 'green',
        message: 'Success! You have been logged in.'
      });
    } catch (e: any) {
      let errMsg: string = 'An error occurred. Please try again later!';
      switch (e.code) {
        case 'auth/invalid-email': errMsg = 'Email is invalid!'; break;
        case 'auth/user-disabled': errMsg = 'This user has been disabled!'; break;
        case 'auth/user-not-found': errMsg = 'There is no user with this email'; break;
        case 'auth/wrong-password': errMsg = 'Wrong Password!'; break;
      }
      this.updateAlert({
        color: 'red',
        message: errMsg
      });
      this.inSubmission = false;
    }
  }

  updateAlert(change: { show?: boolean; color?: string; message?: string }) {
    this.Alert = {
      ...this.Alert,
      ...change
    }
  }
}
