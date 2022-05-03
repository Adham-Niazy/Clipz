import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, delay, filter, switchMap } from 'rxjs/operators';
import IUser from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;
  private redirect: boolean = false;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usersCollection = this.db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(
      map(user => !!user)
    )

    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1000)
    )

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => this.route.firstChild),
      switchMap(route => route?.data ?? of({}))
    ).subscribe((data) => {
      this.redirect = data['authOnly'] ?? false;
    })
  }

  public async createUser(userData: IUser) {
    if (!userData.password) {
      throw new Error("Password not provided!");
    }

    // Creating User Auth
    const userCred = await this.auth.createUserWithEmailAndPassword(userData.email, userData.password);

    // Store the rest of users information in the database
    await this.usersCollection.doc(userCred.user?.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phone_number: userData.phone_number,
    });

    // Update the user display name to be the Entered name.
    await userCred.user?.updateProfile({
      displayName: userData.name
    })
  }

  public async login(credentials: { email: string, password: string }) {
    await this.auth.signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    )
  }

  public async logout() {
    await this.auth.signOut()
    if (this.redirect) {
      await this.router.navigateByUrl('/');
    }
  }
}
