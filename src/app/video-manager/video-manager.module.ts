import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoManagerRoutingModule } from './video-manager-routing.module';
import { ManageComponent } from './manage/manage.component';
import { UploadComponent } from './upload/upload.component';


@NgModule({
  declarations: [
    ManageComponent,
    UploadComponent
  ],
  imports: [
    CommonModule,
    VideoManagerRoutingModule
  ]
})
export class VideoManagerModule { }
