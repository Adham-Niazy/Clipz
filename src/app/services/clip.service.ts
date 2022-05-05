import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import IClip from '../models/clip.model';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  private clipsCollection: AngularFirestoreCollection<IClip>;

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth
  ) {
    this.clipsCollection = this.db.collection('clips');
  }

  public createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return this.clipsCollection.add(data)
  }

  public getUserClips() {
    return this.auth.user.pipe(
      switchMap(user => {
        if(!user) {
          return of([])
        }

        const query = this.clipsCollection.ref.where(
          'uid', '==', user.uid
        );

        return query.get();
      }),
      map(snapshot => (snapshot as QuerySnapshot<IClip>).docs)
    )
  }

  public updateClip(id: string, title: string) {
    return this.clipsCollection.doc(id).update({
      title
    })
  }
}
