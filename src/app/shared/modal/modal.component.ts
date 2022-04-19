import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() modalID: string = "";

  constructor(public modal: ModalService) { }

  ngOnInit(): void {
  }

  closeModal() {
    this.modal.toggleModalVisibility(this.modalID);
  }
}
