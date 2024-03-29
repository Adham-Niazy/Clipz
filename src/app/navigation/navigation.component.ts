import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  constructor(
    private modal: ModalService,
    public auth: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
  }

  openModal() {
    this.modal.toggleModalVisibility("auth");
  }

  async logout() {
    try {
      await this.auth.logout();
    } catch (e) {
      console.log(e);
    }
  }
}
