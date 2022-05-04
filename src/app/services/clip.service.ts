import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import IClip from '../models/clip.model';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  private clipsCollection: AngularFirestoreCollection<IClip>;

  constructor(
    private db: AngularFirestore
  ) {
    this.clipsCollection = this.db.collection('clips');
  }

  public async createClip(data: IClip) {
    await this.clipsCollection.add(data)
  }
}
