import { Reservation } from './../../interfaces/reservation';
import { Complex } from './../../interfaces/complex';
import { AdminHomePage } from './../admin-home/admin-home';
import { AuthenticationProvider } from './../../providers/authentication/authentication';
import { DatabaseProvider } from './../../providers/database/database';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { User } from '../../interfaces/user';
import { DetailComplexPage } from '../detail-complex/detail-complex';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  currentUser: User;
  complexes: Complex[] = [];
  segment = 'complexes';
  userReservations: Reservation[] = [];
  location: any;

  constructor(public navCtrl: NavController,
    private databaseProvider: DatabaseProvider,
    private geolocation: Geolocation, 
    private httpClient: HttpClient,
    private authProvider: AuthenticationProvider) {
    this.authProvider.getStatus().subscribe((session) => {
      if (session == null) {
        this.navCtrl.setRoot(LoginPage);
      } else {
        this.databaseProvider.getUserById(session.uid).valueChanges().subscribe((user: any) => {
          this.currentUser = user;
          if (this.currentUser.type !== 'player') {
            this.navCtrl.setRoot(AdminHomePage);
          }
          console.log(this.currentUser);
          this.getComplexes();
          this.getUserReservations();
          this.getLocation();
        }, (err) => {
          console.log(err);
        });
      }
    }, (err) => {
      console.log(err);
    })
  }


  getComplexes() {
    this.databaseProvider.getAllAdmins().valueChanges().subscribe((data: any) => {
      let admins: User[] = data;
      this.complexes = [];
      admins.forEach(admin => {
        this.getUserComplexes(admin);
      });
      console.log(this.complexes);
    }, (err) => {
      console.log(err);
    })
  }

  getUserComplexes(user: User) {
    Object.keys(user.complexes).map(i => user.complexes[i]).forEach(complex => {
      this.complexes.push(complex);
    });
  }

  getAllComplexImages(complex) {
    const complexImages = Object.keys(complex.images).map(i => complex.images[i]);
    return complexImages
  }

  getUserReservations() {
    this.databaseProvider.getPlayerReservations(this.currentUser.uid).valueChanges().subscribe((data: any) => {
      this.userReservations = data;
      console.log(this.userReservations);
    }, (err) => {
      console.log(err);
    });
  }


  goToDetailComplex(uid, _complexId) {
    this.navCtrl.push(DetailComplexPage, {
      userId: uid,
      complexId: _complexId,
    });
  }

  dateStr(reservation: Reservation){
    let str: String = `${moment(reservation.startDate).locale('es').format('D-MMM')} de ${moment(reservation.startDate).locale('es').format('hh:00 A')} a ${moment(reservation.endDate).locale('es').format('hh:00 A')}`
    return str
  }
  createdStr(createdAt){
    let str: String = `${moment(createdAt).locale('es').fromNow()}`
    return str
  }

  actionReservation(reservationId, action) {
    this.databaseProvider.actionReservation(reservationId, action).then(() => {
      console.log('Reservacion Actualizada!', action);
    }).catch((err) => {
      console.log(err);
    });
  }

  getLocation() {
    this.geolocation.getCurrentPosition().then((response) => {
      this.location = response;
      this.httpClient.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + response.coords.latitude + ',' + response.coords.longitude + '&key=AIzaSyCjLsz4nD-6_nVdK7_bb8lbT88lppdlf84').subscribe((data: any) => {
        console.log('Coordenadas', data);
      }, (error) => {
        console.log(error); 
      });
    }).catch((error) => {
      console.log(error);
    });
  }


}
