import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { User } from '../../interfaces/user';
import { HomePage } from '../home/home';
import { NewComplexPage } from '../new-complex/new-complex';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  name: string;
  password: string;
  password2: string;
  type: string;
  phone: string;
  email: string;
  operation: string = 'login';


  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController, private databaseProvider: DatabaseProvider, private authProvider: AuthenticationProvider) {}

  registerWithEmail() {
    if (this.password !== this.password2) {
      console.log('Las contraseñas no coinciden');
      let toast = this.toastCtrl.create({
        message: 'Las Contraseñas no Coinciden!',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      return;
    }
    this.authProvider.registerWithEmail(this.email, this.password).then((data) => {
      const user: User = {
        name: this.name,
        type: this.type,
        phone: this.phone,
        uid: data.user.uid,
        email: this.email,
      };
      this.databaseProvider.createUser(user).then((data) => {
        console.log(data);
        let toast = this.toastCtrl.create({
          message: 'Usuario Registrado!',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
        if(user.type = 'admin'){
          this.navCtrl.setRoot(NewComplexPage);
        }else{
          this.navCtrl.setRoot(HomePage);
        }
      }).catch((e) => {
        console.log(e);
      });
    }).catch((e) => {
      console.log(e);
    });
  }

  loginWithEmail() {
    this.authProvider.loginWithEmail(this.email, this.password).then((data)=>{
      console.log(data);
      let toast = this.toastCtrl.create({
        message: 'Vamos a Jugar!',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      this.navCtrl.setRoot(HomePage);
    }).catch((e)=>{
      console.log(e);
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
