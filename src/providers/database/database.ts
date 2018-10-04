import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { User } from '../../interfaces/user';
import { AngularFireStorage } from '@angular/fire/storage';
import { Complex } from '../../interfaces/complex';

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {
  constructor(public http: HttpClient, private firebaseDatabase: AngularFireDatabase, private fireStorage: AngularFireStorage) { }

  //User Protocols
  createUser(user: User) {
    return this.firebaseDatabase.object('users/' + user.uid).set(user);
  }
  getUserById(uid) {
    return this.firebaseDatabase.object('users/' + uid);
  }
  getAllAdmins() {
    return this.firebaseDatabase.list('users/', ref => ref.orderByChild('type').equalTo('admin'));
  }
  addToBlacklist(uid, player){
    return this.firebaseDatabase.object('users/' + uid + '/blacklist/' + player.uid).update({uid: player.uid});
  }
  getUserBlacklist(uid){
    return this.firebaseDatabase.list('users/' + uid + '/blacklist/');
  }

  //Complex Protocols
  saveComplex(complex: Complex) {
    return this.firebaseDatabase.object('complexes/' + complex.id).update(complex);
  }
  deleteComplex(complexId) {
    return this.firebaseDatabase.object('complexes/' + complexId).remove();
  }
  getComplexById(complexId) {
    return this.firebaseDatabase.object('complexes/' + complexId);
  }
  getUserComplexes(uid){
    return this.firebaseDatabase.list('complexes/', ref => ref.orderByChild('ownerId').equalTo(uid));
  }
  getAllComplexes(){
    return this.firebaseDatabase.list('complexes/');
  }
  filteredComplexes(selectedCity){
    return this.firebaseDatabase.list('complexes/', ref => ref.orderByChild('city').equalTo(selectedCity));
  }

  //image Protocols
  uploadImage(image_name, image) {
    return this.fireStorage.ref(`images/${image_name}`).putString(image, 'data_url');
  }
  getDownloadUrl(image_name) {
    return this.fireStorage.ref(`images/${image_name}`).getDownloadURL();
  }
  getComplexImages(complexId) {
    return this.firebaseDatabase.list('/complexes/' + complexId + '/images/');
  }
  deleteComplexImagesDb(complexId) {
    return this.firebaseDatabase.list('/complexes/' + complexId + '/images/').remove();
  }
  deleteComplexImagesSt(image_name) {
    return this.fireStorage.ref(`images/${image_name}`).delete();
  }
  updateComplexImages(imageURL) {
    return this.firebaseDatabase.object('/complexes/' + imageURL.complexId + '/images/' + imageURL.imageId).set(imageURL);
  }

  //Field Protocols
  saveField(field) {
    return this.firebaseDatabase.object('/complexes/' + field.complexId + '/fields/' + field.id).update(field);
  }

  deleteField(field) {
    return this.firebaseDatabase.object('/complexes/' + field.complexId + '/fields/' + field.id).remove();
  }

  //Reservation Protocols
  makeReservation(reservation) {
    return this.firebaseDatabase.object('reservations/' + reservation.id).update(reservation);
  }
  getPlayerReservations(uid) {
    return this.firebaseDatabase.list('reservations/', ref => ref.orderByChild('playerId').equalTo(uid).limitToLast(20));
  }
  getAdminReservations(uid) {
    return this.firebaseDatabase.list('reservations/', ref => ref.orderByChild('ownerId').equalTo(uid).limitToLast(20));
  }
  actionReservation(reservationId, action) {
    return this.firebaseDatabase.object('reservations/' + reservationId).update({ status: action });
  }
  deleteReservation(reservationId) {
    return this.firebaseDatabase.object('reservations/' + reservationId).remove();
  }

}
