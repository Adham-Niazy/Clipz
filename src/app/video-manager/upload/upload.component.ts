import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { last, switchMap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import firebase from 'firebase/compat/app';

import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  isDragover: boolean = false;
  file: File | null = null;
  nextStep: boolean = false;
  percentage: { value: number, show: boolean } = { value: 0, show: false };
  user: firebase.User | null = null;

  title: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]);

  uploadForm: FormGroup = new FormGroup({
    title: this.title
  })

  Alert: { show: boolean; color: string; message: string } = {
    show: false,
    color: 'blue',
    message: 'Please wait! Your clip is being uploaded.'
  }
  inSubmission: boolean = false;

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService
  ) {
    auth.user.subscribe(user => this.user = user);
  }

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


  async uploadFile() {
    this.inSubmission = true;
    this.updateAlert({
      show: true,
      color: 'blue',
      message: 'Please wait! Your clip is being uploaded.'
    });
    this.percentage.show = true;

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;
    const task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);
    task.percentageChanges().subscribe(progress => {
      this.percentage.value = progress as number / 100;
    })

    task.snapshotChanges().pipe(
      last(),
      switchMap(() => clipRef.getDownloadURL())
    ).subscribe({
      next: (url) => {
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url
        }

        this.clipsService.createClip(clip);

        this.updateAlert({
          color: 'green',
          message: 'Success! Your clip is now ready to share with the world.'
        });
        this.percentage.show = false;
      },
      error: (error) => {
        this.updateAlert({
          color: 'red',
          message: 'An error occurred while uploading. Please try again later!'
        });
        this.inSubmission = false;
        this.percentage.show = false;
      }
    });
  }

  updateAlert(change: { show?: boolean; color?: string; message?: string }) {
    this.Alert = {
      ...this.Alert,
      ...change
    }
  }
}
