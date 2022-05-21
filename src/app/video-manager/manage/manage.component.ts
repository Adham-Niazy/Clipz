import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  loading: boolean = false;
  sort_order: string = '1';
  clips: IClip[] = [];
  clipss: IClip[] = [];
  active_clip: IClip | null = null;
  sort$: BehaviorSubject<string> = new BehaviorSubject(this.sort_order);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modal: ModalService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.route.queryParamMap.subscribe((params: Params) => {
      this.sort_order = params['get']('sort') ?? '1';
      this.sort$.next(this.sort_order);
    });

    this.clipService.getUserClips(this.sort$).subscribe(docs => {
      this.clips = [];
      docs.forEach(doc => {
        this.clips.push({
          docID: doc.id,
          ...doc.data()
        })
      })
      this.loading = false;
    });
  }

  sort(e: Event) {
    const { value } = (e.target as HTMLSelectElement);
    this.router.navigateByUrl(`/manage?sort=${value}`);
  }

  update(e: IClip) {
    this.clips.forEach((el, idx) => {
      if (el.docID === e.docID) {
        this.clips[idx].title = e.title
      }
    })
  }

  async deleteClip(clip_info: IClip) {
    this.clipService.deleteClip(clip_info);
    this.clips = this.clips.filter(el => el.docID !== clip_info.docID);
  }

  openModal(clip_info: IClip) {
    this.modal.toggleModalVisibility('edit-clip');
    this.active_clip = clip_info;
  }
}
