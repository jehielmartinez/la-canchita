import { ProfilePage } from './../pages/profile/profile';
import { NewReservationPage } from './../pages/new-reservation/new-reservation';
import { DetailComplexPage } from './../pages/detail-complex/detail-complex';
import { AdminHomePage } from './../pages/admin-home/admin-home';
import { NewFieldPage } from './../pages/new-field/new-field';
import { Camera } from '@ionic-native/camera';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { NewComplexPage } from './../pages/new-complex/new-complex';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { AuthenticationProvider } from '../providers/authentication/authentication';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { DatabaseProvider } from '../providers/database/database';
import { HttpClientModule } from '@angular/common/http';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { ImagePicker } from '@ionic-native/image-picker';
import {IonicImageLoader} from 'ionic-image-loader';
import {CallNumber} from '@ionic-native/call-number';
import { Geolocation } from '@ionic-native/geolocation';
import { Badge } from '@ionic-native/badge';



export const firebaseConfig = {
    apiKey: "AIzaSyCjLsz4nD-6_nVdK7_bb8lbT88lppdlf84",
    authDomain: "lacanchita-433c8.firebaseapp.com",
    databaseURL: "https://lacanchita-433c8.firebaseio.com",
    projectId: "lacanchita-433c8",
    storageBucket: "lacanchita-433c8.appspot.com",
    messagingSenderId: "173545575110"
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    NewComplexPage,
    NewFieldPage,
    AdminHomePage,
    DetailComplexPage,
    NewReservationPage,
    ProfilePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,  
    AngularFireStorageModule,
    HttpClientModule,
    IonicImageViewerModule,
    IonicImageLoader.forRoot()
      ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    NewComplexPage,
    NewFieldPage,
    AdminHomePage,
    DetailComplexPage,
    NewReservationPage,
    ProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthenticationProvider,
    DatabaseProvider,
    ImagePicker,
    Camera,
    CallNumber,
    Geolocation,
    Badge
  ]
})
export class AppModule {}
