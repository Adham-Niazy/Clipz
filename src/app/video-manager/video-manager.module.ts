import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoManagerRoutingModule } from './video-manager-routing.module';
import { ManageComponent } from './manage/manage.component';


@NgModule({
  declarations: [
    ManageComponent
  ],
  imports: [
    CommonModule,
    VideoManagerRoutingModule
  ]
})
export class VideoManagerModule { }
