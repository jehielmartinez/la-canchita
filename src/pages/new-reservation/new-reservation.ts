import { LoginPage } from './../login/login';
import { AuthenticationProvider } from './../../providers/authentication/authentication';
import { DatabaseProvider } from './../../providers/database/database';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { User } from '../../interfaces/user';
import { Reservation } from '../../interfaces/reservation';
import { Complex } from '../../interfaces/complex';
import { Field } from '../../interfaces/field';
import * as moment from 'moment';

/**
 * Generated class for the NewReservationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-reservation',
  templateUrl: 'new-reservation.html',
})
export class NewReservationPage {
  currentUser: User;
  data: any;
  complex: Complex;
  fields: Field[] = [];
  selectedDate = moment().format('YYYY-MM-DDTHH:00Z');
  selectedField: Field;
  disponibility = [];
  today = moment().format('YYYY-MM-DDTHH:00Z');
  hours = [
    { value: '24:00', show: '00:00 am', status: 'free' },
    { value: '1:00', show: '1:00 am', status: 'free' },
    { value: '2:00', show: '2:00 am', status: 'free' },
    { value: '3:00', show: '3:00 am', status: 'free' },
    { value: '4:00', show: '4:00 am', status: 'free' },
    { value: '5:00', show: '5:00 am', status: 'free' },
    { value: '6:00', show: '6:00 am', status: 'free' },
    { value: '7:00', show: '7:00 am', status: 'free' },
    { value: '8:00', show: '8:00 am', status: 'free' },
    { value: '9:00', show: '9:00 am', status: 'free' },
    { value: '10:00', show: '10:00 am', status: 'free' },
    { value: '11:00', show: '11:00 am', status: 'free' },
    { value: '12:00', show: '12:00 pm', status: 'free' },
    { value: '13:00', show: '1:00 pm', status: 'free' },
    { value: '14:00', show: '2:00 pm', status: 'free' },
    { value: '15:00', show: '3:00 pm', status: 'free' },
    { value: '16:00', show: '4:00 pm', status: 'free' },
    { value: '17:00', show: '5:00 pm', status: 'free' },
    { value: '18:00', show: '6:00 pm', status: 'free' },
    { value: '19:00', show: '7:00 pm', status: 'free' },
    { value: '20:00', show: '8:00 pm', status: 'free' },
    { value: '21:00', show: '9:00 pm', status: 'free' },
    { value: '22:00', show: '10:00 pm', status: 'free' },
    { value: '23:00', show: '11:00 pm', status: 'free' },
  ]
  duration: number = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private databaseProvider: DatabaseProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private authProvider: AuthenticationProvider) {
    this.authProvider.getStatus().subscribe((session) => {
      if (session == null) {
        this.navCtrl.setRoot(LoginPage);
      } else {
        this.databaseProvider.getUserById(session.uid).valueChanges().subscribe((user: any) => {
          this.currentUser = user;
          this.data = navParams.data;
          this.getComplexById();
          console.log(this.data);
        }, (err) => {
          console.log(err);
        });
      }
    }, (err) => {
      console.log(err);
    });
  }

  getComplexById() {
    this.databaseProvider.getComplexById(this.data.complexId).valueChanges().subscribe((complex: Complex) => {
      this.complex = complex;
      this.fields = this.getComplexFields();
      this.getField();
    }, (err) => {
      console.log(err);
    });
  }

  getComplexFields() {
    if (!this.complex.fields) {
      return
    } else {
      return Object.keys(this.complex.fields).map(i => this.complex.fields[i]);
    }
  }

  getField() {
    this.fields.forEach(field => {
      if (field.id == this.data.fieldId) {
        this.selectedField = field;
        this.checkDisponibility();
        console.log(this.selectedField);
      };
    });
  }

  checkDisponibility() {
    this.databaseProvider.getDisponibility(this.selectedField, moment(this.selectedDate).format('YYYY-MM-DD')).valueChanges().subscribe((disp) => {
      this.disponibility = [].concat.apply([], disp);
      this.hourReserved()
      console.log('Disponibility', this.disponibility);
    }, (err) => {
      console.log('Error', err);
    });
  }

  hourReserved() {
    this.disponibility.forEach((hour)=> {
      this.hours.find(element => element.value === hour).status = 'reserved';
    });
    // return this.disponibility.some(e => e === hour);
  }

  createConfirm(reservation) {
    const confirm = this.alertCtrl.create({
      title: 'Reservar',
      message: `Desea reservar esta cancha el ${moment(reservation.startDate).locale('es').format('DD - MMMM')} desde las ${moment(reservation.startDate).format('hh:00 A')} hasta las  ${moment(reservation.endDate).format('hh:00 A')}?`,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Reservar',
          handler: () => {
            this.uploadReservation(reservation);
          }
        }
      ]
    });
    confirm.present();
  }

  makeReservation() {
    let reservedHours = [];
    this.hours.filter(e => e.status === 'selected').forEach(element => {
      reservedHours.push(moment(`${moment(this.selectedDate).format('YYYY-MM-DD')} ${element.value}`).format());
    });
    const reservation: Reservation = {
      id: Date.now().toString(),
      createdAt: moment().format(),
      complex: this.complex,
      fieldName: this.selectedField.name,
      playerId: this.currentUser.uid,
      ownerId: this.data.ownerId,
      fieldId: this.data.fieldId,
      date: moment(this.selectedDate).format('YYYY-MM-DD'),
      duration: reservedHours.length,
      status: 'requested',
      player: this.currentUser,
      totalPrice: this.selectedField.price * reservedHours.length,
      reservedHours: reservedHours,
      startDate: reservedHours[0],
      endDate: reservedHours[reservedHours.length - 1],
    };
    if (reservation.duration == 0){
      let toast = this.toastCtrl.create({
        message: 'Seleccione al menos una Hora!',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    } else {
      this.createConfirm(reservation);
    }
  }

  uploadReservation(reservation) {
    this.databaseProvider.makeReservation(reservation).then(() => {
      console.log('Reservacion Creada');
      let toast = this.toastCtrl.create({
        message: 'Canchita reservada!',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      this.navCtrl.pop();
    }).catch((err) => {
      console.log(err);
    });
  }

  cancel() {
    this.navCtrl.pop();
  }

  selectToggle() {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewReservationPage');
  }

}