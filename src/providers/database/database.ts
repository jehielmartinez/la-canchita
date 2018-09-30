import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { User } from '../../interfaces/user';
import { AngularFireStorage } from '@angular/fire/storage';

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider { 
  constructor(public http: HttpClient, private firebaseDatabase: AngularFireDatabase, private fireStorage: AngularFireStorage) {}

  createUser(user: User){
    return this.firebaseDatabase.object('users/' + user.uid).set(user);
  }
  getUserById(uid){
    return this.firebaseDatabase.object('users/' + uid);
  }
  //Complex Protocols
  saveComplex(uid, complex){
    return this.firebaseDatabase.object('users/' + uid + '/complexes/' + complex.id).update(complex);
  }
  deleteComplex(uid, complexId){
    return this.firebaseDatabase.object('users/' + uid + '/complexes/' + complexId).remove();
  }
  getComplexById(uid, complexId){
    return this.firebaseDatabase.object('users/' + uid + '/complexes/' + complexId);
  }
  getAllAdmins(){
    return this.firebaseDatabase.list('users/', ref => ref.orderByChild('type').equalTo('admin'));
  }
  uploadImage(image_name, image){
    return this.fireStorage.ref(`images/${image_name}`).putString(image, 'data_url');
  }
  getDownloadUrl(image_name){
    return this.fireStorage.ref(`images/${image_name}`).getDownloadURL();
  }
  getComplexImages(uid, complexId){
    return this.firebaseDatabase.list('users/' + uid + '/complexes/' + complexId + '/images/');
  }
  deleteComplexImagesDb(uid, complexId){
    return this.firebaseDatabase.list('users/' + uid + '/complexes/' + complexId + '/images/').remove();
  }
  deleteComplexImagesSt(image_name){
    return this.fireStorage.ref(`images/${image_name}`).delete();
  }
  updateComplexImages(imageURL, uid){
    return this.firebaseDatabase.object('users/' + uid + '/complexes/' + imageURL.complexId + '/images/' + imageURL.imageId).set(imageURL);
  }
  //Field Protocols
  saveField(uid, field){
    return this.firebaseDatabase.object('users/' + uid + '/complexes/' + field.complexId + '/fields/' + field.id).update(field);
  }

  deleteField(uid, field){
    return this.firebaseDatabase.object('users/' + uid + '/complexes/' + field.complexId + '/fields/' + field.id).remove();
  }
}
