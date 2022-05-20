import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrls: ['./clips-list.component.scss']
})
export class ClipsListComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit(): void {
    window.addEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const { scrollTop, offsetHeight } = document.documentElement;
    const { innerHeight } = window;

    const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

    if( bottomOfWindow ) {
      console.log("We areeeeee bottom");
      
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handleScroll);
  }
}
