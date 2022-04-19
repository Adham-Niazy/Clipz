import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  constructor(public modal: ModalService) { }

  ngOnInit(): void {
  }

  closeModal() {
    this.modal.toggleModalVisibility();
  }
}
