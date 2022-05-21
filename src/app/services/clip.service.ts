import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, map } from 'rxjs/operators';
import { of, BehaviorSubject, combineLatest, firstValueFrom, Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import IClip from '../models/clip.model';

@Injectable({
  providedIn: 'root'
})
export class ClipService implements Resolve<IClip | null> {
  private clipsCollection: AngularFirestoreCollection<IClip>;
  pageClips: IClip[] = [];
  pendingRequest: boolean = false;
  reachedMax: boolean = false;

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage,
    private router: Router
  ) {
    this.clipsCollection = this.db.collection('clips');
  }

  public createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return this.clipsCollection.add(data)
  }

  public getUserClips(sort$: BehaviorSubject<string>) {
    return combineLatest([
      this.auth.user,
      sort$
    ]).pipe(
      switchMap(values => {
        const [user, sort] = values;
        if (!user) {
          return of([])
        }

        const query = this.clipsCollection.ref.where(
          'uid', '==', user.uid
        ).orderBy(
          'timestamp',
          sort == '1' ? 'desc' : 'asc'
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

  public async deleteClip(data: IClip) {
    const clipRef = this.storage.ref(`clips/${data.fileName}`);
    const screenshotRef = this.storage.ref(`screenshots/${data.screenshotFileName}`);

    await clipRef.delete();
    await screenshotRef.delete();

    await this.clipsCollection.doc(data.docID).delete();
  }

  public async getClips() {
    // We can not make another call while there is one opened already.
    if (this.pendingRequest) return;

    this.pendingRequest = true;

    let query = this.clipsCollection.ref.orderBy(
      'timestamp', 'desc'
    ).limit(6)

    const { length } = this.pageClips;
    if (length) {
      const lastDocID = this.pageClips[length - 1].docID;
      const lastDoc = await firstValueFrom(this.clipsCollection.doc(lastDocID).get());

      query = query.startAfter(lastDoc);
    };

    const snapshot = await query.get();

    snapshot.forEach(doc => {
      this.pageClips.push({
        docID: doc.id,
        ...doc.data()
      });
    })
    this.pendingRequest = false;
  }

  public emptyClipsList() {
    this.pageClips = [];
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.clipsCollection.doc(route.params['id'])
      .get()
      .pipe(
        map(snapshot => {
          const data = snapshot.data();
          // If there's no data so user will be redirected
          if (!data) {
            this.router.navigate(['/']);
            return null;
          }
          return data;
        })
      )
  }
}
