import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import IClips from '../models/clips';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, switchMap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, firstValueFrom, of } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  ActivatedRouteSnapshot,
  MaybeAsync,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ClipService implements Resolve<IClips | null> {
  clipsCollection: AngularFirestoreCollection<IClips>;
  pageClips: IClips[] = [];
  pendingRequest = false;

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage,
    private router: Router
  ) {
    this.clipsCollection = db.collection('clips');
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<IClips | null> {
    return this.clipsCollection
      .doc(route.params['id'])
      .get()
      .pipe(
        map((snapshot) => {
          const data = snapshot.data();
          if (!data) {
            this.router.navigate(['/']);
            return null;
          }
          return data;
        })
      );
  }

  createClip(data: IClips) {
    return this.clipsCollection.add(data);
  }

  getUserClips(sort$: BehaviorSubject<string>) {
    return combineLatest([this.auth.user, sort$]).pipe(
      switchMap((values) => {
        const [user, sort] = values;
        if (!user) {
          return of([]);
        }
        const query = this.clipsCollection.ref
          .where('uid', '==', user.uid)
          .orderBy('timestamp', sort === '1' ? 'desc' : 'asc');
        return query.get();
      }),
      map((snapshot) => {
        return (snapshot as QuerySnapshot<IClips>).docs;
      })
    );
  }

  updateClip(id: string, title: string) {
    return this.clipsCollection.doc(id).update({ title: title });
  }

  async deleteClip(clip: IClips) {
    const clipStorageRef = this.storage.ref(`clips/${clip.fileName}`);
    await clipStorageRef.delete();
    const screenshotStorageRef = this.storage.ref(
      `screenshots/${clip.screenshotFileName}`
    );
    await screenshotStorageRef.delete();
    await this.clipsCollection.doc(clip.docID).delete();
  }

  async getClips() {
    if (this.pendingRequest) return;
    this.pendingRequest = true;
    let query = this.clipsCollection.ref.orderBy('timestamp', 'desc').limit(6);
    const { length } = this.pageClips;
    if (length) {
      const lastDocID = this.pageClips[length - 1].docID;
      const lastDoc = await firstValueFrom(
        this.clipsCollection.doc(lastDocID).get()
      );
      query = query.startAfter(lastDoc);
    }

    const snapshot = await query.get();
    console.log(snapshot.docs.length);
    snapshot.forEach((doc) => {
      this.pageClips.push({ docID: doc.id, ...doc.data() });
    });

    this.pendingRequest = false;
  }
}
