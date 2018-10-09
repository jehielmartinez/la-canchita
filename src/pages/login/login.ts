import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { User } from '../../interfaces/user';
import { HomePage } from '../home/home';

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


  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController, private databaseProvider: DatabaseProvider, private authProvider: AuthenticationProvider, private alertCtrl: AlertController) { }

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
        this.loginWithEmail();
      }).catch((err) => {
        let toast = this.toastCtrl.create({
          message: err.message,
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
        console.log('Error',err);
      });
    }).catch((err) => {
      let toast = this.toastCtrl.create({
        message: err.message,
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      console.log(err);
    });
  }

  loginWithEmail() {
    this.authProvider.loginWithEmail(this.email, this.password).then((data) => {
      console.log(data);
      let toast = this.toastCtrl.create({
        message: 'Bienvenido!',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      this.navCtrl.setRoot(HomePage);
    }).catch((err) => {
      let toast = this.toastCtrl.create({
        message: err.message,
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      console.log('Error', err);
    });
  }


  resetPassword() {
    const prompt = this.alertCtrl.create({
      title: 'Cambiar Contraseña',
      message: 'Ingrese su Email, le enviaremos un enlace con instrucciones',
      inputs: [
        {
          name: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [{
        text: 'Cancelar',
        handler: data => {
          console.log(data);
        }
      },
      {
        text: 'Enviar',
        handler: data => {
          this.authProvider.changePassword(data.email).then((data) => {
            let toast = this.toastCtrl.create({
              message: 'Solicitud Enviada',
              duration: 3000,
              position: 'bottom'
            })
            toast.present();
          }).catch((error) => {
            console.log(error);
          })
        }
      }
      ]

    });
    prompt.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
