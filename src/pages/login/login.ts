import { GooglePlus } from '@ionic-native/google-plus';
import { User } from './../../interfaces/user';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, Platform } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { HomePage } from '../home/home';
import firebase from 'firebase';

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
  user;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private databaseProvider: DatabaseProvider,
    private authProvider: AuthenticationProvider,
    private facebook: Facebook,
    private gplus: GooglePlus,
    private platform: Platform,
    private alertCtrl: AlertController) { }

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
        console.log('Error', err);
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

  async facebookLogin() {
    try {
       await this.facebook.login(['email', 'public_profile']).then((res: FacebookLoginResponse) => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
         this.authProvider.loginWithCredential(facebookCredential).then((data: any) => {
          this.user = data.user;
          console.log('Facebook Logged', this.user);
          this.databaseProvider.getUserById(this.user.uid).valueChanges().subscribe((data: User) => {
            console.log(data)
            if (data == null) {
              this.createNewAccount();
            } else {
              this.navCtrl.setRoot(HomePage);
            }
          }, (err) => {
            console.log('Error', err);
          });
        });
      }).catch((err) => {
        console.log('Error', err);
      });
    } catch (err) {
      console.log(err);
    }

  }
  googleLogin(){
    if (this.platform.is('cordova')){
      this.nativeGoogleLogin();
    } else {
      this.webGoogleLogin();
    }
  }

  async webGoogleLogin(){
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = await this.authProvider.loginWithPopUp(provider);
    } catch (err){
      console.log('Error', err);
    }
  }

  async nativeGoogleLogin() {
    try {
      const gplusUser = await this.gplus.login({
        'webClientId': '173545575110-1eg0a58li9ldvdthgm78qdos9nsoabkj.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
      })
      await this.authProvider.loginWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken)).then((data: any) => {
        this.user = data.user;
        console.log('Google Logged', this.user);
        this.databaseProvider.getUserById(this.user.uid).valueChanges().subscribe((data: User) => {
          console.log(data)
          if (data == null) {
            this.createNewAccount();
          } else {
            this.navCtrl.setRoot(HomePage);
          }
        }, (err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      })
    } catch (err) {
      console.log(err);
    }
  }

  createNewAccount() {
    const newUser: User = {
      name: this.user.displayName,
      uid: this.user.uid,
      email: this.user.email,
      phone: this.user.phoneNumber,
      avatar: this.user.photoURL,
      type: 'player'
    }
    this.databaseProvider.createNewAccount(newUser).then((data) => {
      console.log('User Registered', data);
      this.navCtrl.setRoot(HomePage);
    }).catch((err) => {
      console.log('Error', err)
    });
  }

  selectTypeAlert() {
    const prompt = this.alertCtrl.create();
    prompt.setTitle('Tipo de Usuario');
    prompt.addInput({
      type: 'checkbox',
      label: 'Jugador',
      value: 'player',
      checked: true
    });
    prompt.addInput({
      type: 'checkbox',
      label: 'Administrador',
      value: 'admin',
      checked: false
    });
    prompt.addButton({
      text: 'Ok',
      handler: data => {
        console.log('Checkbox data:', data);
        this.user.type == data;
      }
    });
    prompt.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
}
