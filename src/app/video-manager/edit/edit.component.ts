import { Component, Input, OnInit, OnDestroy, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null;
  @Output() update = new EventEmitter();

  clipID: FormControl = new FormControl('');
  title: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]);

  editForm: FormGroup = new FormGroup({
    title: this.title,
    id: this.clipID
  });

  Alert: { show: boolean; color: string; message: string } = {
    show: false,
    color: 'blue',
    message: 'Please wait! updating clip.'
  }
  inSubmission: boolean = false;

  constructor(
    private modal: ModalService,
    private clipService: ClipService
  ) { }

  ngOnInit(): void {
    this.modal.register("edit-clip");
  }

  ngOnChanges(): void {
    this.Alert.show = false;
    if (!this.activeClip) return;
    this.clipID.setValue(this.activeClip.docID);
    this.title.setValue(this.activeClip.title);
  }

  ngOnDestroy(): void {
    this.modal.unRegister("edit-clip");
  }

  updateAlert(change: { show?: boolean; color?: string; message?: string }) {
    this.Alert = {
      ...this.Alert,
      ...change
    }
  }

  async editClip() {
    if (!this.activeClip) { return };
    this.editForm.disable();
    this.inSubmission = true;
    this.updateAlert({
      show: true,
      color: 'blue',
      message: 'Please wait! updating clip.'
    });
    try {
      await this.clipService.updateClip(this.clipID.value, this.title.value);
      this.updateAlert({
        color: 'green',
        message: 'Success! Your clip is updated.'
      });
      this.activeClip.title = this.title.value;
      this.update.emit(this.activeClip);
    } catch {
      this.updateAlert({
        color: 'red',
        message: 'An error occurred while updating. Please try again later!'
      });
    } finally {
      this.inSubmission = false;
      this.editForm.enable();
    }
  }

}
