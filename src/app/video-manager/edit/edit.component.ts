import { Component, Input, OnInit } from '@angular/core';
import IClip from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  @Input() activeClip: IClip | null = null;
  constructor(private modal: ModalService) { }

  ngOnInit(): void {
    this.modal.register("edit-clip");
  }

  ngOnDestroy(): void {
    this.modal.unRegister("edit-clip");
  }

}
