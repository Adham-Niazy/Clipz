import { Injectable } from '@angular/core';

interface IModal {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: IModal[] = [];
  constructor() { }

  register(modal_id: string): void {
    this.modals.push({ id: modal_id, visible: false });
  }

  unRegister(modal_id: string): void {
    this.modals = this.modals.filter(modal => modal.id !== modal_id);
  }

  getModalVisibility(modal_id: string): boolean {
    return Boolean(this.modals.find(modal => modal.id === modal_id)?.visible);
  }

  toggleModalVisibility(modal_id: string): void {
    const modal = this.modals.find(modal => modal.id === modal_id);
    if (modal) modal.visible = !modal.visible;
  }
}
