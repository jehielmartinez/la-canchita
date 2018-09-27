import { DetailComplexPage } from './../detail-complex/detail-complex';
import { AuthenticationProvider } from './../../providers/authentication/authentication';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, AlertController, ModalController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { User } from '../../interfaces/user';
import { LoginPage } from '../login/login';
import { NewComplexPage } from '../new-complex/new-complex';
import { NewFieldPage } from '../new-field/new-field';

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
  userComplexes;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private authProvider: AuthenticationProvider,
    private databaseProvider: DatabaseProvider,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController) {

    this.authProvider.getStatus().subscribe((session) => {
      if (session == null) {
        this.navCtrl.setRoot(LoginPage);
      } else {
        this.databaseProvider.getUserById(session.uid).valueChanges().subscribe((user: any) => {
          this.currentUser = user;
          this.userComplexes = this.getUserComplexes();
          console.log(this.currentUser);
        }, (err) => {
          console.log(err);
        });
      }
    }, (err) => {
      console.log(err);
    });
  }

  getAllComplexImages(complexId) {
    const complexImages = Object.keys(this.currentUser.complexes[complexId].images).map(i => this.currentUser.complexes[complexId].images[i]);
    return complexImages
  }

  getUserComplexes() {
    if (!this.currentUser.complexes) {
      return
    } else {
      return Object.keys(this.currentUser.complexes).map(i => this.currentUser.complexes[i]);
    }
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
          this.databaseProvider.deleteComplexImagesSt(e.imageId + '.jpg').subscribe(() => {
            console.log(`Deleted Image: ${e.imageId}`);
          }, (err) => {
            console.log(err);
          });
        });
        this.databaseProvider.deleteComplex(this.currentUser.uid, complexId).then(() => {
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


  presentDetailModal(field) {
    let detailModal = this.modalCtrl.create(DetailComplexPage, field);
    // detailModal.present();
  }

  goToDetailComplex(complexId) {
    this.navCtrl.push(DetailComplexPage, complexId)
  }

  editComplex(complexId){
    this.navCtrl.push(NewComplexPage, complexId);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminHomePage');
  }

}
