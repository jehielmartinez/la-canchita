import { AuthenticationProvider } from './../../providers/authentication/authentication';
import { DatabaseProvider } from './../../providers/database/database';
import { Field } from './../../interfaces/field';
import { Complex } from './../../interfaces/complex';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { User } from '../../interfaces/user';
import { NewFieldPage } from '../new-field/new-field';

/**
 * Generated class for the DetailComplexPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail-complex',
  templateUrl: 'detail-complex.html',
})
export class DetailComplexPage {
  complexId;
  complexImages;
  complexFields: Field[];
  complex: Complex;
  currentUser: User;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    private databaseProvider: DatabaseProvider,
    private authProvider: AuthenticationProvider) {
    this.authProvider.getStatus().subscribe((session) => {
      if (session == null) {
        this.navCtrl.setRoot(LoginPage);
      } else {
        this.databaseProvider.getUserById(session.uid).valueChanges().subscribe((user: any) => {
          this.currentUser = user;
          this.complexId = navParams.data;
          this.getComplex(this.complexId);
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
      this.complexFields = this.getComplexFields();
      this.getAllComplexImages();
    }, (err) => {
      console.log(err);
    });
  }

  getAllComplexImages() {
    return this.complexImages = Object.keys(this.complex.images).map(i => this.complex.images[i]);
  }

  getComplexFields() {
    if (!this.complex.fields) {
      return
    } else {
      return Object.keys(this.complex.fields).map(i => this.complex.fields[i]);
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  deleteField(field: Field) {
    this.databaseProvider.deleteField(this.complex.userId, field).then(() => {
      console.log('Field Deleted');
    }).catch((err) => {
      console.log(err);
    });
  }

  editField(field: Field) {
    this.navCtrl.setRoot(NewFieldPage, field);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailComplexPage');
  }

}
