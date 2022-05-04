import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoManagerRoutingModule } from './video-manager-routing.module';
import { ManageComponent } from './manage/manage.component';
import { UploadComponent } from './upload/upload.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ManageComponent,
    UploadComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    VideoManagerRoutingModule
  ]
})
export class VideoManagerModule { }
