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
    AdminHomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,  
    AngularFireStorageModule,
    HttpClientModule,
    IonicImageViewerModule
      ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    NewComplexPage,
    NewFieldPage,
    AdminHomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthenticationProvider,
    DatabaseProvider,
    ImagePicker,
    Camera
  ]
})
export class AppModule {}
