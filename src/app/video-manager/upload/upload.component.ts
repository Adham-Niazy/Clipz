import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { last, switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { v4 as uuid } from 'uuid';
import firebase from 'firebase/compat/app';

import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnDestroy {
  isDragover: boolean = false;
  file: File | null = null;
  nextStep: boolean = false;
  percentage: { value: number, show: boolean } = { value: 0, show: false };
  user: firebase.User | null = null;
  task?: AngularFireUploadTask;
  screenshots: string[] = [];
  selectedScreenshot: string = '';
  screenshotTask?: AngularFireUploadTask;

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
    private clipsService: ClipService,
    private router: Router,
    public ffmpeg: FfmpegService
  ) {
    auth.user.subscribe(user => this.user = user);
    ffmpeg.init();
  }

  async storeFile(e: Event) {
    if (this.ffmpeg.isRunning) return;
    // End Dragging Effect
    this.isDragover = false;
    // Hold a reference to the file
    this.file = (e as DragEvent).dataTransfer ?
      (e as DragEvent).dataTransfer?.files.item(0) ?? null :
      (e.target as HTMLInputElement).files?.item(0) ?? null;
    // Check if the file match our needs
    if (!this.file || this.file.type !== 'video/mp4') return;
    // Store the video in service to get screenshots from it
    this.screenshots = await this.ffmpeg.getScreenshots(this.file)
    this.selectedScreenshot = this.screenshots[0];
    // For UX: Set Title Field to be the file name
    this.title.setValue(
      this.file.name.replace(/\.[^/.]+$/, '')
    )
    // Enter next step form
    this.nextStep = true;
  }


  async uploadFile() {
    this.uploadForm.disable();
    this.inSubmission = true;
    this.updateAlert({
      show: true,
      color: 'blue',
      message: 'Please wait! Your clip is being uploaded.'
    });
    this.percentage.show = true;

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;

    const screenshotBlob = await this.ffmpeg.blobFromURL(this.selectedScreenshot);
    const screenshotPath = `screenshots/${clipFileName}.png`;

    this.screenshotTask = this.storage.upload(screenshotPath, screenshotBlob);

    this.task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);
    combineLatest([
      this.task.percentageChanges(),
      this.screenshotTask.percentageChanges()
    ]).subscribe(([clip_progress, screenshot_progress]) => {
      if (!clip_progress || !screenshot_progress) return;

      const total = clip_progress as number + screenshot_progress as number;

      this.percentage.value = total / 200;
    })

    this.task.snapshotChanges().pipe(
      last(),
      switchMap(() => clipRef.getDownloadURL())
    ).subscribe({
      next: async (url) => {
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }
        const clipDocRef = await this.clipsService.createClip(clip);
        this.updateAlert({
          color: 'green',
          message: 'Success! Your clip is now ready to share with the world.'
        });
        this.percentage.show = false;

        setTimeout(() => {
          this.router.navigate([
            'clip', clipDocRef.id
          ])
        }, 1000)
      },
      error: (error) => {
        this.uploadForm.enable();
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

  // For cancelling uploading before leaving the component
  ngOnDestroy(): void {
    this.task?.cancel();
  }
}
