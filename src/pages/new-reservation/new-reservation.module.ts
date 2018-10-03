import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewReservationPage } from './new-reservation';

@NgModule({
  declarations: [
    NewReservationPage,
  ],
  imports: [
    IonicPageModule.forChild(NewReservationPage),
  ],
})
export class NewReservationPageModule {}
