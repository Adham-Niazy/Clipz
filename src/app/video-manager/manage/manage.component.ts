import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  sort_order: string = '1';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: Params) => {
      this.sort_order = params['get']('sort') ?? '1';
    })
  }

  sort(e: Event) {
    const { value } = (e.target as HTMLSelectElement);

    this.router.navigateByUrl(`/manage?sort=${value}`)
  }
}
