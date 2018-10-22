import { Reservation } from './../../interfaces/reservation';
import { Complex } from './../../interfaces/complex';
import { AdminHomePage } from './../admin-home/admin-home';
import { AuthenticationProvider } from './../../providers/authentication/authentication';
import { DatabaseProvider } from './../../providers/database/database';
import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { User } from '../../interfaces/user';
import { DetailComplexPage } from '../detail-complex/detail-complex';
import * as moment from 'moment';
import cities from '../../app/cities';
import { Content } from 'ionic-angular';
import { Badge } from '@ionic-native/badge';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;
  currentUser: User;
  complexes: Complex[] = [];
  segment = 'complexes';
  userReservations: Reservation[] = [];
  location: any;
  countries = ['Guatemala', 'Costa Rica', 'Honduras', 'Nicaragua', 'El Salvador', 'Panama'];
  cities = cities;
  selectedCountry = 'Honduras';
  selectedCity = 'San Pedro Sula';
  showFilter = false;
  badgeCounter: number = 0;
  selectedDate = moment().format('YYYY-MM-DD');

  constructor(public navCtrl: NavController,
    private databaseProvider: DatabaseProvider,
    public badge: Badge,
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
          console.log('User', this.currentUser);
          this.filteredComplexes();
          this.getUserReservations();
        }, (err) => {
          console.log(err);
        });
      }
    }, (err) => {
      console.log(err);
    });
  }

  toggleFilter() {
    if (this.showFilter == true) {
      this.showFilter = false;
      this.content.scrollToTop();
    } else {
      this.showFilter = true;
      this.content.scrollToTop();
    };
  }

  filter(){
    this.filteredComplexes();
    this.showFilter = false;
  }

  filteredComplexes() {
    this.databaseProvider.filteredComplexes(this.selectedCity).valueChanges().subscribe((data: any) => {
      this.complexes = data;
      this.complexes.sort((a,b) => 0.5 - Math.random());
      console.log('Complexes', this.complexes);
    }, (err) => {
      console.log(err);
    });
  }

  getAllComplexImages(complex) {
    return Object.keys(complex.images).map(i => complex.images[i]);
  }

  getUserReservations() {
    this.databaseProvider.getPlayerReservations(this.currentUser.uid, moment(this.selectedDate).format('YYYY-MM-DD')).valueChanges().subscribe((data: any) => {
      this.userReservations = data;
      this.userReservations.reverse();
      console.log('Reservations', this.userReservations);
    }, (err) => {
      console.log(err);
    });
  }

  goToDetailComplex(_complexId) {
    this.navCtrl.push(DetailComplexPage, _complexId);
  }

  dateStr(reservation: Reservation) {
    let str: String = `${moment(reservation.startDate).locale('es').format('D-MMM')} de ${moment(reservation.startDate).locale('es').format('hh:00 A')} a ${moment(reservation.endDate).locale('es').format('hh:00 A')}`
    return str
  }

  createdStr(createdAt) {
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

}
