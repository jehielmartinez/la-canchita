import { AuthenticationProvider } from './../../providers/authentication/authentication';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { User } from '../../interfaces/user';
import { LoginPage } from '../login/login';

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
  complexImages;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private authProvider: AuthenticationProvider,
    private databaseProvider: DatabaseProvider,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController) {

    this.authProvider.getStatus().subscribe((session) => {
      if (session == null) {
        this.navCtrl.setRoot(LoginPage);
      } else {
        this.databaseProvider.getUserById(session.uid).valueChanges().subscribe((user: any) => {
          this.currentUser = user;
          this.userComplexes = Object.keys(this.currentUser.complexes).map(i => this.currentUser.complexes[i])
          console.log(this.currentUser);
          console.log(this.userComplexes);
        }, (err) => {
          console.log(err);
        });
      }
    }, (err) => {
      console.log(err);
    });
  }

  getComplexImage(complexId){
    const complexImages = Object.keys(this.currentUser.complexes[complexId].images).map(i => this.currentUser.complexes[complexId].images[i]);
    return complexImages[0].imageUrl;
  }

  presentActionSheet(){
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Acciones',
      buttons: [
        {
          text: 'Editar',
          icon: 'create',
          handler: ()=>{
            console.log('Editar Complejo');
          }
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash',
          handler: ()=>{
            console.log('Eliminar Complejo');
          }
        }
      ]
    });
    actionSheet.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminHomePage');
  }

}
