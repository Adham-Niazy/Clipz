import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  isDragover: boolean = false;
  file: File | null = null;

  constructor() { }

  ngOnInit(): void {
  }

  storeFile(e: Event) {
    this.isDragover = false;

    this.file = (e as DragEvent).dataTransfer?.files.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }
  }

}
