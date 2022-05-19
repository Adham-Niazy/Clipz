import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {
  isRunning: boolean = false;
  isReady: boolean = false;
  private ffmpeg;

  constructor() {
    this.ffmpeg = createFFmpeg({
      log: true
    });
  }

  async init() {
    if (this.isReady) return;

    await this.ffmpeg.load();
    this.isReady = true;
  }

  async getScreenshots(file: File) {
    this.isRunning = true;
    const data = await fetchFile(file);
    // Store the uploaded memory in the Buffered Array
    this.ffmpeg.FS('writeFile', file.name, data);
    // Run commands through ffmpeg API to manipulate the video

    const seconds = [1, 2, 3];
    const commands: string[] = [];

    seconds.forEach(sec => {
      commands.push(
        // Input: -i is to grap a specific file in file system
        '-i', file.name,
        // Output options
        // 1) Update timestamp to tell ffmpeg to capture a specific screenshot time 
        '-ss', `00:00:0${sec}`,
        // 2) since we need an image so here I am defining the frames rate to 1
        '-frames:v', '1',
        // 3) then resize the screen shot to be always 510 width and height depends on aspect ratio
        '-filter:v', 'scale=510:-1',
        // Output
        `output_0${sec}.png`
      )
    });

    await this.ffmpeg.run(
      ...commands
    )

    const screenshots: string[] = [];
    seconds.forEach(sec => {
      // Grapping the screenshots from the file system
      const screenshotFile = this.ffmpeg.FS('readFile', `output_0${sec}.png`);
      // Convert screenshot to a Blob
      const screenshotBlob = new Blob(
        [screenshotFile.buffer],
        {
          type: 'image/png'
        }
      )
      // Create a URL from the Blob
      const screenshotURL = URL.createObjectURL(screenshotBlob);
      screenshots.push(screenshotURL);
    });
    this.isRunning = false;
    return screenshots;
  }

  async blobFromURL(url: string) {
    const response = await fetch(url);
    const blob = response.blob();

    return blob;
  }
}
