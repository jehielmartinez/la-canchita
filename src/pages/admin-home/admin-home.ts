import { Badge } from '@ionic-native/badge';

import { HomePage } from './../home/home';
import { DetailComplexPage } from './../detail-complex/detail-complex';
import { AuthenticationProvider } from './../../providers/authentication/authentication';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, AlertController, ModalController, LoadingController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { User } from '../../interfaces/user';
import { LoginPage } from '../login/login';
import { NewComplexPage } from '../new-complex/new-complex';
import { NewFieldPage } from '../new-field/new-field';
import { Reservation } from '../../interfaces/reservation';
import * as moment from 'moment';
import { CallNumber } from '@ionic-native/call-number';
import { Complex } from '../../interfaces/complex';

/**
 * Generated class for the AdminHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-home',
  templateUrl: 'admin-home.html',
})
export class AdminHomePage {
  currentUser: User;
  segment = 'complexes';
  userComplexes: Complex[];
  userReservations: Reservation[];
  userBlacklist: User[];
  badgeCounter: number = 0;

  loading = this.loadingCtrl.create({
    content: 'Por Favor Espere...'
  });

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private authProvider: AuthenticationProvider,
    private databaseProvider: DatabaseProvider,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    private callNumber: CallNumber,
    public loadingCtrl: LoadingController,
    public badge: Badge,
    public toastCtrl: ToastController) {

    this.authProvider.getStatus().subscribe((session) => {
      if (session == null) {
        this.navCtrl.setRoot(LoginPage);
      } else {
        this.loading.present()
        this.databaseProvider.getUserById(session.uid).valueChanges().subscribe((user: any) => {
          this.currentUser = user;
          this.loading.dismiss();
          if (this.currentUser.type !== 'admin') {
            this.navCtrl.setRoot(HomePage);
          }
          this.getUserComplexes();
          this.getReservations();
          this.getUserBlackList();
        }, (err) => {
          console.log(err);
        });
      }
    }, (err) => {
      console.log(err);
    });
  }


  getAllComplexImages(complex) {
    return Object.keys(complex.images).map(i => complex.images[i]);
  }

  getUserComplexes() {
    this.databaseProvider.getUserComplexes(this.currentUser.uid).valueChanges().subscribe((data: any) => {
      this.userComplexes = data;
      console.log(this.userComplexes);
    }, (err) => {
      console.log(err);
    });
  }
  getUserBlackList() {
    this.databaseProvider.getUserBlacklist(this.currentUser.uid).valueChanges().subscribe((data: any) => {
      this.userBlacklist = data;
      console.log('BlackList', this.userBlacklist)
    }, (err) => {
      console.log(err);
    });
  }

  getReservations() {
    this.databaseProvider.getAdminReservations(this.currentUser.uid).valueChanges().subscribe((data: any) => {
      this.userReservations = data;
      this.userReservations.reverse();
      if (this.segment == 'complexes') {
        this.badgeCounter = this.badgeCounter + 1;
      };
    }, (err) => {
      console.log(err);
    });
  }
  dateStr(reservation: Reservation) {
    let str: String = `${moment(reservation.startDate).locale('es').format('D-MMM')} de ${moment(reservation.startDate).locale('es').format('hh:00 A')} a ${moment(reservation.endDate).locale('es').format('hh:00 A')}`
    return str
  }
  createdStr(createdAt) {
    let str: String = `${moment(createdAt).locale('es').fromNow()}`
    return str
  }


  presentActionSheet(complexId) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Acciones',
      buttons: [
        {
          text: 'Editar',
          icon: 'create',
          handler: () => {
            console.log('Editar Complejo');
            this.editComplex(complexId);
          }
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.deleteConfirm(complexId, 'complex');
          }
        }
      ]
    });
    actionSheet.present();
  }

  presentReservationSheet(reservation) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Acciones',
      buttons: [
        {
          text: 'Llamar Usuario',
          icon: 'call',
          handler: () => {
            this.call(reservation.player.phone);
          }
        },
        {
          text: 'Agregar Usuario a Lista Negra',
          icon: 'list-box',
          handler: () => {
            this.addPlayerToBlacklist(reservation.player);
          }
        }
      ]
    });
    actionSheet.present();
  }

  deleteConfirm(id, type) {
    const confirm = this.alertCtrl.create({
      title: 'Eliminar',
      message: 'Si lo elimina no podra recuperarlo.  Esta seguro?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            if (type == 'complex') {
              this.deleteComplex(id);
            } else if (type == 'field') {
              // this.deleteField(id);
            }
          }
        }
      ]
    });
    confirm.present();
  }

  async deleteComplex(complexId) {
    const complexImages = this.getAllComplexImages(complexId);
    if (complexImages.length == 0) {
      this.navCtrl.setRoot(AdminHomePage);
    } else {
      try {
        await complexImages.forEach(e => {
          this.databaseProvider.deleteImageFromStorage(e.imageId + '.jpg').subscribe(() => {
            console.log(`Deleted Image: ${e.imageId}`);
          }, (err) => {
            console.log(err);
          });
        });
        this.databaseProvider.deleteComplex(complexId).then(() => {
          console.log('Complex successfuly deleted');
          this.navCtrl.setRoot(AdminHomePage);
        }).catch((err) => {
          console.log(err);
        });
      } catch{ };
    }
  }


  goToNew(select) {
    if (select == 'complex') {
      this.navCtrl.setRoot(NewComplexPage, 'new');
    } else if (select == 'field') {
      this.navCtrl.setRoot(NewFieldPage, 'new');
    }
  }

  goToDetailComplex(_complexId) {
    this.navCtrl.push(DetailComplexPage, _complexId);
  }

  editComplex(complexId) {
    this.navCtrl.push(NewComplexPage, complexId);
  }

  actionReservation(reservationId, action) {
    this.databaseProvider.actionReservation(reservationId, action).then(() => {
      console.log('Reservacion Actualizada!', action);
    }).catch((err) => {
      console.log(err);
    });
  }

  deleteReservation(reservationId) {
    this.databaseProvider.deleteReservation(reservationId).then((data) => {
      console.log('Reservacion Eliminada', data);
    }).catch((err) => {
      console.log(err);
    });
  }

  call(number) {
    this.callNumber.callNumber(number, true)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  addPlayerToBlacklist(player) {
    this.databaseProvider.addToBlacklist(this.currentUser.uid, player).then(() => {
      console.log('Player added to your BlackList');
    }).catch((err) => {
      console.log(err);
    });
  }

  checkUser(playerId) {
    let check = false;
    this.userBlacklist.forEach(element => {
      if (playerId == element.uid) {
        check = true;
      };
    });
    return check
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminHomePage');
  }

}
