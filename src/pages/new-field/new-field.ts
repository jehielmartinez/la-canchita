import { AdminHomePage } from './../admin-home/admin-home';
import { Field } from './../../interfaces/field';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { DatabaseProvider } from '../../providers/database/database';
import { User } from '../../interfaces/user';
import { LoginPage } from '../login/login';
import { NewComplexPage } from '../new-complex/new-complex';

/**
 * Generated class for the NewFieldPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-field',
  templateUrl: 'new-field.html',
})
export class NewFieldPage {
  currentUser: User;
  complexes;
  field: Field = {
    id: Date.now().toString(),
    complexId: null,
    type: null,
    grass: null,
    price: null,
    teamPlayers: null,
    name: null,
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private authProvider: AuthenticationProvider,
    private databaseProvider: DatabaseProvider,
    public toastCtrl: ToastController, ) {
    this.authProvider.getStatus().subscribe((session) => {
      if (session == null) {
        this.navCtrl.setRoot(LoginPage);
      } else {
        this.databaseProvider.getUserById(session.uid).valueChanges().subscribe((user: any) => {
          this.currentUser = user;
          if (navParams.data !== 'new'){
            this.field = navParams.data;
          };
          this.complexes = this.getUserComplexes();
          console.log(this.currentUser);
        }, (err) => {
          console.log(err);
        });
      }
    }, (err) => {
      console.log(err);
    });
  }

  getUserComplexes() {
    if (!this.currentUser.complexes) {
      let toast = this.toastCtrl.create({
        message: 'Primero registre un Complejo',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      this.navCtrl.setRoot(NewComplexPage);
    } else {
      return Object.keys(this.currentUser.complexes).map(i => this.currentUser.complexes[i]);
    }
  }

  saveField() {
    if (!this.field.name) {
      this.deleteField();
    } else {
      this.databaseProvider.saveField(this.currentUser.uid, this.field).then(() => {
        console.log('Field Saved');
        this.navCtrl.setRoot(AdminHomePage);
      }).catch((err) => {
        console.log(err);
      });
    }

  }
  
  deleteField() {
    this.databaseProvider.deleteField(this.currentUser.uid, this.field).then(() => {
      console.log('Field Deleted');
      this.navCtrl.setRoot(AdminHomePage);
    }).catch((err) => {
      console.log(err);
    })
  }

  cancel(){
    this.navCtrl.setRoot(AdminHomePage);
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad NewFieldPage');
  }

}
