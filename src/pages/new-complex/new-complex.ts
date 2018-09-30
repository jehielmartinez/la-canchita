import { AdminHomePage } from './../admin-home/admin-home';
import { NewFieldPage } from './../new-field/new-field';
import { DatabaseProvider } from './../../providers/database/database';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { User } from '../../interfaces/user';
import { Complex } from '../../interfaces/complex';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { LoginPage } from '../login/login';
import cities from '../../app/cities';

/**
 * Generated class for the NewComplexPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-complex',
  templateUrl: 'new-complex.html',
})
export class NewComplexPage {
  imageId;
  currentUser: User;
  complexImages = [];
  complex: Complex = {
    id: Date.now().toString(),
    name: null,
    phone: null,
    address: null,
    city: null,
    country: null,
    weekOpenAt: null,
    weekCloseAt: null,
    weekEndOpenAt: null,
    weekEndCloseAt: null,
    options: null,
    userId: null,
    email: null,
    web: null
  }
  countries = ['Guatemala', 'Costa Rica', 'Honduras', 'Nicaragua', 'El Salvador', 'Panama'];
  cities = cities;
  editing = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private authProvider: AuthenticationProvider,
    private databaseProvider: DatabaseProvider,
    public toastCtrl: ToastController,
    private camera: Camera) {

    this.authProvider.getStatus().subscribe((session) => {
      if (session == null) {
        this.navCtrl.setRoot(LoginPage);
      } else {
        this.databaseProvider.getUserById(session.uid).valueChanges().subscribe((user: any) => {
          this.currentUser = user;
          if (navParams.data !== 'new') {
            this.getComplex(navParams.data);
            this.editing = true;
          } else {
            this.getComplexImages();
          }
          console.log(this.currentUser);
        }, (err) => {
          console.log(err);
        });
      }
    }, (err) => {
      console.log(err);
    });
  }

  getComplex(complexId) {
    this.databaseProvider.getComplexById(this.currentUser.uid, complexId).valueChanges().subscribe((data: Complex) => {
      this.complex = data;
      this.getComplexImages();
    }, (err) => {
      console.log(err);
    })
  }

  getComplexImages() {
    this.databaseProvider.getComplexImages(this.currentUser.uid, this.complex.id).valueChanges().subscribe((data) => {
      this.complexImages = data;
      console.log(this.complexImages);
    }, (err) => {
      console.log(err);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewComplexPage');
  }

  async uploadImage(source) {
    let toast = this.toastCtrl.create({
      message: 'Su primer Imagen debe ser un Logotipo',
      duration: 3000,
      position: 'top'
    });
    toast.present();
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
      const image = `data:image/jpeg;base64,${result}`
      this.imageId = Date.now();
      this.databaseProvider.uploadImage(this.imageId + '.jpg', image).then(() => {
        this.databaseProvider.getDownloadUrl(this.imageId + '.jpg').subscribe((url) => {
          let imageURL = {
            imageId: this.imageId,
            imageUrl: url,
            complexId: this.complex.id
          };
          this.databaseProvider.updateComplexImages(imageURL, this.currentUser.uid).catch(() => {
            console.log('Imagenes Actualizadas');
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
      console.log(err)
    };
  }

  async deleteComplex() {
    if (this.editing == true) {
      this.navCtrl.setRoot(AdminHomePage);
    } else {
      try {
        await this.complexImages.forEach(e => {
          this.databaseProvider.deleteComplexImagesSt(e.imageId + '.jpg').subscribe(() => {
            console.log(`Deleted Image: ${this.imageId}`);
          }, (err) => {
            console.log(err);
          });
        });
        this.databaseProvider.deleteComplex(this.currentUser.uid, this.complex.id).then(() => {
          console.log('Complex successfuly deleted');
          this.navCtrl.setRoot(AdminHomePage);
        }).catch((err) => {
          console.log(err);
        });
      } catch (err) {
        console.log(err);
      };
    }
  }

  saveComplex() {
    if (!this.complex.name) {
      this.deleteComplex();
    } else if (this.complexImages.length == 0) {
      let toast = this.toastCtrl.create({
        message: 'Debe subir al menos una Imagen',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    } else {
      this.complex.userId = this.currentUser.uid;
      this.databaseProvider.saveComplex(this.currentUser.uid, this.complex).then(() => {
        console.log('Complex Saved');
        this.navCtrl.setRoot(AdminHomePage);
      }).catch((err) => {
        console.log(err);
      });
    }
  }


}
