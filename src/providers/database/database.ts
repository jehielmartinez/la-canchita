import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { User } from '../../interfaces/user';

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider { 
  constructor(public http: HttpClient, private firebaseDatabase: AngularFireDatabase) {}

  createUser(user: User){
    return this.firebaseDatabase.object('users/' + user.uid).set(user);
  }
}
