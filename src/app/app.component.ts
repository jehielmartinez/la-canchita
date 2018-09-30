import { AuthenticationProvider } from './../providers/authentication/authentication';
import { NewFieldPage } from './../pages/new-field/new-field';
import { AdminHomePage } from './../pages/admin-home/admin-home';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { NewComplexPage } from '../pages/new-complex/new-complex';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    private authService: AuthenticationProvider,
    private app: App) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Complejo', component: NewComplexPage},
      { title: 'Admin Home', component: AdminHomePage},
    ];

  }
  logout() {
    this.authService.logout().then(() => {
      this.app.getRootNav().setRoot(LoginPage);
    }).catch((error) => {
      console.log(error);
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
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
