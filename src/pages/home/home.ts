import { Complex } from './../../interfaces/complex';
import { AdminHomePage } from './../admin-home/admin-home';
import { AuthenticationProvider } from './../../providers/authentication/authentication';
import { DatabaseProvider } from './../../providers/database/database';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { User } from '../../interfaces/user';
import { DetailComplexPage } from '../detail-complex/detail-complex';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  currentUser: User;
  complexes: Complex[] = [];

  constructor(public navCtrl: NavController,
    private databaseProvider: DatabaseProvider,
    private authProvider: AuthenticationProvider) {
    this.authProvider.getStatus().subscribe((session) => {
      if (session == null) {
        this.navCtrl.setRoot(LoginPage);
      } else {
        this.databaseProvider.getUserById(session.uid).valueChanges().subscribe((user: any) => {
          this.currentUser = user;
          if (this.currentUser.type !== 'player'){
            this.navCtrl.setRoot(AdminHomePage);
          }
          console.log(this.currentUser);
          this.getComplexes();
        }, (err) => {
          console.log(err);
        });
      }
    }, (err) => {
      console.log(err);
    })
  }


    getComplexes() {
      this.databaseProvider.getAllAdmins().valueChanges().subscribe((data: any) => {
      let admins: User[] = data;
      this.complexes = [];
      admins.forEach(admin => {
         this.getUserComplexes(admin);
      });
      console.log(this.complexes);
    }, (err) => {
      console.log(err);
    })
  }

  getUserComplexes(user: User){
    Object.keys(user.complexes).map(i => user.complexes[i]).forEach(complex => {
      this.complexes.push(complex);
    });
  }

  getAllComplexImages(complex) {
    const complexImages = Object.keys(complex.images).map(i => complex.images[i]);
    return complexImages
  }
  
  goToDetailComplex(uid, _complexId) {
    this.navCtrl.push(DetailComplexPage, {
      userId: uid,
      complexId: _complexId,
    });
  }


}
