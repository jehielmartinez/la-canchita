import { Facebook } from '@ionic-native/facebook';
import { DatabaseProvider } from './../providers/database/database';

import { AuthenticationProvider } from './../providers/authentication/authentication';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { User } from '../interfaces/user';
import { ProfilePage } from '../pages/profile/profile';
import { GooglePlus } from '@ionic-native/google-plus';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{ title: string, component: any }>;
  currentUser: User;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    private authProvider: AuthenticationProvider,
    private databaseProvider: DatabaseProvider,
    private gplus: GooglePlus,
    private facebook: Facebook,
    private app: App) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Perfil de Usuario', component: ProfilePage },
    ];

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
  logout() {
    this.authProvider.logout().then(() => {
      this.gplus.logout().then(() => {
        this.facebook.logout().then(() => {
          this.app.getRootNav().setRoot(LoginPage);
        }).catch((err) => {
          console.log(err);
        })
      }).catch((err) => {
        console.log(err);
      })
    }).catch((error) => {
      console.log(error);
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
