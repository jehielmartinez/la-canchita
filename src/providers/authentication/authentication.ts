import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

/*
  Generated class for the AuthenticationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthenticationProvider {

  constructor(public http: HttpClient, private firebaseAuth: AngularFireAuth) {}

  registerWithEmail(email, password){
    return this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  loginWithEmail(email, password){
    return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  }

  changePassword(email){
    return this.firebaseAuth.auth.sendPasswordResetEmail(email);
  }

  logout(){
    return this.firebaseAuth.auth.signOut();
  }
  getStatus(){
    return this.firebaseAuth.authState;
  }



}
