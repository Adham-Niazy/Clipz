import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private visibile: boolean = false;
  constructor() { }

  getModalVisibility() {
    return this.visibile;
  }

  toggleModalVisibility() {
    this.visibile = !this.visibile;
  }
}
