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
  endDate = '';
  notes: string = '';
  duration: number = 1;
  data: any;
  complex: Complex;
  fields: Field[] = [];
  startDate = moment().format('YYYY-MM-DDTHH:00Z');
  selectedField: Field;
  today = moment().format('YYYY-MM-DDTHH:00Z');

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
      };
    });
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
    let selectedDate = moment(this.startDate).add(this.duration, 'h').format('YYYY-MM-DDTHH:00Z');
    const reservation: Reservation = {
      id: Date.now().toString(),
      createdAt: moment().format(),
      complexId: this.data.complexId,
      complexName: this.complex.name,
      fieldName: this.selectedField.name,
      playerId: this.currentUser.uid,
      ownerId: this.data.ownerId,
      fieldId: this.data.fieldId,
      startDate: this.startDate,
      confirmed: false,
      endDate: selectedDate,
      duration: this.duration,
      notes: this.notes,
      status: 'requested',
      player: this.currentUser,
      totalPrice: this.selectedField.price * this.duration,
    };
    this.createConfirm(reservation);
  }
  uploadReservation(reservation) {
    // console.log(reservation);
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewReservationPage');
  }

}