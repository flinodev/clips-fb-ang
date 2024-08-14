import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import IUser from '../models/user.model';
import { Observable, of } from 'rxjs';
import { delay, filter, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection;
  public isAuthenticaded$: Observable<boolean>;
  public isAuthenticadedWithDelay$: Observable<boolean>;
  public isRedirect = false;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usersCollection = db.collection<IUser>('users');
    this.isAuthenticaded$ = this.auth.user.pipe(map((user) => !!user));
    this.isAuthenticadedWithDelay$ = this.isAuthenticaded$.pipe(delay(1000));
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => this.route.firstChild),
        switchMap((route) => route?.data ?? of({ authOnly: false }))
      )
      .subscribe((data) => {
        this.isRedirect = data.authOnly ?? false;
      });
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

  public async logout(event?: Event) {
    event && event.preventDefault();
    await this.auth.signOut();
    if (this.isRedirect) {
      await this.router.navigateByUrl('/');
    }
  }
}
