import { AuthenticationProvider } from './../../providers/authentication/authentication';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, AlertController } from 'ionic-angular';
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
  userFields;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private authProvider: AuthenticationProvider,
    private databaseProvider: DatabaseProvider,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController) {

    this.authProvider.getStatus().subscribe((session) => {
      if (session == null) {
        this.navCtrl.setRoot(LoginPage);
      } else {
        this.databaseProvider.getUserById(session.uid).valueChanges().subscribe((user: any) => {
          this.currentUser = user;
          this.userComplexes = this.getUserComplexes();
          this.userFields = this.getUserFields();
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

  getUserFields() {
    if (!this.currentUser.fields) {
      return
    } else {
      return Object.keys(this.currentUser.fields).map(i => this.currentUser.fields[i]);
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
            } else if (type == 'field'){
              this.deleteField(id);
            }
          }
        }
      ]
    });
    confirm.present();
  }

  async deleteComplex(complexId) {
    const complexImages = this.getAllComplexImages(complexId);
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
    } catch{};
  }


  goToNew() {
    if (this.segment == 'complexes') {
      this.navCtrl.setRoot(NewComplexPage);
    } else if (this.segment == 'fields') {
      this.navCtrl.setRoot(NewFieldPage);
    }
  }

  deleteField(fieldId) {
    this.databaseProvider.deleteField(this.currentUser.uid, fieldId).then(() => {
      console.log('Field Deleted');
    }).catch((err) => {
      console.log(err);
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminHomePage');
  }

}
