import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { IQuotas } from '../models/quotas';

@Injectable({
  providedIn: 'root',
})
export class QuotaService {
  private quotasCollection: AngularFirestoreCollection<IQuotas>;
  constructor(private db: AngularFirestore) {
    this.quotasCollection = db.collection<IQuotas>('quotas');
  }
}
