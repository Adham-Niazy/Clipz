import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import VideoJs from 'video.js'

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClipComponent implements OnInit {
  id: string = '';
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef;
  player?: VideoJs.Player;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.player = VideoJs(this.target?.nativeElement);

    this.route.params.subscribe((param) => {
      this.id = param['id'];
    });
  }



}
