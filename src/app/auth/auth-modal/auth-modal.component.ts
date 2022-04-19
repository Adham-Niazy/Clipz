import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent implements OnInit, OnDestroy {

  constructor(private modal: ModalService) { }

  ngOnInit(): void {
    this.modal.register("auth");
  }

  ngOnDestroy(): void {
    this.modal.unRegister("auth");
  }
}
