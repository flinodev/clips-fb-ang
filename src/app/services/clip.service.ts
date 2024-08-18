import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import IClips from '../models/clips';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, switchMap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  clipsCollection: AngularFirestoreCollection<IClips>;

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage
  ) {
    this.clipsCollection = db.collection('clips');
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
}
