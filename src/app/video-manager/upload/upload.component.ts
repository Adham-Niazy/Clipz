import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  isDragover: boolean = false;
  file: File | null = null;
  nextStep: boolean = false;

  title: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]);

  uploadForm: FormGroup = new FormGroup({
    title: this.title
  })

  constructor(
    private storage: AngularFireStorage
  ) { }

  ngOnInit(): void {
  }

  storeFile(e: Event) {
    // End Dragging Effect
    this.isDragover = false;
    // Hold a reference to the file
    this.file = (e as DragEvent).dataTransfer?.files.item(0) ?? null;
    // Check if the file match our needs
    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }
    // For UX: Set Title Field to be the file name
    this.title.setValue(
      this.file.name.replace(/\.[^/.]+$/, '')
    )
    // Enter next step form
    this.nextStep = true;
  }


  uploadFile() {
    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;

    this.storage.upload(clipPath, this.file);
  }
}
