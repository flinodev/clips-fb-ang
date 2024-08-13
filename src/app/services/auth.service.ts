import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import IUser from '../models/user.model';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection;
  public isAuthenticaded$: Observable<boolean>;
  public isAuthenticadedWithDelay$: Observable<boolean>;

  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
    this.usersCollection = db.collection<IUser>('users');
    this.isAuthenticaded$ = this.auth.user.pipe(map((user) => !!user));
    this.isAuthenticadedWithDelay$ = this.isAuthenticaded$.pipe(delay(1000));
  }

  async createUser(userData: IUser) {
    if (!userData.password) {
      throw Error('Password not provided!');
    }
    const authCredentials = await this.auth.createUserWithEmailAndPassword(
      userData.email,
      userData.password
    );
    if (!authCredentials.user) {
      throw Error('User not found!');
    }
    await this.usersCollection.doc(authCredentials.user?.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber,
    });
    await authCredentials.user.updateProfile({
      displayName: userData.name,
    });
  }
}
