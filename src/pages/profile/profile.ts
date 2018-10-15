import { HomePage } from './../home/home';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DatabaseProvider } from './../../providers/database/database';
import { AuthenticationProvider } from './../../providers/authentication/authentication';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { User } from '../../interfaces/user';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';


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
  uploadPercent: Observable<number>;

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
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        allowEdit: true,
      }

      cameraOptions.sourceType = (source == 'camera' ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY);
      const result = await this.camera.getPicture(cameraOptions);
      const image = `data:image/jpeg;base64,${result}`;
      this.imageId = Date.now();

      const task = this.databaseProvider.uploadImage(this.imageId + '.jpg', image)
      this.uploadPercent = task.percentageChanges();
      task.snapshotChanges().pipe(
        finalize(() => {
          this.databaseProvider.getDownloadUrl(this.imageId + '.jpg').subscribe((url) => {
            let imageURL = {
              imageId: this.imageId,
              imageUrl: url,
              userId: this.currentUser.uid
            };
            this.databaseProvider.updateUserAvatar(imageURL).then(() => {
              console.log('Avatar Actualizado');
            }).catch((err) => {
              console.log(err);
            });
          }, (err) => {
            console.log(err);
          });
        })
      ).subscribe()
    } catch (err) {
      console.log(err);
    }
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