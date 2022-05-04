import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  sort_order: string = '1';
  clips: IClip[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: Params) => {
      this.sort_order = params['get']('sort') ?? '1';
    });

    this.clipService.getUserClips().subscribe(docs => {
      this.clips = [];
      docs.forEach(doc => {
        this.clips.push({
          docID: doc.id,
          ...doc.data()
        })
      })
    });
  }

  sort(e: Event) {
    const { value } = (e.target as HTMLSelectElement);
    this.router.navigateByUrl(`/manage?sort=${value}`)
  }
}
