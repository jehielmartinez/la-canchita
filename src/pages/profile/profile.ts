import { HomePage } from './../home/home';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DatabaseProvider } from './../../providers/database/database';
import { AuthenticationProvider } from './../../providers/authentication/authentication';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { User } from '../../interfaces/user';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  currentUser: User;
  imageId;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private authProvider: AuthenticationProvider,
    private databaseProvider: DatabaseProvider,
    private camera: Camera,
    private alertController: AlertController,
    public toastCtrl: ToastController) {

    this.authProvider.getStatus().subscribe((session) => {
      this.databaseProvider.getUserById(session.uid).valueChanges().subscribe((user: any) => {
        this.currentUser = user;
      }, (err) => {
        console.log(err);
      });
    }, (err) => {
      console.log(err);
    });
  }

  async uploadImage(source) {
    try {
      let cameraOptions: CameraOptions = {
        quality: 80,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        allowEdit: true,
      };
      cameraOptions.sourceType = (source == 'camera' ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY);
      const result = await this.camera.getPicture(cameraOptions);
      const image = `data:image/jpeg;base64,${result}`;
      this.imageId = Date.now();
      this.databaseProvider.uploadImage(this.imageId + '.jpg', image).then(() => {
        this.databaseProvider.getDownloadUrl(this.imageId + '.jpg').subscribe((url) => {
          let imageURL = {
            imageId: this.imageId,
            imageUrl: url,
            userId: this.currentUser.uid
          };
          this.databaseProvider.updateUserAvatar(imageURL).catch(() => {
            console.log('Avatar Actualizado');
          }).catch((err) => {
            console.log(err);
          });
        }, (err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    } catch (err) {
      console.log(err);
    };
  }

  saveProfile() {
    this.databaseProvider.createUser(this.currentUser).then(() => {
      let toast = this.toastCtrl.create({
        message: 'Perfil Actualizado!',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      this.navCtrl.setRoot(HomePage);
    }).catch((err) => {
      console.log(err);
    });
  }

  cancel() {
    this.navCtrl.setRoot(HomePage);
  }

  // resetPassword() {
  //   this.authProvider.changePassword('jehielmartinez@gmail.com').then(() => {
  //     console.log('Email Send!')
  //   }).catch((err) => {
  //     console.log(err);
  //   });
  // }

  resetPassword() {
    const prompt = this.alertController.create({
      title: 'Enviar Contraseña',
      message: 'Desea que enviemos un enlace a su correo con instrucciones?.',
      buttons: [{
        text: 'Cancelar',
        handler: data => {
          console.log(data);
        }
      },
      {
        text: 'Enviar',
        handler: data => {
          this.authProvider.changePassword(this.currentUser.email).then((data) => {
            let toast = this.toastCtrl.create({
              message: 'Solicitud Enviada',
              duration: 3000,
              position: 'bottom'
            })
            toast.present();
            console.log(data);
          }).catch((error) => {
            console.log(error);
          });
        }
      }
      ]
    });
    prompt.present();
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

}