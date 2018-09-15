import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewComplexPage } from './new-complex';

@NgModule({
  declarations: [
    NewComplexPage,
  ],
  imports: [
    IonicPageModule.forChild(NewComplexPage),
  ],
})
export class NewComplexPageModule {}
