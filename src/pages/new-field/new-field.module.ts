import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewFieldPage } from './new-field';

@NgModule({
  declarations: [
    NewFieldPage,
  ],
  imports: [
    IonicPageModule.forChild(NewFieldPage),
  ],
})
export class NewFieldPageModule {}
